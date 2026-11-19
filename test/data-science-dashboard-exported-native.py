"""Execute every retained browser ZIP with its original input in native Python."""
from pathlib import Path
import hashlib
import io
import json
import os
import platform
import signal
import subprocess
import sys
import tempfile
import time
import zipfile

root = Path(__file__).resolve().parents[1]
output = Path(os.environ.get('DATA_SCIENCE_DASHBOARD_BROWSER_PROOF_DIR', 'output/data-science-dashboard')).resolve()
fixture = json.loads((root / 'test/fixtures/data-science-dashboard-code-packs.json').read_text())
browser = json.loads((output / 'proof.json').read_text())
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
assert browser['complete'] and browser['sourceCommit'] == head
assert browser['sourceRevision'] == fixture['revision']
assert len(browser['profiles']) == 22 and len(browser['readingViews']) == 104
assert sys.version_info[:2] == (3, 14)
activities = {a['item']: a for a in fixture['activities']}
results, processes = [], []
started = time.time()
digest = lambda data: hashlib.sha256(data).hexdigest()
csv_header = b'site_filter,minimum_trips,records,total_trips,mean_trips_per_record,state\r\n'
csv_selected = csv_header + b'west,5,2,18,9.00,ready\r\n'
csv_all = csv_header + b'all,,6,32,5.33,ready\r\n'


def edited_code(activity, marker, extension):
    code = fixture['files'][activity['folder'] + '/solution/main.py']['content']
    code += '\nprint(' + json.dumps(marker) + ')\n'
    if activity['title'] == 'Filtered Summary Export':
        code += 'main(["--site", "west", "--minimum", "5"])\n'
    if extension:
        old = '        print(render_summary(rows, site))'
        assert code.count(old) == 1
        code = code.replace(old, '''        raw_minimum = input("Minimum trips (blank for none): ").strip()
        try:
            minimum = int(raw_minimum) if raw_minimum else None
            if minimum is not None and minimum < 0:
                raise ValueError("negative minimum")
        except ValueError:
            print("Minimum must be blank or a nonnegative whole number.")
            continue
        print(render_summary(rows, site, minimum))''')
    return code.encode()


def run(directory, input_text):
    command = [sys.executable, '-I', '-B', 'main.py']
    row = dict(parentTask=os.environ.get('CLASSES_FAMILY_TASK_ID', 'data-science-dashboard-native'), parentPid=os.getpid(),
               cwd=str(directory), command=command, startTime=time.time(), timeoutSeconds=20, inputText=input_text)
    child = subprocess.Popen(command, cwd=directory, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                             stderr=subprocess.PIPE, start_new_session=True)
    row['pid'] = child.pid
    try:
        stdout, stderr = child.communicate((input_text + '\n' if input_text else '').encode(), timeout=20)
        row.update(exitCode=child.returncode, stdout=stdout.decode(), stderr=stderr.decode(), childProcessGroupCleanup='not needed')
    except subprocess.TimeoutExpired:
        os.killpg(child.pid, signal.SIGTERM)
        try:
            child.communicate(timeout=5)
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
        activity = activities[profile['activity']]
        extension = bool(profile.get('extensionOf'))
        for stage in ['originalExport', 'editedExport']:
            receipt = profile.get(stage)
            if not receipt:
                continue
            archive = (output / receipt['file']).read_bytes()
            assert digest(archive) == receipt['sha256']
            observed_browser = profile['before' if stage == 'originalExport' else 'after']
            progress = observed_browser['dependencyProgress']
            packages = 'Pillow, contourpy, cycler, fonttools, kiwisolver, matplotlib, numpy, packaging, pyparsing, python-dateutil, pytz, six'
            assert progress in [[], ['Loading ' + packages, 'Loaded ' + packages]]
            expected = observed_browser['programStdout']
            assert observed_browser['stdout'] == ('\n'.join(progress) + '\n' if progress else '') + expected
            original = stage == 'originalExport' and not extension
            role = 'solution' if profile.get('sourceRole') == 'reference' else 'starter'
            names_expected = {'main.py', 'data/sample.csv', 'README.md'}
            exported_csv = not original and activity['title'] == 'Filtered Summary Export'
            if exported_csv:
                names_expected.add('filtered-summary.csv')
            with tempfile.TemporaryDirectory(prefix='dashboard-browser-export-') as temporary:
                directory = Path(temporary)
                with zipfile.ZipFile(io.BytesIO(archive)) as zipped:
                    names = zipped.namelist()
                    assert len(names) == len(set(names)) == len(names_expected)
                    assert set(names) == set(receipt['members'])
                    tops = set()
                    for name in names:
                        path = Path(name)
                        assert not path.is_absolute() and '..' not in path.parts and len(path.parts) > 1
                        tops.add(path.parts[0])
                        data = zipped.read(name)
                        assert digest(data) == receipt['members'][name]
                        target = directory / path
                        target.parent.mkdir(parents=True, exist_ok=True)
                        target.write_bytes(data)
                    assert len(tops) == 1
                project = directory / next(iter(tops))
                assert {p.relative_to(project).as_posix() for p in project.rglob('*') if p.is_file()} == names_expected
                for name in ['data/sample.csv', 'README.md']:
                    source = fixture['files'][activity['folder'] + '/' + role + '/' + name]
                    assert digest((project / name).read_bytes()) == source['sha256']
                expected_main = fixture['files'][activity['folder'] + '/' + role + '/main.py']['content'].encode() if original else edited_code(activity, profile['marker'], extension)
                assert (project / 'main.py').read_bytes() == expected_main
                if exported_csv:
                    assert (project / 'filtered-summary.csv').read_bytes() == csv_selected
                observed = run(project, observed_browser['inputText'])
                console = '\n'.join(line for line in observed.split('\n') if line)
                assert console == expected, (receipt['file'], observed, expected)
                if activity['title'] == 'Filtered Summary Export' and (not original or role == 'solution'):
                    assert (project / 'filtered-summary.csv').read_bytes() == (csv_all if original else csv_selected)
                results.append(dict(file=receipt['file'], sha256=receipt['sha256'], actualStdout=observed,
                    browserStdout=observed_browser['stdout'], browserProgramStdout=expected, dependencyProgress=progress,
                    inputText=observed_browser['inputText'], everyArchiveMemberCompared=True,
                    exactEditedSourceVerified=True, exactGeneratedCSVVerified=exported_csv,
                    nativePythonVersion=platform.python_version(), matched=True))
    assert len(results) == 40
    assert sum(len(p[stage]['members']) for p in browser['profiles'] for stage in ['originalExport', 'editedExport'] if p.get(stage)) == 126
    assert sum(r['exactGeneratedCSVVerified'] for r in results) == 6
    accepted = True
finally:
    (output / 'native-acceptance.json').write_text(json.dumps(dict(
        accepted=accepted, sourceCommit=head, sourceRevision=fixture['revision'], pythonVersion=sys.version,
        startedAt=started, finishedAt=time.time(), actualExports=len(results), results=results, processes=processes,
        comparisonBoundary='Every original ZIP byte and member is retained. Native Python runs the exact archived source with the original browser input. Only console empty-line batching and the separately retained exact paired runtime package-loading messages are accounted for. Generated CSV bytes include exact UTF-8 field order, filter metadata and CRLF line endings.',
        wholeCourseAccepted=False, liveDeploymentClaimed=False), indent=2) + '\n')
print(json.dumps(dict(accepted=accepted, actualExports=len(results), pythonVersion=sys.version)))
