# Method calls: case inputs

## baseline

### Query and command trace

Old client: discount 0;price A/500/zone 1/STANDARD;setDiscount 25;price B/501/zone 2/EXPRESS;read total;price null/0/zone 0;find B;find missing. Modern client: fresh standard service/log,Parcel A/500/zone 1;quote twice;send twice;retain a snapshot after the first send.

## judgment

### Choose an API boundary

Compare price("A",500,1,false,null),quote(new Parcel("A",500,1),STANDARD) and send of the same parcel. The supplied client still calls setDiscount. A new caller already has a validated Parcel.

## compatibility

### Shared history through migration

Send A500/zone 1/STANDARD at discount 0,retain history,set discount 25,send B501/zone 2/EXPRESS. Try setDiscount(-1),then send C1/zone 1/STANDARD. Try invalid null parcel fields. Compare old and adapted clients.

## boundaries

### Null, absence and failure order

Modern:Parcel(null,0,0),Parcel(" ",0,0),Parcel("X",0,0),Parcel("X",1,0);quote(null,null);quote(validParcel,null);discounted(-1,null);log.find(null),find(" "),find("missing"). Legacy:find(null),find(" "),find("missing"),price(null,0,0,false,null).

## core

### Repeat, snapshot and duplicate labels

A fresh log/service uses discount 0. Quote A1/zone 1/STANDARD twice,then send it. Keep that snapshot. Make a second service with discount 25 and the same log;send A1/zone 1/STANDARD. Query through the old service again. Try mutating the first snapshot.

## diagnostic

### Smallest regression cases

Analyze quote that appends,old price that calls quote,setter that replaces the shared log,and find that returns a null Optional.

## transfer

### Weight boundary transfer

EXPRESS,zone 3,discount 25;weights 500,501,1000,1001 grams. Compare quote(parcel,speed,speed.surchargeCents()) with quote(parcel,speed). Then compare loose fields and a preexisting Parcel.

## extension

### Ordinary empty queue and required failures

Single-thread fresh queue:addQuote A140,addQuote B505;printNext four times,record counts;call strict remove;call printNext(null);try add(null) on a fresh queue.
