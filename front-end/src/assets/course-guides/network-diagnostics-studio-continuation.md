# Diagnostic Workflow Studio: two-fault continuation



Use an ordinary account in an owned Linux practice VM or WSL environment, with
Python 3.10 or newer, Bash, GNU timeout, iproute2, curl and OpenBSD netcat.
On an Ubuntu lab that you administer, install the missing tools once:

    sudo apt-get update
    sudo apt-get install python3 iproute2 curl netcat-openbsd coreutils

Run the experiment as the ordinary account. It refuses root. It chooses its own
ephemeral ports, binds only 127.0.0.1 and 127.0.0.2, and reserves the comparison
endpoints so that it cannot accidentally probe a reused service. Netcat's
numeric mode and curl's explicit proxy bypass keep these observations local.
It reads interface/route information and changes no network configuration.
No second machine, DNS service, credentials or public endpoint is involved.

Import the starter into its own saved attempt. Review consent, save and export
the ZIP, extract it, and enter its starter directory in the Linux terminal.
Keep the separate reference workspace for comparison. The site IDE edits and
saves these files; the Linux terminal runs the supplied commands.

## Configuration choices

| Field | Choices |
| --- | --- |
| targetAddress | owned: 127.0.0.1; reserved: 127.0.0.2 |
| targetPort | owned: live HTTP port; reserved: bound non-listening port |
| scheme | http or https |
| responseMode | http: reply immediately; silent: read without replying |
| httpStatus | 200 or 500 for the owned HTTP reply |

The report gives the actual fresh ports. Correct only the field named by the
evidence for this assignment; retain the other choices.


## Studio continuation: distinguish two faults in sequence

This continuation follows the Diagnostic Workflow Studio address investigation
in the same saved attempt. Use the same ordinary-account Linux setup and the
five files described above. First complete the single-field address diagnosis.
Preserve those reports before investigating the following new case.

1. In a copy of the corrected case, set targetAddress to reserved and scheme to
   https. Keep targetPort owned, responseMode http and httpStatus 200.
   Run `python3 main.py --report compound-fault.json`.
2. Correct only targetAddress to owned. Run
   `python3 main.py --report address-only-correction.json`.
3. Correct only scheme to http. Run
   `python3 main.py --report full-recovery.json`.
4. Compare the seven statuses and exact selected endpoints at all three stages.
   State which observation became possible after the first correction and why
   it was unjustified to claim a healthy application immediately after that
   correction. Repeat the final state with --alternate and a fresh report.

Self-check after an independent prediction: the first target refuses TCP at the
reserved address, while the loopback HTTPS observation separately shows the
protocol mismatch. Correcting the target address restores TCP but leaves the TLS
failure. Correcting the scheme then yields the owned HTTP 200 token and
complete=true. The independent plain-HTTP control remains healthy throughout.
Keep each raw failure; identify the first failing gate for each selected target
instead of replacing earlier evidence with the final successful result.

This is a continuation of the same studio configuration and notebook. In a
guided walkthrough, pause before each single-field change and justify the next
test from the current evidence.


References: [curl command manual](https://curl.se/docs/manpage.html).
