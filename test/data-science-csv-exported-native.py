"""Independently execute the actual CSV studio ZIPs retained by browser CI."""
from pathlib import Path
import hashlib
import io
import json
import os
import signal
import subprocess
import sys
import tempfile
import time
import zipfile

root = Path(__file__).resolve().parents[1]
output = Path(os.environ.get('DATA_SCIENCE_CSV_BROWSER_PROOF_DIR', 'output/data-science-csv')).resolve()
fixture = json.loads((root / 'test/fixtures/data-science-csv-code-packs.json').read_text())
browser = json.loads((output / 'proof.json').read_text())
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
assert browser['complete'] and browser['sourceCommit'] == head
assert browser['sourceRevision'] == fixture['revision']
assert len(browser['profiles']) == 22 and len(browser['readingViews']) == 80
assert sys.version_info[:2] == (3, 14)
source_activity = {a['item']: a for a in fixture['activities']}
results = []
processes = []
started = time.time()

def run(directory, script):
    command = [sys.executable, '-I', '-B', script]
    row = dict(parentTask=os.environ.get('CLASSES_FAMILY_TASK_ID', 'data-science-csv-native'), parentPid=os.getpid(),
               cwd=str(directory), command=command, startTime=time.time(), timeoutSeconds=15)
    child = subprocess.Popen(command, cwd=directory, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    row['pid'] = child.pid
    try:
        stdout, stderr = child.communicate(timeout=15)
        row.update(exitCode=child.returncode, stdout=stdout.decode(), stderr=stderr.decode(), childProcessGroupCleanup='not needed')
    except subprocess.TimeoutExpired:
        os.killpg(child.pid, signal.SIGTERM)
        try: child.communicate(timeout=5)
        except subprocess.TimeoutExpired:
            os.killpg(child.pid, signal.SIGKILL)
            child.communicate()
        row.update(exitCode=124, childProcessGroupCleanup='terminated process group')
        raise
    finally:
        row['endTime'] = time.time()
        processes.append(row)
    assert child.returncode == 0 and stderr == b'', row
    return stdout.decode().removesuffix('\n')

accepted = False
try:
    for profile in browser['profiles']:
        activity = source_activity[profile['activity']]
        for stage in ['originalExport', 'editedExport']:
            receipt = profile.get(stage)
            if not receipt: continue
            archive = (output / receipt['file']).read_bytes()
            assert hashlib.sha256(archive).hexdigest() == receipt['sha256']
            expected = profile['before' if stage == 'originalExport' else 'after']['stdout']
            with tempfile.TemporaryDirectory(prefix='csv-browser-export-') as temporary:
                directory = Path(temporary)
                with zipfile.ZipFile(io.BytesIO(archive)) as zipped:
                    names = zipped.namelist()
                    assert len(names) == 2
                    tops = set()
                    for name in names:
                        path = Path(name)
                        assert not path.is_absolute() and '..' not in path.parts
                        tops.add(path.parts[0])
                        data = zipped.read(name)
                        assert hashlib.sha256(data).hexdigest() == receipt['members'][name]
                        target = directory / path
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_bytes(data)
                    assert len(tops) == 1
                project = directory / next(iter(tops))
                assert {str(p.relative_to(project)) for p in project.rglob('*') if p.is_file()} == {'main.py', 'data/sample.csv'}
                csv = fixture['files'][activity['folder'] + '/starter/data/sample.csv']
                assert hashlib.sha256((project / 'data/sample.csv').read_bytes()).hexdigest() == csv['sha256']
                if stage == 'originalExport' and not profile.get('extensionOf'):
                    role = 'solution' if profile['sourceRole'] == 'reference' else 'starter'
                    expected_main = fixture['files'][activity['folder'] + '/' + role + '/main.py']
                    assert hashlib.sha256((project / 'main.py').read_bytes()).hexdigest() == expected_main['sha256']
                observed = run(project, 'main.py')
                assert observed == expected, (receipt['file'], expected, observed)
                results.append(dict(file=receipt['file'], sha256=receipt['sha256'], actualStdout=observed,
                                    browserStdout=expected, matched=True))
    assert len(results) == 40
    accepted = True
finally:
    (output / 'native-acceptance.json').write_text(json.dumps(dict(
        accepted=accepted, sourceCommit=head, sourceRevision=fixture['revision'],
        pythonVersion=sys.version, startedAt=started, finishedAt=time.time(),
        actualExports=len(results), results=results, processes=processes,
        wholeCourseAccepted=False, liveDeploymentClaimed=False), indent=2) + '\n')
print(json.dumps(dict(accepted=accepted, actualExports=len(results), pythonVersion=sys.version)))
