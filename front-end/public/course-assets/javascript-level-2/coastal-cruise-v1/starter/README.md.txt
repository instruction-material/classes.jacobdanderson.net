# Coastal Cruise

Complete seven helper functions that register named passengers in numbered seats.

## Files and execution

Open index.html in a browser without a server. The site IDE uses the same local
files. script.js contains the helpers and maxSeats. The reference starts with
browser prompts; Cancel stops registration. console-viewer.js mirrors console.log
as the passenger manifest and preserves console output. All files work offline.
CASES.md supplies expected results.

## Data and helper contracts

maxSeats is a positive whole number, initially 2. Each seat is a separate
{name:"",open:true} object. Public seat numbers are 1 through maxSeats; array indexes
are 0 through maxSeats-1. Convert once when calling registerSeat.

- populateSeats():return a new array of maxSeats separate open-seat objects.
- isOpen(ship,seatNum):return whether the zero-based index is valid and open.
- registerSeat(ship,name,seatNum):validate a nonempty trimmed name and integer
  index; reject occupied seats without overwriting; otherwise store the name,
  mark open=false and return true. Rejected requests return false.
- getNameAndNum():prompt for name and a one-based seat number; return {name,num},
  or null when either prompt is cancelled.
- isShipFull(ship):return whether every seat is occupied.
- printShip(ship):log each seat's number and name in seat order.
- fillShip():create seats,repeat requests until full or cancelled, and print the
  manifest only after the ship is full. Cancellation leaves existing reservations
  intact and ends the run.

## Worked results and completion

For maxSeats 2, Ada/1 and Lin/2 produce:
Seat 1: Ada
Seat 2: Lin

Register Ada/1, then Eve/1:reject the duplicate and retain Ada. Register Lin/2
to finish. Invalid names or seat numbers leave all reservations unchanged and
allow a new attempt. Cancel stops instead of registering a null name or seat 0.
Change maxSeats to 3 and fill seats 3,1,2;print in 1,2,3 order.

The starter contains function stubs and no completed registration loop.
Show a complete manifest, an occupied-seat rejection, invalid input, cancellation
and a changed capacity. Explain the call relationships among all seven helpers.
