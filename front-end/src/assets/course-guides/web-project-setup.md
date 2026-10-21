# Project Files and a Local Server

JavaScript Level 1 and 2 supply the programming, DOM, HTML and CSS foundation for this work. Here, those skills become a project that can be installed, run, inspected and rebuilt from its files. The same portfolio continues through the next two units.

## What the files do

The supplied `WDF1-Portfolio-Custom-Domain/basics/starter` contains four files:

| File | Responsibility |
| --- | --- |
| `index.html` | Page structure, project cards, stylesheet link and module script tag. |
| `styles.css` | Typography, spacing, the responsive project grid and footer. |
| `main.js` | Create the deployment-list items and display the current year. |
| `package.json` | Name the project, declare Vite as a development dependency, and define `dev`, `build` and `preview`. |

The browser reads HTML, requests the stylesheet and script, and builds an in-memory document called the DOM. `document.querySelector("#deployment-list")` selects the element with that ID. For each string in `deploymentChecklist`, the script creates an `li`, assigns `textContent`, and appends it to that list. The `#year` element receives a value from `new Date().getFullYear()`. Editing the original HTML and changing the DOM in developer tools are different operations: only the saved source change survives a fresh load.

Node runs the development tools. npm reads package scripts and installs dependencies. Vite serves the project during development and transforms its source into a static build. Installing Vite does not add an application API, database or hosting account.

## Open the maintained project

Use Node.js 24, npm and Git. The [official Node.js download](https://nodejs.org/en/download) includes npm; [Git downloads](https://git-scm.com/downloads) provides the version-control tool if it is missing. Verify `node --version`, `npm --version` and `git --version` before cloning.

Select the maintained source revision in a new directory:

```sh
git clone https://github.com/instruction-material/Web-Development-Foundations.git Web-Portfolio
cd Web-Portfolio
git switch --detach 5bfdf1b25452fb65aa36d38cea6d836fdf6ae5cc
git switch -c portfolio-work
git rev-parse HEAD
```

The final command must print the selected revision before edits. Keep that checkout's root `package.json`, root `package-lock.json` and workspace `package.json`. When transferring an older export, copy its HTML, CSS and JavaScript while retaining those maintained manifests.

Use a local copy of the complete `Web-Development-Foundations` repository. Its root `package-lock.json` belongs with its root `package.json` and the declared workspace manifests. A download containing only the starter's four files does not contain that lockfile.

Open a terminal in the repository root, where both root package files are visible. Verify the tools and select only the starter workspace:

```sh
node --version
npm --version
npm ci --workspace WDF1-Portfolio-Custom-Domain/basics/starter
npm run dev --workspace WDF1-Portfolio-Custom-Domain/basics/starter -- --host 127.0.0.1 --port 5173 --strictPort
```

Use Node.js 24 with the repository's current lockfile. `npm ci` installs the recorded dependency graph and refuses incompatible manifest/lockfile pairs. Keep a failed install's actual message; do not delete the lockfile or replace the command with an unrecorded install. A missing Node command is a tool setup issue, a missing Vite command usually concerns dependencies, and an occupied port concerns a running process. These require different corrections.

Open `http://127.0.0.1:5173` in the browser while the server remains running. `127.0.0.1` is the local computer; the port selects this service. `--strictPort` makes a collision fail visibly rather than silently choosing another port. Reuse an already running copy of this same project, or stop its own terminal with Ctrl+C before restarting it. Do not stop an unrelated service.

The starter initially shows three project cards, a deployment list and an updated year. Those are baseline expectations to compare with the actual page, not proof that a server has started. A browser tab can retain an older rendered page after the server stops; a fresh request distinguishes that from a working server.

## Core project: a reproducible first edit

1. Record the repository revision, terminal directory, Node/npm versions and startup command. Open the four source files and identify their responsibilities before editing.
2. Replace one project card with a concise description of a completed learning project. Use fictional details if a personal portfolio is not appropriate. Keep the three-card structure for this first check.
3. Change one string in `deploymentChecklist`. Predict which list item will change, save `main.js`, then compare the rendered text with that prediction. The script inserts text, not HTML markup.
4. Inspect the page at 390 and 1280 CSS pixels. Check that cards and footer text fit without horizontal scrolling. Use browser zoom and keyboard navigation as separate checks; a static card need not become a focusable control.
5. Stop this server, start it again with the same command, and reload. Confirm that the saved changes and year are present, then record the actual console and terminal result. Preserve the files for the next unit.

Completion requires the saved source, a fresh page and the recorded result to agree. If installation is unavailable, the supplied [toolchain case](/course-assets/web-development-foundations/web-development-foundations-practice-pack.md#toolchain-preflight-case) supports command/error reasoning, but it does not count as an observed browser run.

## Choice: another machine's path

Copy the project into a directory whose name contains spaces, using the complete maintained repository and its lockfile. Quote the directory when changing into it. Repeat the startup without changing source paths to absolute paths. Explain why `./styles.css` is resolved from the page URL rather than the terminal's spelling of the directory.

## Challenge: a deliberate startup failure

With this project's server already running, attempt the same strict-port startup in a second terminal. Keep the first server available, record the second command's actual refusal, then end the failed attempt. Explain why changing HTML cannot fix a port collision. Finish with exactly the original server, then stop it when finished.

## Reference review

The reference uses the same four-file structure. It adds a project-section link, a metadata description, a two-column checklist/domain layout and extra checklist text. These are concrete comparison points after the starter works. Neither role contains a contact endpoint or a database, and deployment wording in a page is not evidence of actual publication.

Command references: [npm clean install](https://docs.npmjs.com/cli/v12/commands/npm-ci/), [npm workspaces](https://docs.npmjs.com/cli/v12/using-npm/workspaces/).
