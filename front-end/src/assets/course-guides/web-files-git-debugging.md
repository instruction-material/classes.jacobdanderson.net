# Files, Git and Browser Debugging

Continue the same saved portfolio. The work here is to diagnose a failure, preserve a useful change history and reproduce a build. The setup unit establishes the server; the boundary unit explains where code runs. This unit connects those facts to an everyday edit/test/recover loop.

## Source, dependencies and output

`package.json` declares the package scripts and dependency ranges. The maintained repository's root `package-lock.json` records the resolved graph. `node_modules` contains installed dependencies. A Vite build creates `dist` inside the selected workspace. Source files are the editable inputs; generated output is rebuilt from them. Browser developer tools show a running result, which can include temporary DOM changes that are absent from source.

Run Git commands from the repository root. Before changing anything, inspect its state:

```sh
git status --short
git diff -- WDF1-Portfolio-Custom-Domain/basics/starter
git log -3 --oneline
```

An empty tracked diff means Git sees no tracked source changes; it does not prove that dependencies, ignored files or a running browser match a previous environment. A Git repository stores history in `.git`, while an exported source ZIP generally does not. A local snapshot can preserve a ZIP's files, but it cannot reconstruct missing upstream history.

## Core project: diagnose and recover

Keep a working copy or a reviewed patch of the current starter before deliberately breaking it. Change one thing at a time and restore that change before the next case.

1. **Missing stylesheet:** In `index.html`, temporarily change the stylesheet reference from `styles.css` to `missing.css`. Reload. Compare the Network response, its content type and the page's appearance. A development fallback might return HTML; record what actually happened rather than assuming every missing request receives 404. Restore the reference and retest.
2. **JavaScript failure:** In `main.js`, temporarily change `document.createElement("li")` to `document.createElementX("li")`. Reload and locate the exception's file and line in the Console. Predict why the list and the later year assignment are affected by the exception. Restore the call and verify both outputs.
3. **Selector mismatch:** Change only the `deployment-list` ID in HTML. The script's `deploymentList?.appendChild(li)` skips the append when the selector returns null. Explain why a missing list can therefore appear without an exception, while the year still updates. Restore the matching ID.
4. **Layout inspection:** At 390 and 1280 CSS pixels, inspect the `.grid` rule. Explain how `repeat(auto-fit, minmax(14rem, 1fr))` chooses available columns and how the container width limits the layout. Diagnose overflow from an actual element's computed size before changing several unrelated CSS rules.

For each case, keep the initial hypothesis, the observed request/console/layout evidence, the smallest correction and the fresh-load retest. A screenshot alone cannot identify the cause of a missing script or selector.

## Save one coherent change

After every deliberate fault is restored, make one useful content or layout improvement. Inspect the exact source diff. Stage only that improvement in a local working branch or separate exercise copy:

```sh
git diff --check
git add -- WDF1-Portfolio-Custom-Domain/basics/starter/index.html WDF1-Portfolio-Custom-Domain/basics/starter/main.js WDF1-Portfolio-Custom-Domain/basics/starter/styles.css
git diff --cached
git commit -m "Clarify portfolio project descriptions"
git status --short
```

Choose a message that describes the actual change. Review the staged diff before committing; it must not contain unrelated work or temporary faults. A commit records the reviewed files locally. Pushing and publishing a website are separate operations and are not required for this exercise.

## Build and inspect the result

From the same maintained repository root, use only the selected workspace:

```sh
npm run build --workspace WDF1-Portfolio-Custom-Domain/basics/starter
npm run preview --workspace WDF1-Portfolio-Custom-Domain/basics/starter -- --host 127.0.0.1 --port 4173 --strictPort
```

The build writes `WDF1-Portfolio-Custom-Domain/basics/starter/dist`. The preview serves that built output at `http://127.0.0.1:4173`. Inspect the page, asset requests, console and both viewport widths again. Source edits made after the build do not update this build until it is rebuilt. Stop only the preview process started for this exercise. Vite preview is a local inspection tool, not a production hosting service.

A successful build is evidence about that build command; it does not prove correct links, accessible controls, public hosting or a custom domain. Record the actual command status and browser checks separately. The [local-workflow case](/course-assets/web-development-foundations/web-development-foundations-practice-pack.md#local-workflow-case) remains available for diagnosing supplied evidence when a local build is unavailable; mark that work as analysis rather than an executed build.

## Choice: a one-commit review

Compare the parent and current version of the portfolio files in a disposable exercise branch. Explain which visible result the commit changes and which checks establish it. Preserve the current working copy instead of using a destructive reset to imitate a rollback.

## Challenge: source and stale output

After a successful build, change one heading in source while leaving the build unchanged. Compare the development page with the built preview, identify their distinct inputs and explain the difference. Rebuild, reload and verify that the preview now reflects the change. End with the intended source, matching build and no deliberate faults.

Command references: [Git diff](https://git-scm.com/docs/git-diff), [Vite build preview](https://vite.dev/guide/static-deploy.html).
