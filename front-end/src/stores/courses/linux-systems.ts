import type { RawCourse } from "./types";
import { buildImplementationLabGuidance } from "./implementationLabGuidance";
import { applyLinuxProjectReading } from "./linuxProjectReading";
import { buildProjectGuidance } from "./projectGuidance";

const deploymentStudioContext = {
	focus: "current-release pointers, actual readiness identity, payload digests, concurrent publishers and reversible activation inside one selected optional studio",
	artifact:
		"release transition record with actual HTTP responses, symlink targets and a verified rollback",
	invariant:
		"the current pointer advances only when the selected candidate satisfies the recorded readiness and integrity conditions; a rejected candidate restores the previous target",
	exampleCase:
		"activate release B from A, retain the served page and readiness bytes, then submit a candidate whose health response is 200 but identifies a different release",
	boundaryCase:
		"reject missing health content, retain the prior pointer after failure, reverse the initial release and repeat; investigate manifest tampering and file-lock contention in the separate transfer and extension projects",
	reviewEvidence:
		"actual account and tools, candidate/current symlink targets, status and body bytes, before/after payload hashes, rollback and recovery, independent lock probes where applicable, owned PID/listener cleanup and the limits of a locally supplied manifest"
};

const operationsCapstoneContext = {
	focus: "one loopback service, a dedicated dynamic identity, read-only code, actual systemd state and journals, timer-triggered backups, separate restores and controlled incident recovery",
	artifact:
		"a versioned operations runbook with service and timer invocation identities, actual HTTP observations, verified backup manifests, two distinct restore drills and exact cleanup",
	invariant:
		"only the owned units and service tree change; successful activation requires actual health identity, backups publish only after validation and restoration never overwrites an existing destination",
	exampleCase:
		"correct the four named starter defects, render the units, verify a direct and proxied health response and inspect the first completed timer-triggered archive",
	boundaryCase:
		"restart with a missing working directory, retain the manager failure and proxy 502, restore the correct directory and observe a new invocation; reject tampered archives and preserve the last trusted backup",
	reviewEvidence:
		"environment and snapshot, exact unit and account, manager PID/UID/invocation, denied code writes, direct/proxied status and bytes, timer trigger and backup journal, digests and restored bytes, failure and corrected retest, changed fictional data, retained backups, removed units and closed listeners"
};

const linuxSystemsSourceCourse: RawCourse = {
	name: "Linux Systems",
	modules: [
		{
			title: "LS0 Setup and Tooling",
			curriculum: [
				{
					title: "Why the Linux Environment Is the Real Classroom",
					content:
						"Position the course as an operating-systems and administration class, not just a list of shell commands. Treat the Linux environment as the place where files live, services run, logs accumulate, and debugging happens, with VS Code or another editor acting only as a careful companion to terminal work."
				},
				{
					title: "Recommended Tooling on macOS",
					content:
						"On macOS, install VS Code, enable the `code` command, and prepare to work against a Linux VM, a hosted Linux box, or a remote machine over SSH. The goal is not to make macOS pretend to be Linux, but to make it easy to reach a real Linux environment and edit configuration files safely."
				},
				{
					title: "Recommended Tooling on Windows with WSL2",
					content:
						"On Windows, install WSL2 with Ubuntu, connect through the `Remote - WSL` extension, and confirm that new terminals are actually opening inside Linux rather than PowerShell. This early verification matters because the rest of the course assumes that package management, paths, permissions, and process tools are being exercised in Linux itself."
				},
				{
					title: "Course Outcomes and Daily Operating Habits",
					content:
						"By the end of the course, the expected outcome is confident filesystem navigation, config inspection and editing, service and log management, routine automation, and deployment of a small web service. Each lesson begins with a command-of-the-day drill and ends with a short note about what changed on the system, what was verified, and how to undo the change safely."
				},
				{
					title: "Project: Provision a Personal Linux Lab VM",
					content:
						"Use the personal lab starter to verify the active user, shell, kernel, package manager, and core commands needed for the course. Build a known-good Linux workspace before later units depend on paths, service management, or package installation working correctly.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Setup and Tooling",
					content:
						"Keep a running notebook for setup and tooling that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on environment identity, path problems, remote access, and shell confusion to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS1-Personal-Lab-VM/solution"
				},
				{
					title: "Setup and Tooling Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "LS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-ls0-setup-and-tooling-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-ls0-setup-and-tooling-supplemental-2/solution"
				},
				{
					title: "Setup and Tooling Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "LS0 Setup and Tooling",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-ls0-setup-and-tooling-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-ls0-setup-and-tooling-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 1: Shell Foundations",
			curriculum: [
				{
					title: "Terminal Basics, History, Pipes, Redirection, and Exit Codes",
					content:
						"The shell is a command runner that connects small tools together. Command history reduces repeated typing, pipes move output from one tool into another, redirection captures output into files, and exit codes communicate success or failure even when a command prints nothing interesting."
				},
				{
					title: "Core Navigation and File Management Commands",
					content:
						"Practice `pwd`, `ls`, `cd`, `mkdir`, `cp`, `mv`, `rm`, `cat`, `less`, `head`, and `tail` until directory traversal no longer depends on guessing. Tie every command back to a practical question: Where am I, what files are here, what changed, and how do I inspect something without damaging it."
				},
				{
					title: "Filtering and Searching in the Shell",
					content:
						"`grep`, `find`, `rg`, `sort`, `uniq`, `wc`, and `xargs` work as a family of inspection tools rather than isolated commands. Linux work scales when a command sequence can search a tree, narrow results, count patterns, and pass findings into a follow-up command without manually copying file names around."
				},
				{
					title: "Build Small Pipelines Before Writing Scripts",
					content:
						"Answer concrete questions with one pipeline at a time, such as counting log lines that contain a word or finding the largest directories in a project. This frames scripting as the next step after repeatable command-line thinking instead of as a separate skill."
				},
				{
					title: "Unit 1: Shell Foundations: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 1: Shell Foundations",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-1-shell-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-1-shell-foundations/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Shell Foundations",
					content:
						"Keep a running notebook for shell foundations that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on working-directory mistakes, quoting issues, and broken pipelines to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-1-shell-foundations/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-1-shell-foundations/solution"
				},
				{
					title: "Shell Pipeline Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 1: Shell Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-unit-1-shell-foundations-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-unit-1-shell-foundations-supplemental-2/solution"
				},
				{
					title: "Shell Pipeline Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 1: Shell Foundations",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-unit-1-shell-foundations-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-unit-1-shell-foundations-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 2: Filesystem Hierarchy and Directory Purpose",
			curriculum: [
				{
					title: "Read the Linux Filesystem as a Map of Intent",
					content:
						'Trace `/`, `/home`, `/root`, `/etc`, `/var`, `/usr`, `/opt`, `/tmp`, `/srv`, and `/dev` with the question "what belongs here and why." Path choice signals meaning: configuration in one place, durable application state in another, temporary scratch data somewhere else, and service-owned content somewhere else again.'
				},
				{
					title: "Pseudo-Filesystems: /proc and /sys",
					content:
						"`/proc` and `/sys` are live views into kernel and system state rather than ordinary persisted files. They can inspect process details, memory, mounted filesystems, or device information so Linux becomes a system that can be questioned directly."
				},
				{
					title: "Choosing Between /var, /srv, and /opt",
					content:
						"Application layout is a judgment call. Content that a service is serving often fits under `/srv`, mutable state belongs under `/var`, and self-contained optional software can live under `/opt`. A defensible layout choice is stronger than files scattered arbitrarily across whichever directory was convenient."
				},
				{
					title: "Project: Deploy a Static Site from /srv",
					content:
						"Use the static-site lab to make the directory-purpose lesson concrete by placing a document root under `/srv/linux-systems-site`, copying in content, and pairing that path with an Nginx server block. Explain why `/srv` is appropriate for served content and why `/tmp` or a random home-directory path would be a weaker production choice.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Filesystem Hierarchy and Directory Purpose",
					content:
						"Keep a running notebook for filesystem hierarchy and directory purpose that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing paths, wrong ownership, and confusing service file layout to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS2-Static-Site-from-srv/solution"
				},
				{
					title: "Filesystem Layout Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 2: Filesystem Hierarchy and Directory Purpose",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-05-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-2/solution"
				},
				{
					title: "Filesystem Layout Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 2: Filesystem Hierarchy and Directory Purpose",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-2-filesystem-hierarchy-and-directory-purpose-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 3: Users, Groups, and Permissions",
			curriculum: [
				{
					title: "Read, Write, Execute, and Directory Permission Semantics",
					content:
						"File permissions and directory permissions behave differently: execute on a directory governs traversal rather than program execution. A service may have permission to read a file and still fail if it cannot enter the directory path that contains it."
				},
				{
					title: "Ownership Changes with chmod, chown, chgrp, and umask",
					content:
						"Practice `chmod`, `chown`, `chgrp`, and `umask` as daily administrative tools rather than obscure syntax. The learning goal is to understand default file creation behavior, shared-group workflows, and the difference between changing permissions on existing content versus controlling how new files are born."
				},
				{
					title: "sudo, Service Accounts, and Least Privilege",
					content:
						"Explain why not everything runs as root and why long-lived services often need dedicated identities. Connect least privilege to practical decisions such as document-root ownership, writable log directories, and the account that owns deployed application code."
				},
				{
					title: "Permission Debugging as a Systems Skill",
					content:
						"Use realistic failures such as `Permission denied` during a deploy, an unreadable log file, or a web server that cannot open its content directory. Build the habit of checking user identity, group membership, file ownership, and mode bits before making random permission changes."
				},
				{
					title: "Unit 3: Users, Groups, and Permissions: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 3: Users, Groups, and Permissions",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-3-users-groups-and-permissions/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-3-users-groups-and-permissions/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Users, Groups, and Permissions",
					content:
						"Keep a running notebook for users, groups, and permissions that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on permission denied errors, incorrect owners, and over-broad chmod use to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-3-users-groups-and-permissions/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-06-unit-3-users-groups-and-permissions/solution"
				},
				{
					title: "Permissions Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 3: Users, Groups, and Permissions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-3-users-groups-and-permissions-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-3-users-groups-and-permissions-supplemental-2/solution"
				},
				{
					title: "Permissions Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 3: Users, Groups, and Permissions",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-3-users-groups-and-permissions-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-3-users-groups-and-permissions-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 4: Editing and Configuration",
			curriculum: [
				{
					title: "Terminal Editing with nano, vim, sed, and tee",
					content:
						"Confident Linux editing matters more than editor identity. `nano` and `vim` handle interactive edits, while `sed` and `tee` support controlled replacements, scripted updates, and privilege-bound writes."
				},
				{
					title: "Safe Configuration Editing Patterns",
					content:
						"Model a careful workflow: inspect the current file, copy a backup, edit one focused section, run the service's validation command if available, and only then reload. This matters because many production outages are not caused by writing the config at all; they are caused by editing without a validation-and-rollback habit."
				},
				{
					title: "Environment Files and Service-Specific Configuration",
					content:
						"Applications often separate executable code from environment settings, secrets, or per-service overrides. Environment files are useful because they make configuration explicit, reusable, and traceable enough that another operator can reconstruct the service later."
				},
				{
					title: "Readable Configs Beat Clever Configs",
					content:
						"Favor clear comments, stable indentation, and small focused changes over dense one-liners that are hard to audit later. A Linux operator returning to a file three weeks later can still identify what changed, why it changed, and how to verify it."
				},
				{
					title: "Unit 4: Editing and Configuration: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 4: Editing and Configuration",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-4-editing-and-configuration/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-4-editing-and-configuration/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Editing and Configuration",
					content:
						"Keep a running notebook for editing and configuration that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on syntax mistakes, partial edits, missing backups, and forgotten validation steps to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-4-editing-and-configuration/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-07-unit-4-editing-and-configuration/solution"
				},
				{
					title: "Configuration Editing Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 4: Editing and Configuration",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-4-editing-and-configuration-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-4-editing-and-configuration-supplemental-2/solution"
				},
				{
					title: "Configuration Editing Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 4: Editing and Configuration",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-4-editing-and-configuration-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-4-editing-and-configuration-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 5: Processes and Job Control",
			curriculum: [
				{
					title: "Inspecting Processes with ps, top, and htop",
					content:
						"Process inspection answers what is running, who owns it, how much CPU or memory it is using, and whether it still matches the expected command line. Snapshot tools like `ps` help with point-in-time questions, while live views like `top` or `htop` are better for active performance problems."
				},
				{
					title: "Signals, kill, pkill, and Process Shutdown",
					content:
						"`kill` sends signals rather than magically destroying processes. Compare graceful termination to forceful termination and inspect why a process is stuck before escalating to stronger signals."
				},
				{
					title: "Foreground Jobs, Background Jobs, nohup, and Shell Sessions",
					content:
						"Use a toy command to show how backgrounding works, what the jobs table tracks, and why `nohup` changes the survival story when a terminal closes. This bridges ad hoc command-line operation and real service management."
				},
				{
					title: "Zombies, Orphans, and Process Ownership",
					content:
						"Zombies and orphans are bookkeeping realities of process supervision rather than mysterious trivia. A parent process that fails to reap a child leaves evidence in the process table, and proper service management is safer than leaving long-lived application processes attached to random shells."
				},
				{
					title: "Unit 5: Processes and Job Control: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 5: Processes and Job Control",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-5-processes-and-job-control/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-5-processes-and-job-control/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Processes and Job Control",
					content:
						"Keep a running notebook for processes and job control that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on stuck jobs, wrong PIDs, signal misuse, and shell-session surprises to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-5-processes-and-job-control/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-08-unit-5-processes-and-job-control/solution"
				},
				{
					title: "Process Control Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 5: Processes and Job Control",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-5-processes-and-job-control-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-5-processes-and-job-control-supplemental-2/solution"
				},
				{
					title: "Process Control Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 5: Processes and Job Control",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-5-processes-and-job-control-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-5-processes-and-job-control-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 6: Services and systemd",
			curriculum: [
				{
					title: "What a Service Is and Why systemd Matters",
					content:
						"Frame services as named, supervised processes that survive shell exits, expose status, and restart predictably when something goes wrong. `systemd` matters because it gives Linux a common language for startup ordering, service lifecycle management, logging integration, and scheduled work."
				},
				{
					title: "Reading Unit Files",
					content:
						"A unit file has a visible structure: `[Unit]`, `[Service]`, and `[Install]` sections each have a role. Working directory, executable path, environment variables, user identity, and restart policy belong in the service definition instead of being left to memory."
				},
				{
					title: "Daily Commands: status, start, stop, restart, reload, enable, disable",
					content:
						"`systemctl status/start/stop/restart/reload/enable/disable` form a minimal operator toolkit. The important distinctions are when reload is safer than restart, when enable affects future boots instead of the current session, and how to verify state after each action."
				},
				{
					title: "Dependencies, Startup Ordering, and Environment Overrides",
					content:
						"Services often depend on networking, storage, or other daemons becoming ready first. Simple examples show why startup ordering, drop-in overrides, and environment files matter for predictable boots and maintainable operations."
				},
				{
					title: "Project: Create a systemd Service for a Toy App",
					content:
						"Use the toy-service lab to package a simple long-running process under `systemd` and then operate it with start, stop, restart, enable, and log inspection commands. The finished service record includes justification for each path, user, restart policy, and environment choice in the unit file rather than treating service files as boilerplate.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Services and systemd",
					content:
						"Keep a running notebook for services and systemd that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on bad ExecStart paths, missing working directories, failed boots, and restart loops to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS5-Systemd-Toy-Service/solution"
				},
				{
					title: "systemd Service Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 6: Services and systemd",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-13-unit-6-services-and-systemd-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-13-unit-6-services-and-systemd-supplemental-2/solution"
				},
				{
					title: "systemd Service Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 6: Services and systemd",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-14-unit-6-services-and-systemd-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-14-unit-6-services-and-systemd-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 7: Logging and Observability",
			curriculum: [
				{
					title: "journalctl as the First Stop for Service Debugging",
					content:
						"`journalctl` is the central way to read systemd-managed service output, boot logs, and recent failures. Scope logs by unit, boot, and time window so the output answers targeted questions instead of dumping enormous unfiltered history."
				},
				{
					title: "Application Logs vs System Logs",
					content:
						"Differentiate between logs written by applications, logs written by services through the journal, and platform logs about the machine itself. This distinction separates code behavior, service supervision, and deeper machine problems."
				},
				{
					title: "Log Rotation and Retention",
					content:
						"Explain why logs cannot grow forever and why reliable systems choose explicit retention policies. Use simple examples of access logs, error logs, and archived logs to show how observability has to be balanced with disk usage and operational hygiene."
				},
				{
					title: "Diagnosing Boot Failures and Service Crashes",
					content:
						"Work through a break/fix story where a service fails after a bad config change or a wrong file path. Start with status, move to recent logs, identify the first trustworthy error, and only then decide whether the fix is a config repair, a path correction, or a permission change."
				},
				{
					title: "Unit 7: Logging and Observability: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 7: Logging and Observability",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-7-logging-and-observability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-7-logging-and-observability/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Logging and Observability",
					content:
						"Keep a running notebook for logging and observability that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on log scoping, noisy output, missing files, and crash-timeline reconstruction to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-7-logging-and-observability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-09-unit-7-logging-and-observability/solution"
				},
				{
					title: "Log Investigation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 7: Logging and Observability",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-15-unit-7-logging-and-observability-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-15-unit-7-logging-and-observability-supplemental-2/solution"
				},
				{
					title: "Log Investigation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 7: Logging and Observability",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-16-unit-7-logging-and-observability-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-16-unit-7-logging-and-observability-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 8: Scheduling and Automation",
			curriculum: [
				{
					title: "cron and Crontab Syntax",
					content:
						"`cron` is the classic scheduling tool for repeatable command execution. The practical skills are reading the five timing fields, testing a command manually before scheduling it, and writing crontab commands with full paths and explicit assumptions."
				},
				{
					title: "Cron Environment Gotchas",
					content:
						"Scheduled jobs often run with a smaller environment than interactive shells. Missing PATH entries, relative paths, and unstated shell assumptions are routine sources of failure, so scheduled commands need to be self-sufficient and observable."
				},
				{
					title: "systemd Timers vs cron",
					content:
						"Compare `systemd` timers to `cron` in terms of logging, service integration, missed-run behavior, and operational visibility. The aim is not to declare one winner forever, but to choose the right scheduling surface for the kind of system being operated."
				},
				{
					title: "Automating Cleanup and Backup Tasks",
					content:
						"Cleanup and backup examples show how small shell scripts become maintainable operational tools when they are idempotent, logged, and scheduled deliberately. A reliable scheduled task includes verification, retention thinking, and a failure story instead of only a command that seems to work once."
				},
				{
					title: "Project: Write a Backup Script and Schedule It with cron and a Timer",
					content:
						"Use the backup lab to build a small archive script, schedule it first with `cron` and then with a `systemd` timer, and compare the operational experience. Explain what changed in observability, environment handling, and reliability when moving between the two schedulers.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Scheduling and Automation",
					content:
						"Keep a running notebook for scheduling and automation that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing PATH entries, silent cron failures, and timer verification to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS6-Backup-Cron-and-Timer/solution"
				},
				{
					title: "Automation Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 8: Scheduling and Automation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-17-unit-8-scheduling-and-automation-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-17-unit-8-scheduling-and-automation-supplemental-2/solution"
				},
				{
					title: "Automation Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 8: Scheduling and Automation",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-18-unit-8-scheduling-and-automation-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-18-unit-8-scheduling-and-automation-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 9: Package Management and Software Layout",
			curriculum: [
				{
					title: "Package Managers: apt, dnf, yum, and Related Tools",
					content:
						"Package management is the operating system's official mechanism for installing, upgrading, and removing software with tracked dependencies. Command syntax differs across distributions, but the underlying administrative questions stay the same: what is installed, where did it come from, and how will it be updated safely later."
				},
				{
					title: "Package Install vs Source Build vs Tarball Drop",
					content:
						"Compare system packages, source builds, and manually unpacked tarballs in terms of traceability, maintenance burden, and filesystem placement. Software that appears in production without a clear install method, owner, or upgrade path is operationally suspect."
				},
				{
					title: "Understand Where Installed Software Lives",
					content:
						"Package management connects directly to filesystem layout because binaries, libraries, config files, and service units can end up under different directories. Inspect the package view and filesystem view of software together instead of assuming that an installed app is a single folder."
				},
				{
					title: "Keeping Systems Patched without Losing Control",
					content:
						"Patching balances timeliness with operational confidence. Read what will change, understand whether a service restart is implied, and record what was upgraded so post-change debugging has an audit trail."
				},
				{
					title: "Unit 9: Package Management and Software Layout: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 9: Package Management and Software Layout",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-9-package-management-and-software-layout/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-9-package-management-and-software-layout/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Package Management and Software Layout",
					content:
						"Keep a running notebook for package management and software layout that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on missing commands, package-version confusion, and untracked manual installs to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-9-package-management-and-software-layout/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-10-unit-9-package-management-and-software-layout/solution"
				},
				{
					title: "Package Layout Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 9: Package Management and Software Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-19-unit-9-package-management-and-software-layout-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-19-unit-9-package-management-and-software-layout-supplemental-2/solution"
				},
				{
					title: "Package Layout Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 9: Package Management and Software Layout",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-20-unit-9-package-management-and-software-layout-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-20-unit-9-package-management-and-software-layout-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 10: Networking from a Systems View",
			curriculum: [
				{
					title: "Inspect Interfaces and Routes with ip",
					content:
						"`ip` is the modern way to inspect addresses, interfaces, and routes. It answers basic systems questions such as whether the machine has an address, which interface owns it, and where packets are expected to go next."
				},
				{
					title: "Listening Services and Sockets with ss",
					content:
						"Use `ss` to connect network thinking back to process thinking. Inspect which ports are listening, whether an expected service is actually bound, and whether a reverse proxy or app process is reachable on the port the rest of the configuration assumes."
				},
				{
					title: "Testing Connectivity with ping, curl, and dig",
					content:
						"`ping`, `curl`, and `dig` are distinct tools with distinct jobs: reachability, HTTP-level testing, and DNS inspection. Replace hand-wavy networking guesses with specific checks at the right layer."
				},
				{
					title: "Bridge to a Networking Course without Losing the Systems Lens",
					content:
						"Keep the focus on the administrator's day-to-day needs: is the interface up, is the route present, is DNS returning what I expect, and is the service listening where the proxy thinks it is. That systems lens builds enough network competence to operate a host before a deeper networking course."
				},
				{
					title: "Unit 10: Networking from a Systems View: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 10: Networking from a Systems View",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-10-networking-from-a-systems-view/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-10-networking-from-a-systems-view/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Networking from a Systems View",
					content:
						"Keep a running notebook for networking from a systems view that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on wrong bind addresses, DNS mismatches, missing routes, and dead ports to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-10-networking-from-a-systems-view/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-11-unit-10-networking-from-a-systems-view/solution"
				},
				{
					title: "Network Diagnostics Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 10: Networking from a Systems View",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-21-unit-10-networking-from-a-systems-view-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-21-unit-10-networking-from-a-systems-view-supplemental-2/solution"
				},
				{
					title: "Network Diagnostics Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 10: Networking from a Systems View",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-22-unit-10-networking-from-a-systems-view-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-22-unit-10-networking-from-a-systems-view-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 11: Web Servers",
			curriculum: [
				{
					title: "Nginx Fundamentals",
					content:
						"Nginx can operate as both a static file server and a reverse proxy. Understand the role of a `server` block, a document root, a location block, and the difference between testing config syntax and actually reloading the service."
				},
				{
					title: "Apache Fundamentals",
					content:
						"Apache is another major hosting surface with a different configuration style but many of the same core ideas. The comparison identifies the Apache equivalents of document roots, virtual hosts, access and error logs, and configuration activation."
				},
				{
					title: "Reverse Proxy vs Static File Serving",
					content:
						"Explain the operational difference between serving files directly from disk and forwarding requests to an upstream application. This distinction is central to real Linux work because it shapes the first outage checks: the content path, the web server config, the upstream process, or the network path between them."
				},
				{
					title: "TLS, Virtual Hosts, Server Blocks, Reload vs Restart",
					content:
						"Even if the full TLS setup is saved for later, learn the vocabulary and the lifecycle commands. A careful operator validates config, reloads when possible, restarts only when necessary, and understands that multi-site hosting depends on explicit host-based routing whether the server is Nginx or Apache."
				},
				{
					title: "Project: Run a Small App Behind Nginx",
					content:
						"Use the reverse-proxy lab to place a toy application on an internal port and then serve it through Nginx. This project requires independent app verification, listening-socket confirmation, proxy-header inspection, and evidence about whether a bug lives in the app, the proxy, or the network path between them.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/solution"
				},
				{
					title: "Project: Configure an Apache Virtual Host and Compare It to Nginx",
					content:
						"Use the Apache lab to serve a parallel site and write a short compare-and-contrast note between Apache `<VirtualHost>` configuration and Nginx `server` blocks. The point is to make more than one web server family understandable without losing the underlying mental model.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS4-Apache-Virtual-Host-Compare/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS4-Apache-Virtual-Host-Compare/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Web Servers",
					content:
						"Keep a running notebook for web servers that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on syntax errors, bad roots, proxy loops, wrong ports, and reload-vs-restart mistakes to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS3-Nginx-Reverse-Proxy-App/solution"
				},
				{
					title: "Web Server Deployment Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 11: Web Servers",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-23-unit-11-web-servers-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-23-unit-11-web-servers-supplemental-2/solution"
				},
				{
					title: "Web Server Deployment Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle: "Unit 11: Web Servers",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-24-unit-11-web-servers-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-24-unit-11-web-servers-supplemental-3/solution"
				}
			]
		},
		{
			title: "Unit 12: Storage, Backups, and Reliability",
			curriculum: [
				{
					title: "Disks, Mounts, and Capacity with df, du, mount, and fstab",
					content:
						'Storage management starts from operator questions that come up in real systems work: what is mounted, how full is it, and what will happen on the next boot. Distinguish device-level thinking from directory-level usage so a problem can be classified as "the filesystem is full" or "one path is unexpectedly large."'
				},
				{
					title: "Backup Patterns for Small Linux Systems",
					content:
						"Backups are a reliability practice rather than a checkbox. Think about what must be preserved, how often it changes, where archives belong, how retention works, and how to tell whether a backup succeeded beyond simply seeing that a file was created."
				},
				{
					title: "log and tmp Cleanup as Operational Hygiene",
					content:
						"Connect cleanup to both reliability and security by showing how leftover logs, temporary files, and stale archives can consume space or expose unnecessary data. Learn that predictable cleanup is part of stable system behavior, not an afterthought once the machine is already in trouble."
				},
				{
					title: "Recovery Workflow after a Bad Config Change",
					content:
						"End the course with recovery discipline: find the most recent change, validate syntax, compare against backups, rollback narrowly, and document the incident. Leave knowing that reliable operations is not the absence of mistakes; it is the presence of a repeatable recovery workflow when a change goes wrong."
				},
				{
					title: "Unit 12: Storage, Backups, and Reliability: Core Project",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 12: Storage, Backups, and Reliability",
						projectKind: "core",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-12-storage-backups-and-reliability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-12-storage-backups-and-reliability/solution"
				}
			],
			supplementalProjects: [
				{
					title: "Troubleshooting Notebook: Storage, Backups, and Reliability",
					content:
						"Keep a running notebook for storage, backups, and reliability that records the command you ran, what output you expected, what actually happened, and how you corrected the issue. Focus this notebook on full disks, bad mounts, failed backups, and rollback after broken config changes to build the habit of turning one-off mistakes into reusable operating knowledge.",
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-12-storage-backups-and-reliability/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-12-unit-12-storage-backups-and-reliability/solution"
				},
				{
					title: "Backup Reliability Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 12: Storage, Backups, and Reliability",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-25-unit-12-storage-backups-and-reliability-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-25-unit-12-storage-backups-and-reliability-supplemental-2/solution"
				},
				{
					title: "Backup Reliability Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Unit 12: Storage, Backups, and Reliability",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-26-unit-12-storage-backups-and-reliability-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-26-unit-12-storage-backups-and-reliability-supplemental-3/solution"
				}
			]
		},
		{
			title: "Linux Systems Lab 14: Service Deployment Studio",
			curriculum: [
				{
					title: "Service Deployment Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						section: "concepts",
						context: deploymentStudioContext
					})
				},
				{
					title: "Service Deployment Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						section: "example",
						context: deploymentStudioContext
					})
				},
				{
					title: "Service Deployment Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						section: "coreProject",
						context: deploymentStudioContext
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-linux-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-linux-systems-lab-14/solution"
				},
				{
					title: "Service Deployment Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						section: "review",
						context: deploymentStudioContext
					})
				}
			],
			supplementalProjects: [
				{
					title: "Service Deployment Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						section: "extension",
						context: deploymentStudioContext
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-linux-systems-lab-14/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-01-linux-systems-lab-14/solution"
				},
				{
					title: "Service Deployment Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-27-applied-studio-14-linux-systems-lab-14-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-27-applied-studio-14-linux-systems-lab-14-supplemental-2/solution"
				},
				{
					title: "Service Deployment Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 14: Service Deployment Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-28-applied-studio-14-linux-systems-lab-14-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-28-applied-studio-14-linux-systems-lab-14-supplemental-3/solution"
				}
			]
		},
		{
			title: "Linux Systems Lab 15: Automation and Observability Studio",
			curriculum: [
				{
					title: "Automation and Observability Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						section: "concepts"
					})
				},
				{
					title: "Automation and Observability Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						section: "example"
					})
				},
				{
					title: "Automation and Observability Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-linux-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-linux-systems-lab-15/solution"
				},
				{
					title: "Automation and Observability Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Automation and Observability Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-linux-systems-lab-15/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-02-linux-systems-lab-15/solution"
				},
				{
					title: "Automation Observability Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-29-applied-studio-15-linux-systems-lab-15-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-29-applied-studio-15-linux-systems-lab-15-supplemental-2/solution"
				},
				{
					title: "Automation Observability Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 15: Automation and Observability Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-30-applied-studio-15-linux-systems-lab-15-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-30-applied-studio-15-linux-systems-lab-15-supplemental-3/solution"
				}
			]
		},
		{
			title: "Linux Systems Lab 16: Backup Recovery Studio",
			curriculum: [
				{
					title: "Backup Recovery Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						section: "concepts"
					})
				},
				{
					title: "Backup Recovery Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						section: "example"
					})
				},
				{
					title: "Backup Recovery Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						section: "coreProject"
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-linux-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-linux-systems-lab-16/solution"
				},
				{
					title: "Backup Recovery Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						section: "review"
					})
				}
			],
			supplementalProjects: [
				{
					title: "Backup Recovery Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						section: "extension"
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-linux-systems-lab-16/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-03-linux-systems-lab-16/solution"
				},
				{
					title: "Backup Recovery Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-31-applied-studio-16-linux-systems-lab-16-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-31-applied-studio-16-linux-systems-lab-16-supplemental-2/solution"
				},
				{
					title: "Backup Recovery Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 16: Backup Recovery Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-32-applied-studio-16-linux-systems-lab-16-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-32-applied-studio-16-linux-systems-lab-16-supplemental-3/solution"
				}
			]
		},
		{
			title: "Linux Systems Lab 17: Operations Capstone Studio",
			curriculum: [
				{
					title: "Operations Capstone Studio: Core Concepts",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						section: "concepts",
						context: operationsCapstoneContext
					})
				},
				{
					title: "Operations Capstone Studio: Guided Example",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						section: "example",
						context: operationsCapstoneContext
					})
				},
				{
					title: "Operations Capstone Studio: Core Project",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						section: "coreProject",
						context: operationsCapstoneContext
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-linux-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-linux-systems-lab-17/solution"
				},
				{
					title: "Operations Capstone Studio: Review",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						section: "review",
						context: operationsCapstoneContext
					})
				}
			],
			supplementalProjects: [
				{
					title: "Operations Capstone Studio: Extension Challenge",
					content: buildImplementationLabGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						section: "extension",
						context: operationsCapstoneContext
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-linux-systems-lab-17/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-04-linux-systems-lab-17/solution"
				},
				{
					title: "Operations Capstone Transfer Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-33-applied-studio-17-linux-systems-lab-17-supplemental-2/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-33-applied-studio-17-linux-systems-lab-17-supplemental-2/solution"
				},
				{
					title: "Operations Capstone Extension Practice",
					content: buildProjectGuidance({
						courseFamily: "Linux systems",
						moduleTitle:
							"Linux Systems Lab 17: Operations Capstone Studio",
						projectKind: "extension",
						hasReference: true
					}),
					projectLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-34-applied-studio-17-linux-systems-lab-17-supplemental-3/starter",
					solutionLink:
						"https://github.com/instruction-material/Linux-Systems/tree/main/LS-34-applied-studio-17-linux-systems-lab-17-supplemental-3/solution"
				}
			]
		}
	]
};

interface LinuxSystemsModuleFlow {
	stage: string;
	estimatedTime: string;
	keyBlocks: string[];
	practiceSection: string;
	answerSection: string;
	route: string;
	safeRoute: string;
	evidence: string;
	reference: string;
}

const LINUX_PRACTICE_PACK =
	"/course-assets/linux/linux-systems-practice-pack.md";
const LINUX_VERIFICATION_GUIDE =
	"/course-assets/linux/linux-systems-verification-guide.md";
const LINUX_PRIMARY_MODULE_COUNT = 13;

const LINUX_MODULE_FLOW: Record<string, LinuxSystemsModuleFlow> = {
	"LS0 Setup and Tooling": {
		stage: "Lab readiness",
		estimatedTime: "2–3 sessions · 45–60 minutes each",
		keyBlocks: [
			"owned environment",
			"distribution identity",
			"unprivileged user",
			"snapshot",
			"command inventory",
			"rollback note"
		],
		practiceSection: "lab-readiness-and-scope-case",
		answerSection: "lab-readiness-and-scope-key",
		route: "Start with an owned Ubuntu Server 26.04 LTS VM or WSL2 instance, with Debian 13 as a supported comparison route. Record `/etc/os-release`, kernel, architecture, init system, package manager, active user, group membership, network mode, snapshot identifier, and course workspace before changing state.",
		safeRoute:
			"Use an unprivileged account for ordinary work, inspect sudo availability without changing policy, and keep service or package labs off the host operating system. The supplied environment transcript completes the same reasoning when a compatible VM is unavailable.",
		evidence:
			"A readiness record identifies the actual Linux context, proves the workspace can be reopened, distinguishes host from guest paths, names missing tools without blindly installing them, and includes a tested snapshot or file-level reset route.",
		reference: "https://documentation.ubuntu.com/release-notes/26.04/"
	},
	"Unit 1: Shell Foundations": {
		stage: "Inspect and compose",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"quoting",
			"pipeline",
			"redirection",
			"exit status",
			"safe filename",
			"repeatable command"
		],
		practiceSection: "shell-pipeline-and-exit-status-case",
		answerSection: "shell-pipeline-and-exit-status-key",
		route: "Build command lines from one observable question at a time: identify inputs, quote variables and paths, transform output with small tools, preserve diagnostics deliberately, and inspect the final exit status before turning the pipeline into a script.",
		safeRoute:
			"Run against the supplied read-only directory and log fixture. Preview path sets before `xargs` or file changes, use null-delimited routes where filenames demand them, and keep deletion out of the foundational pipeline.",
		evidence:
			"The same pipeline handles zero, one, and multiple matches; filenames with spaces remain intact; output and diagnostics go to the intended destinations; and the reported exit status matches the command whose success matters.",
		reference: "https://www.gnu.org/software/bash/manual/bash.html"
	},
	"Unit 2: Filesystem Hierarchy and Directory Purpose": {
		stage: "Inspect and compose",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"FHS purpose",
			"persistent state",
			"transient state",
			"pseudo-filesystem",
			"service content",
			"path ownership"
		],
		practiceSection: "filesystem-purpose-and-path-case",
		answerSection: "filesystem-purpose-and-path-key",
		route: "Classify configuration, served content, mutable application state, logs, optional software, temporary files, devices, and kernel views before choosing a path. Treat `/proc` and `/sys` as live interfaces and inspect them without presenting every entry as an ordinary persisted file.",
		safeRoute:
			"Plan layouts in a supplied directory tree first. Create the `/srv` static-site path only inside the owned lab, record the service account and traversal permissions, and avoid writing to pseudo-filesystems or replacing host directories.",
		evidence:
			"Every path choice states purpose, owner, mutability, persistence, backup need, and consumer. The static-site layout passes a directory traversal check and distinguishes source content, configuration, logs, and generated state.",
		reference: "https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html"
	},
	"Unit 3: Users, Groups, and Permissions": {
		stage: "Control access",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"user identity",
			"group membership",
			"file permission",
			"directory traversal",
			"umask",
			"least privilege"
		],
		practiceSection: "users-groups-and-permissions-case",
		answerSection: "users-groups-and-permissions-key",
		route: "Predict effective access from user, primary and supplementary groups, file owner, group, mode bits, directory traversal, umask, and service identity before changing any permission. Diagnose from the complete path instead of reacting with broad modes.",
		safeRoute:
			"Use fictional accounts and a supplied directory tree inside the owned lab. Avoid recursive ownership changes on broad paths, never use `chmod 777` as a diagnostic shortcut, and record the original owner and mode before a change.",
		evidence:
			"The permission matrix predicts read, write, create, delete, and traverse outcomes for each identity; the observed result matches; and the least-privilege correction fixes the failure without granting unrelated access.",
		reference:
			"https://www.gnu.org/software/coreutils/manual/html_node/Mode-Structure.html"
	},
	"Unit 4: Editing and Configuration": {
		stage: "Change safely",
		estimatedTime: "3 sessions · 45–60 minutes each",
		keyBlocks: [
			"configuration baseline",
			"targeted edit",
			"diff",
			"syntax check",
			"reload",
			"rollback"
		],
		practiceSection: "configuration-change-and-rollback-case",
		answerSection: "configuration-change-and-rollback-key",
		route: "Treat configuration as a controlled change: identify the active file and precedence, save a dated or versioned baseline, make one targeted edit, inspect the diff, run the program's syntax or verification command, reload only after validation, and retest the intended behavior.",
		safeRoute:
			"Practice on supplied copies before an active unit or server configuration. Keep secrets out of course files, avoid editor-generated ownership surprises, and restore the last validated file when the syntax check or behavior gate fails.",
		evidence:
			"The change record includes active path, precedence, original checksum or commit, focused diff, validation command, reload versus restart decision, observed result, and exact rollback.",
		reference:
			"https://www.freedesktop.org/software/systemd/man/latest/systemd.unit.html"
	},
	"Unit 5: Processes and Job Control": {
		stage: "Operate runtime state",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"PID and PPID",
			"process state",
			"foreground job",
			"signal",
			"graceful stop",
			"ownership"
		],
		practiceSection: "process-state-and-signal-case",
		answerSection: "process-state-and-signal-key",
		route: "Trace a process through parent, owner, state, command, open terminal relationship, resource evidence, and expected shutdown behavior. Separate shell job control from long-lived service supervision and distinguish a deliberate graceful signal from an indiscriminate kill.",
		safeRoute:
			"Signal only course-owned toy processes after confirming PID, owner, and command. Start with an ordinary termination path, reserve forceful termination for the supplied stuck-process case, and never target names or PIDs that were not created by the lab.",
		evidence:
			"The process table identifies parent and owner, foreground/background state is explained, the selected signal matches the intended transition, shutdown is confirmed, and no unrelated process is affected.",
		reference: "https://man7.org/linux/man-pages/man7/signal.7.html"
	},
	"Unit 6: Services and systemd": {
		stage: "Operate runtime state",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"unit state",
			"ExecStart",
			"service account",
			"dependency",
			"restart policy",
			"enablement"
		],
		practiceSection: "systemd-service-and-failure-case",
		answerSection: "systemd-service-and-failure-key",
		route: "Read the complete service contract before activation: unit dependencies, executable and arguments, working directory, user and group, environment source, restart policy, install target, and expected logs. Distinguish daemon reload, service reload, restart, and enablement.",
		safeRoute:
			"Install only the course toy service in the owned systemd-capable environment. Validate the unit, use a dedicated unprivileged identity, bind locally, and preserve a disable-stop-remove-reset route before enabling startup.",
		evidence:
			"`systemd-analyze verify` or the closest supported check passes, status identifies the expected main process, the service survives the declared restart case, enablement is confirmed separately from runtime state, and one broken path is diagnosed from status plus journal evidence.",
		reference:
			"https://www.freedesktop.org/software/systemd/man/latest/systemd.service.html"
	},
	"Unit 7: Logging and Observability": {
		stage: "Diagnose and explain",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"journal field",
			"unit filter",
			"time window",
			"application log",
			"rotation",
			"cause timeline"
		],
		practiceSection: "journal-and-observability-case",
		answerSection: "journal-and-observability-key",
		route: "Begin with a symptom and bounded time window, then filter by boot, unit, priority, process, or structured field. Correlate service state, journal entries, application logs, configuration change, and resource evidence into a timeline rather than copying a wall of output.",
		safeRoute:
			"Use supplied redacted logs or the toy service journal. Keep access within the active user's authorized journal view, remove hostnames or identifiers before sharing, and test retention on disposable records rather than deleting broad system history.",
		evidence:
			"The incident note states expected and observed behavior, first relevant event, causal evidence, rejected hypotheses, correction, and clean retest; excerpts are minimal, timestamped, and free of credentials or personal data.",
		reference:
			"https://www.freedesktop.org/software/systemd/man/latest/journalctl.html"
	},
	"Unit 8: Scheduling and Automation": {
		stage: "Automate and verify",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"schedule",
			"minimal environment",
			"absolute path",
			"overlap lock",
			"timer state",
			"run evidence"
		],
		practiceSection: "scheduler-and-automation-case",
		answerSection: "scheduler-and-automation-key",
		route: "Make the task reliable before scheduling it: explicit interpreter, paths, environment, input and output locations, exit handling, overlap policy, retention, and idempotent or recovery behavior. Compare cron's compact schedule with systemd timer activation and journal evidence.",
		safeRoute:
			"Write only to the supplied workspace and backup destination. Test the script manually under a reduced environment, use a short temporary schedule for observation, prevent overlapping runs, and remove or disable the schedule after the lab.",
		evidence:
			"The manual and scheduled runs produce the same validated artifact, a missing environment variable fails visibly, overlap is controlled, timer or cron state is inspectable, logs identify success or failure, and cleanup removes the schedule.",
		reference:
			"https://www.freedesktop.org/software/systemd/man/latest/systemd.timer.html"
	},
	"Unit 9: Package Management and Software Layout": {
		stage: "Maintain software",
		estimatedTime: "3–4 sessions · 45–60 minutes each",
		keyBlocks: [
			"repository source",
			"package metadata",
			"dependency",
			"installed files",
			"update plan",
			"rollback"
		],
		practiceSection: "package-source-and-update-case",
		answerSection: "package-source-and-update-key",
		route: "Identify the distribution, configured repositories, package candidate, installed version, dependencies, file list, service impact, and security support before installation or update. Compare distribution package, source build, and tarball placement without mixing their ownership models.",
		safeRoute:
			"Use repository metadata and supplied transaction output before a real package change. Update only the owned lab after a snapshot, avoid unverified third-party repositories and curl-to-shell installers, and record the package-manager recovery path.",
		evidence:
			"The package record names source, version, architecture, files, dependencies, expected service effect, disk change, validation, and rollback; the selected installation model has one clear owner and update route.",
		reference:
			"https://documentation.ubuntu.com/server/how-to/software/package-management/"
	},
	"Unit 10: Networking from a Systems View": {
		stage: "Diagnose and explain",
		estimatedTime: "4 sessions · 45–60 minutes each",
		keyBlocks: [
			"interface",
			"address",
			"route",
			"listener",
			"name resolution",
			"layered test"
		],
		practiceSection: "network-state-and-diagnostics-case",
		answerSection: "network-state-and-diagnostics-key",
		route: "Read local interface, address, route, resolver, listener, process ownership, and application response as separate layers. Test from nearest dependency outward so an HTTP failure is not guessed to be DNS, routing, firewall, socket, or application logic without evidence.",
		safeRoute:
			"Use loopback, user-mode NAT, and course-owned VM addresses only. Do not scan address ranges, capture third-party traffic, bridge into school or employer networks, or open a public listener; supplied `ip`, `ss`, `dig`, and `curl` output completes the diagnostic route.",
		evidence:
			"The diagnosis identifies the first failing layer, cites the exact route, resolver, listening socket, process, and application result that support it, and demonstrates a corrected local request without broad probing.",
		reference: "https://man7.org/linux/man-pages/man8/ip.8.html"
	},
	"Unit 11: Web Servers": {
		stage: "Deploy locally",
		estimatedTime: "5–6 sessions · 45–60 minutes each",
		keyBlocks: [
			"document root",
			"server block",
			"reverse proxy",
			"local listener",
			"configuration test",
			"least privilege"
		],
		practiceSection: "web-server-and-reverse-proxy-case",
		answerSection: "web-server-and-reverse-proxy-key",
		route: "Separate static files, server configuration, upstream application, logs, socket, and process identity. Build the Nginx route first, compare the Apache virtual-host model, and distinguish configuration validation, reload, restart, local TLS concepts, and reverse proxy behavior.",
		safeRoute:
			"Bind the course service to loopback or a private lab interface, use fictional hostnames, keep firewall and router changes out of core work, and validate Nginx or Apache configuration before a reload. Public DNS, certificates, and internet exposure are not required.",
		evidence:
			"The document root and ownership are deliberate, syntax validation passes, `ss` identifies the expected local listener and process, static and proxied requests return the intended status and body, failure logs identify a broken upstream, and rollback restores the previous configuration.",
		reference: "https://nginx.org/en/docs/beginners_guide.html"
	},
	"Unit 12: Storage, Backups, and Reliability": {
		stage: "Recover reliably",
		estimatedTime: "4–5 sessions · 45–60 minutes each",
		keyBlocks: [
			"capacity",
			"mount identity",
			"backup manifest",
			"integrity check",
			"separate restore",
			"failure preservation"
		],
		practiceSection: "backup-restore-and-capacity-case",
		answerSection: "backup-restore-and-capacity-key",
		route: "Treat a backup as a recoverable, attributable artifact: identify source and exclusions, destination filesystem, free-space requirement, timestamp, manifest, integrity check, retention, permissions, logs, and a restore into a separate path before trusting it.",
		safeRoute:
			"Use the supplied workspace and archive destination rather than real home or production data. Do not edit host `fstab`, format devices, overwrite the source during restore, or delete the last trusted archive; use provided mount and capacity output when storage changes are unavailable.",
		evidence:
			"The backup contains the declared files, excludes transient data, matches the manifest or checksum evidence, restores to a separate path with expected ownership, handles insufficient space or interrupted output safely, and preserves the last trusted backup.",
		reference: "https://www.gnu.org/software/tar/manual/tar.html"
	},
	"Linux Systems Lab 17: Operations Capstone Studio": {
		stage: "Operations capstone",
		estimatedTime: "8–12 sessions · 45–60 minutes each",
		keyBlocks: [
			"scoped service",
			"least privilege",
			"health check",
			"failure injection",
			"restore drill",
			"runbook"
		],
		practiceSection: "operations-capstone-incident-case",
		answerSection: "operations-capstone-incident-key",
		route: "Deploy one small local service through vertical slices: environment record, filesystem layout, dedicated identity, validated configuration, systemd unit, loopback health route, journal evidence, scheduled backup, restore drill, injected failure, correction, and clean-start demonstration.",
		safeRoute:
			"Keep every endpoint and dependency local to the owned VM or WSL2 instance, take a snapshot before integration, use fictional content, and avoid public DNS, public TLS, cloud credentials, external databases, host firewall changes, or production logs.",
		evidence:
			"The capstone passes clean start, local health, least-privilege ownership, configuration verification, controlled failure, journal diagnosis, corrected retest, scheduled backup, separate-path restore, disable/remove rollback, and a versioned runbook with known limitations.",
		reference: "https://documentation.ubuntu.com/server/"
	}
};

function linuxPracticeLink(section: string) {
	return `${LINUX_PRACTICE_PACK}#${section}`;
}

function linuxVerificationLink(section: string) {
	return `${LINUX_VERIFICATION_GUIDE}#${section}`;
}

function linuxSupplementalPath(title: string) {
	if (/extension|challenge/i.test(title)) return "challenge" as const;
	if (/troubleshooting notebook/i.test(title)) return "core" as const;
	return "choice" as const;
}

function decorateLinuxSystemsModule(
	module: RawCourse["modules"][number]
): RawCourse["modules"][number] {
	const flow = LINUX_MODULE_FLOW[module.title];
	if (!flow) throw new Error(`Missing Linux Systems flow: ${module.title}`);

	const practiceLink = linuxPracticeLink(flow.practiceSection);
	const verificationLink = linuxVerificationLink(flow.answerSection);
	const curriculum = module.curriculum.map((item, index) => ({
		...item,
		content:
			index === 0
				? `**Course flow:** ${flow.stage}. ${flow.route}

**Safe practice route:** ${flow.safeRoute}

**Evidence gate:** ${flow.evidence}

**Local continuity:** Use the [supplied practice case](${practiceLink}) when a compatible Linux environment, sudo access, systemd, network isolation, or safe state-changing permission is unavailable. Record an independent diagnosis before comparing it with the [verification guide](${verificationLink}).

**Primary reference:** [Open the current reference](${flow.reference}). Record the distribution, release, command version, and service implementation when behavior is version-sensitive.

${item.content}`
				: item.content,
		learningPath: "core" as const,
		...(item.projectLink
			? {
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink: item.mediaLink ?? flow.reference
				}
			: {})
	}));

	return {
		...module,
		kind: "module",
		estimatedTime: flow.estimatedTime,
		keyBlocks: [...flow.keyBlocks],
		curriculum,
		supplementalProjects: module.supplementalProjects.map(item => ({
			...item,
			learningPath: linuxSupplementalPath(item.title),
			datasetLink: item.datasetLink ?? practiceLink,
			mediaLink: item.mediaLink ?? flow.reference
		}))
	};
}

function buildOptionalLinuxStudioArchive(
	modules: RawCourse["modules"]
): RawCourse["modules"][number] {
	const practiceLink = linuxPracticeLink("operations-capstone-incident-case");
	const verificationLink = linuxVerificationLink(
		"operations-capstone-incident-key"
	);

	return {
		kind: "appendix",
		title: "Optional Linux Integration Studio Archive",
		estimatedTime:
			"Choose one 3–5-session studio when extra transfer is useful",
		keyBlocks: [
			"service deployment",
			"automation",
			"observability",
			"backup",
			"recovery",
			"transfer"
		],
		curriculum: [
			{
				title: "Linux Integration Studio Archive Guide",
				content: `**Course flow:** Linux Systems Lab 14: Service Deployment Studio, Linux Systems Lab 15: Automation and Observability Studio, and Linux Systems Lab 16: Backup Recovery Studio are optional integration practice after their matching required units. Select one studio to revisit a weak service, scheduler, journal, backup, or restore evidence target; completing all three is not required before Linux Systems Lab 17: Operations Capstone Studio.

**Safe practice route:** Keep the selected studio inside the owned VM or use the [supplied capstone incident case](${practiceLink}). Preserve the original starter, use a snapshot or file-level rollback, and compare with the [verification guide](${verificationLink}) only after recording the attempted diagnosis.

**Evidence gate:** The selected studio produces one bounded system change, one failure or edge case, one verification result, and one tested undo or recovery path.`,
				learningPath: "choice",
				datasetLink: practiceLink,
				solutionLink: verificationLink,
				mediaLink:
					"https://www.freedesktop.org/software/systemd/man/latest/systemd.html"
			}
		],
		supplementalProjects: modules.flatMap(module =>
			[...module.curriculum, ...module.supplementalProjects].map(
				item => ({
					...item,
					learningPath: linuxSupplementalPath(item.title),
					datasetLink: item.datasetLink ?? practiceLink,
					mediaLink:
						item.mediaLink ??
						"https://www.freedesktop.org/software/systemd/man/latest/systemd.html"
				})
			)
		)
	};
}

const linuxPrimaryModules = linuxSystemsSourceCourse.modules
	.slice(0, LINUX_PRIMARY_MODULE_COUNT)
	.map(decorateLinuxSystemsModule);
const linuxCapstoneModule = decorateLinuxSystemsModule(
	linuxSystemsSourceCourse.modules.at(-1)!
);
const linuxOptionalStudioModules = linuxSystemsSourceCourse.modules.slice(
	LINUX_PRIMARY_MODULE_COUNT,
	-1
);

export const linuxSystemsCourse: RawCourse = {
	...linuxSystemsSourceCourse,
	modules: [
		...linuxPrimaryModules,
		linuxCapstoneModule,
		buildOptionalLinuxStudioArchive(linuxOptionalStudioModules)
	].map(applyLinuxProjectReading)
};
