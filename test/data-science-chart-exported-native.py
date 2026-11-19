"""Run every original browser chart export with the pinned native Matplotlib graph."""
from pathlib import Path
import hashlib
import io
import json
import os
import platform
import re
import signal
import subprocess
import sys
import tempfile
import time
import xml.etree.ElementTree as ET
import zipfile

import matplotlib

root = Path(__file__).resolve().parents[1]
output = Path(os.environ.get('DATA_SCIENCE_CHART_BROWSER_PROOF_DIR', 'output/data-science-chart')).resolve()
fixture = json.loads((root / 'test/fixtures/data-science-chart-code-packs.json').read_text())
browser = json.loads((output / 'proof.json').read_text())
head = subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=root, text=True).strip()
assert browser['complete'] and browser['sourceCommit'] == head
assert browser['sourceRevision'] == fixture['revision']
assert len(browser['profiles']) == 16 and len(browser['readingViews']) == 28
assert sys.version_info[:2] == (3, 14) and matplotlib.__version__ == '3.11.2'
activities = {a['item']: a for a in fixture['activities']}
results, processes = [], []
started = time.time()
digest = lambda value: hashlib.sha256(value).hexdigest()


def normalize_paths(text):
    return re.sub(r'^(Chart saved as|Weak comparison saved as) .*[/\\]([^/\\]+)$', r'\1 \2', text, flags=re.M)


def svg_contract(data, metric='mean', weak=False):
    text = data.decode('utf-8')
    tree = ET.fromstring(text)
    assert tree.tag == '{http://www.w3.org/2000/svg}svg'
    labels = ['Deliberately weak comparison'] if weak else [
        'Total recorded trips by site' if metric == 'total' else 'Mean recorded trips by site',
        'Total recorded trips' if metric == 'total' else 'Mean trips per record',
        'Synthetic collection site', 'north', 'south', 'west',
        *(['6 (n=2)', '8 (n=1)', '18 (n=3)'] if metric == 'total' else ['3 (n=2)', '8 (n=1)', '6 (n=3)'])]
    assert all(label in text for label in labels), labels
    if weak:
        return dict(deliberatelyWeak=True, sha256=digest(data), labels=labels)
    geometry = []
    for index in [3, 4, 5]:
        group = next(e for e in tree.iter() if e.get('id') == 'patch_' + str(index))
        path = next(e for e in group.iter() if e.tag.endswith('}path'))
        points = [(float(x), float(y)) for x, y in re.findall(r'[ML]\s+([-\d.]+)\s+([-\d.]+)', path.get('d'))]
        assert len(points) == 4
        assert points[0][1] == points[1][1] and points[2][1] == points[3][1]
        geometry.append(dict(bottom=points[0][1], height=points[0][1] - points[2][1]))
    heights = [6, 8, 18] if metric == 'total' else [3, 8, 6]
    for i, bar in enumerate(geometry):
        assert abs(bar['bottom'] - geometry[0]['bottom']) < 0.001
        assert abs(bar['height'] / geometry[0]['height'] - heights[i] / heights[0]) < 0.001
    return dict(metric=metric, geometry=geometry, labels=labels, sha256=digest(data))


def run(directory):
    command = [sys.executable, '-I', '-B', 'main.py']
    row = dict(parentTask=os.environ.get('CLASSES_FAMILY_TASK_ID', 'data-science-chart-native'), parentPid=os.getpid(),
               cwd=str(directory), command=command, startTime=time.time(), timeoutSeconds=60)
    child = subprocess.Popen(command, cwd=directory, stdout=subprocess.PIPE, stderr=subprocess.PIPE, start_new_session=True)
    row['pid'] = child.pid
    try:
        stdout, stderr = child.communicate(timeout=60)
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
        weak = activity['title'] == 'Weak Chart Redesign'
        for stage in ['originalExport', 'editedExport']:
            receipt = profile.get(stage)
            if not receipt:
                continue
            archive = (output / receipt['file']).read_bytes()
            assert digest(archive) == receipt['sha256']
            browser_run = profile['before' if stage == 'originalExport' else 'after']
            expected = browser_run['programStdout']
            progress = browser_run['dependencyProgress']
            names = 'Pillow, contourpy, cycler, fonttools, kiwisolver, matplotlib, numpy, packaging, pyparsing, python-dateutil, pytz, six'
            assert progress in [[], ['Loading ' + names, 'Loaded ' + names]]
            assert browser_run['stdout'] == ('\n'.join(progress) + '\n' if progress else '') + expected
            original_stage = stage == 'originalExport' and not profile.get('extensionOf')
            names_expected = {'main.py', 'data/sample.csv', 'README.md', 'requirements.txt'}
            if not original_stage:
                names_expected.add('chart.svg')
                if weak:
                    names_expected.add('chart-weak.svg')
                if profile.get('extensionOf'):
                    names_expected.add('totals.svg')
            browser_figures = {}
            with tempfile.TemporaryDirectory(prefix='chart-browser-export-') as temporary:
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
                role = 'solution' if profile.get('sourceRole') == 'reference' else 'starter'
                for name in ['data/sample.csv', 'README.md', 'requirements.txt']:
                    source = fixture['files'][activity['folder'] + '/' + role + '/' + name]
                    assert digest((project / name).read_bytes()) == source['sha256']
                if original_stage:
                    source = fixture['files'][activity['folder'] + '/' + role + '/main.py']
                    assert digest((project / 'main.py').read_bytes()) == source['sha256']
                for name in names_expected:
                    if name.endswith('.svg'):
                        browser_figures[name] = svg_contract((project / name).read_bytes(), 'total' if name == 'totals.svg' else 'mean', name.endswith('-weak.svg'))
                observed = run(project)
                observed_console = '\n'.join(line for line in observed.split('\n') if line)
                assert normalize_paths(observed_console) == normalize_paths(expected), (receipt['file'], observed, expected)
                native_names = set(names_expected) - {'main.py', 'data/sample.csv', 'README.md', 'requirements.txt'}
                if original_stage:
                    if weak:
                        native_names.add('chart-weak.svg')
                    if role == 'solution':
                        native_names.add('chart.svg')
                native_figures = {name: svg_contract((project / name).read_bytes(), 'total' if name == 'totals.svg' else 'mean', name.endswith('-weak.svg')) for name in sorted(native_names)}
                assert all(native_figures[name]['labels'] == figure['labels'] for name, figure in browser_figures.items())
                results.append(dict(file=receipt['file'], sha256=receipt['sha256'], actualStdout=observed,
                    browserStdout=browser_run['stdout'], browserProgramStdout=expected, dependencyProgress=progress,
                    matchedAfterDestinationPathNormalization=True,
                    browserFigures=browser_figures, nativeFigures=native_figures, sourceFilesByteExact=True,
                    nativePythonVersion=platform.python_version(), nativeMatplotlibVersion=matplotlib.__version__, matched=True))
    assert len(results) == 28
    accepted = True
finally:
    (output / 'native-acceptance.json').write_text(json.dumps(dict(
        accepted=accepted, sourceCommit=head, sourceRevision=fixture['revision'],
        pythonVersion=sys.version, matplotlibVersion=matplotlib.__version__, startedAt=started, finishedAt=time.time(),
        actualExports=len(results), results=results, processes=processes,
        comparisonBoundary='Original ZIP bytes and every member retained. Interpreter-dependent SVG metadata and IDs are preserved; chart labels and bar proportions are independently checked. The exact paired Matplotlib package-loading messages are retained separately from program output; console destination directories are normalized.',
        wholeCourseAccepted=False, liveDeploymentClaimed=False), indent=2) + '\n')
print(json.dumps(dict(accepted=accepted, actualExports=len(results), pythonVersion=sys.version, matplotlibVersion=matplotlib.__version__)))
