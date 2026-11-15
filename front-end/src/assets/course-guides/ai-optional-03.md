# Explain an ordered alert rule

Route fictional device alerts through ordered rules. Offline devices go to connection review first. Otherwise, backlog ≥3 goes to queue review; the remaining online alerts go to monitoring. An offline alert with backlog nine matches both conditions, but the first rule determines its route. Return a reason with the decision. Test the boundary at backlog two versus three and reject invalid data.

## Build and verify

Implement the named functions and solve_extension in main.py. Run python3 main.py from the chosen role folder. The JSON output represents tuple states as arrays. Use the worked case and the stated boundary checks before changing an input. The source uses only the Python standard library.

## Expected result

[{"reason": "offline rule takes priority", "route": "connection"}, {"reason": "backlog is at least three", "route": "queue"}, {"reason": "online with backlog below three", "route": "monitor"}]

## Function contract

route(alert) accepts an offline boolean and nonnegative integer backlog. It returns route and reason. Reject nonboolean offline values and invalid backlog values.
