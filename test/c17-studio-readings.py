"""Compile course case drivers against verified exports and independent learners."""
import argparse
import ast
import datetime
import hashlib
import json
import os
from pathlib import Path
import re
import runpy
import shutil
import signal
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]
TASK = os.environ.get('CSE_PARENT_TASK_ID', 'c17-studio-reading-contracts')
CC = os.environ.get('CSE_CC', 'clang')
parser = argparse.ArgumentParser()
parser.add_argument('--archives', type=Path)
parser.add_argument('--case-only', action='store_true')
args = parser.parse_args()
assert args.archives is not None or args.case_only, 'Actual browser exports are required for the complete gate'
fixture = json.loads((ROOT / 'test/fixtures/c17-opening-contracts.json').read_text())
text = (ROOT / 'front-end/src/stores/courses/c17StudioProjectReading.ts').read_text()
readings = ast.literal_eval(text.split(' = ', 1)[1].strip().removesuffix(';'))
projects = fixture['studioLessons']
proof_path = Path(os.environ.get('C17_STUDIO_NATIVE_PROOF', ROOT / 'output/playwright' / ('c17-studio-native-proof-' + Path(CC).name + '.json')))
proof_path.parent.mkdir(parents=True, exist_ok=True)
log_path = proof_path.with_suffix('.processes.jsonl')


def run(command, cwd, expected=0, timeout=120, env=None):
    command = [str(value) for value in command]
    started = datetime.datetime.now(datetime.timezone.utc).isoformat()
    child = subprocess.Popen(command, cwd=cwd, env={**os.environ, **(env or {})},
                             stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                             start_new_session=True)
    cleanup = 'process exited'
    try:
        out, err = child.communicate(timeout=timeout)
    except BaseException:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        cleanup = 'child process group terminated'
        raise
    finally:
        with log_path.open('a') as log:
            log.write(json.dumps(dict(parentTaskId=TASK, cwd=str(cwd), command=command,
                                      pid=child.pid, startTime=started,
                                      endTime=datetime.datetime.now(datetime.timezone.utc).isoformat(),
                                      exitCode=child.returncode, timeoutSeconds=timeout,
                                      childProcessGroupCleanup=cleanup)) + '\n')
    assert child.returncode == expected, (command, child.returncode, (out + err).decode(errors='replace'))
    return out


archive_proof = []
case_proof = []
before = {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in [
    'test/fixtures/c17-opening-contracts.json',
    'front-end/src/stores/courses/c17StudioProjectReading.ts',
]}
with tempfile.TemporaryDirectory(prefix='c17-studio-reading-', dir=os.environ.get('TMPDIR')) as directory:
    temp = Path(directory)
    for project in projects:
        pack = project['pack']
        expected = {name.removeprefix(pack + '/'): value for name, value in fixture['files'].items() if name.startswith(pack + '/')}
        if args.archives is not None:
            for role in ['starter', 'solution']:
                archive = args.archives / (pack + '-' + role + '.zip')
                assert archive.is_file(), archive
                seen = set()
                with zipfile.ZipFile(archive) as zipped:
                    roots = {entry.filename.split('/')[0] for entry in zipped.infolist()}
                    assert len(roots) == 1
                    for entry in zipped.infolist():
                        path = Path(entry.filename)
                        assert not path.is_absolute() and '..' not in path.parts
                        relative = '/'.join(path.parts[1:])
                        assert relative == 'README.md' or relative.startswith(role + '/')
                        assert relative in expected and relative not in seen
                        assert entry.file_size <= 1024 * 1024
                        raw = zipped.read(entry)
                        assert raw == expected[relative]['content'].encode()
                        assert hashlib.sha256(raw).hexdigest() == expected[relative]['sha256']
                        seen.add(relative)
                        target = temp / pack / relative
                        target.parent.mkdir(parents=True, exist_ok=True)
                        if target.exists():
                            assert target.read_bytes() == raw
                        else:
                            target.write_bytes(raw)
                assert seen == {name for name in expected if name == 'README.md' or name.startswith(role + '/')}
                archive_proof.append(dict(pack=pack, role=role, files=sorted(seen),
                                          sha256=hashlib.sha256(archive.read_bytes()).hexdigest()))
        else:
            for relative, value in expected.items():
                target = temp / pack / relative
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(value['content'])
    for name, value in fixture['nativeStudioVerification'].items():
        assert hashlib.sha256(value['content'].encode()).hexdigest() == value['sha256']
        target = temp / 'test' / name
        target.parent.mkdir(exist_ok=True)
        target.write_text(value['content'])
    completions = runpy.run_path(str(temp / 'test/studio_learner_completions.py'))['COMPLETIONS']
    primary = {project['pack']: next(name.split('/')[-1] for name in fixture['files'] if name.startswith(project['pack'] + '/solution/') and name.endswith('.c') and name.split('/')[-1] not in ['main.c', 'tests.c']) for project in projects}
    for project in projects:
        pack = project['pack']
        completed = temp / pack / 'completed'
        shutil.copytree(temp / pack / 'starter', completed)
        path = completed / primary[pack]
        source = path.read_text()
        for marker, body in completions[pack].items():
            pattern = r'[ \t]*/\* TODO\s+' + marker + r':.*?\*/\s*.*?return\s+[A-Z_]+UNFINISHED;'
            source, count = re.subn(pattern, lambda _: body, source, count=1, flags=re.S)
            assert count == 1, (pack, marker)
        path.write_text(source)
        for lesson in project['continuationIDs']:
            reading = readings[lesson]
            code = re.search(r'~~~c\n(.*?)\n~~~', reading, re.S).group(1) + '\n'
            title = reading.splitlines()[0].split(': ', 1)[1]
            for role in ['solution', 'completed']:
                cwd = temp / pack / role
                case = cwd / 'case.c'
                case.write_text(code)
                for profile in ['Debug', 'Release']:
                    executable = cwd / 'case'
                    flags = ['-std=c17', '-Wall', '-Wextra', '-Wpedantic', '-Wconversion', '-Werror']
                    flags += ['-O1', '-g', '-fsanitize=address,undefined', '-fno-sanitize-recover=all', '-fno-omit-frame-pointer'] if profile == 'Debug' else ['-O2', '-DNDEBUG']
                    if profile == 'Debug' and os.uname().sysname == 'Linux' and 'gcc' in Path(CC).name:
                        flags += ['-fno-pie', '-no-pie']
                    run([CC, *flags, '-I.', primary[pack], case, '-o', executable], cwd)
                    output = run([executable], cwd, timeout=15)
                    assert output == (title + ': accepted\n').encode(), (lesson, output)
                    case_proof.append(dict(lesson=lesson, pack=pack, role=role,
                                           profile=profile, codeSha256=hashlib.sha256(code.encode()).hexdigest(),
                                           expectedOutput=output.decode()))
                case.unlink()
                executable.unlink()
    assert len(case_proof) == 48
    if not args.case_only:
        native_output = run(['python3', temp / 'test/native_studio_contracts.py'], temp, timeout=600,
                            env=dict(CSE_CC=CC, CSE_PARENT_TASK_ID=TASK,
                                     CSE_VALIDATION_LOG=str(proof_path.with_suffix('.base-processes.jsonl'))))
        events = [json.loads(line) for line in native_output.decode().splitlines() if line.startswith('{"event":')]
        assert len(events) == 1 and events[0]['event'] == 'verified-c17-studio-contracts'
        native = events[0]
        for key, value in dict(packs=4, sourceRoles=8, completedLearnerRoles=4,
                               debugProfiles=12, releaseProfiles=12, directBuilds=12,
                               unfinishedCasesRejected=8, acceptedContracts=16,
                               cliCases=464, fileCases=336, controlledRegressionsRejected=4,
                               sourceFilesUnchanged=True, temporaryBuildCleanup=True).items():
            assert native[key] == value, (key, native.get(key))
        print(native_output.decode(), end='')
    else:
        native = None
assert not Path(directory).exists()
assert before == {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in before}
receipt = dict(event='verified-c17-studio-reading-contracts', compiler=CC,
               lessons=12, nativeCaseExecutions=48, actualBrowserExportRoles=len(archive_proof),
               sourceRevision=fixture['revisions'][projects[0]['pack']],
               cases=case_proof, archives=archive_proof, baseNativeProof=native,
               unchangedSources=True, temporaryBuildCleanup=True)
proof_path.write_text(json.dumps(receipt, indent=2) + '\n')
print(json.dumps({key: receipt[key] for key in ['event', 'compiler', 'lessons', 'nativeCaseExecutions', 'actualBrowserExportRoles', 'sourceRevision', 'unchangedSources', 'temporaryBuildCleanup']}))
