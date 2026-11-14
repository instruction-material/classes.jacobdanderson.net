# Architecture cases

## Application inputs

Save b=first, then a=second; capture all(); replace b=changed and save c=empty text. Try find(null), find("Bad"), save(null), and mutation of the captured list. Name the direction of the service/repository/adapter imports.

## Application answers

The captured list stays [b=first, a=second]. The current list is [b=changed, a=second, c=]; replacing b retains its insertion position. Missing valid ids return Optional.empty. Null ids or null notes raise NullPointerException; malformed ids raise IllegalArgumentException. Returned lists reject mutation with UnsupportedOperationException. The service depends on NoteRepository; InMemoryNotes implements that port. Main chooses the adapter. No service import selects an infrastructure class.

## Reflection inputs

Assign construction, use-case policy, storage operations, transformation selection, event delivery and display rows to owners. Compare one injected sink with a many-subscriber bus and a fixed direct collection/function design.

## Reflection answers

Main chooses and injects collaborators. NoteService owns create/replace policy, guard and save-before-notify ordering. NoteRepository promises storage operations; InMemoryNotes supplies the in-memory implementation. PluginCatalog resolves names and execution order. NoteSink is the single notification port. NoteViewModel owns display snapshots and commands. A bus adds subscriber lifetime/order/failure obligations. A direct collection/function may suffice when no replacement boundary or independent state lifetime is useful. Injection can use constructors without a container; dependency inversion also requires the right interface and import direction.

## Plugins inputs

Compare suffix then bracket with bracket then suffix for hi, two suffix occurrences, an empty pipeline, and [count,missing]. Compare the shipped two-line descriptor, one line naming UppercasePlugin, an empty descriptor and a missing provider class. Observe loader creation versus provider consumption.

## Plugins answers

suffix then bracket returns [hi!]; bracket then suffix returns [hi]!; two suffix calls return hi!!; empty pipeline returns hi. [count,missing] fails before count executes because all names resolve before effects. Null or CR/LF results fail before later stages; earlier provider effects remain.

The shipped descriptor discovers bracket and upper ids, with sorted display [bracket, upper] and explicitly selected execution order. With only UppercasePlugin registered, availableIds is [upper]; Main then rejects its requested bracket before saving/notifying. Empty metadata yields an empty catalog and Main rejects upper. A missing provider class can raise ServiceConfigurationError during eager catalog construction, before Main prints availableIds.

ServiceLoader creation alone does not instantiate providers; consuming its iterator/provider can instantiate and fail. This notebook discover wrapper consumes the loader fully before returning. Cache reuse concerns the same loader; a new discover call creates another loader/catalog. Providers execute trusted code in the process. Restore the original two lines and source before baseline harness runs. The JAR must contain META-INF/services/notes.plugins.TextPlugin with exact case and both compiled provider classes.

## Fitness inputs

Identify permitted service imports and a compilation that excludes infrastructure/UI. Predict the effect of substituting a conforming repository, adding another named text provider, changing a screen row format, and replacing the single sink with multicast notification.

## Fitness answers

Domain, ports, plugin API/catalog and application service compile together without infrastructure/UI. For example, compile these explicit source paths into a fresh core-classes directory:

```sh
javac --release 21 -Xlint:all -Werror -d core-classes src/notes/domain/Note.java src/notes/ports/NoteRepository.java src/notes/ports/NoteSink.java src/notes/plugins/TextPlugin.java src/notes/plugins/PluginCatalog.java src/notes/application/NoteService.java
```

A service import of infrastructure/UI violates that isolation. A conforming repository replacement changes composition, not use-case policy. Another provider changes provider implementation/metadata and requested names, not service source. A screen-format change belongs in the presentation mapping. Multicast needs explicit ordering, failures and subscriber ownership. These checks support the selected properties; they do not establish correctness of every future adapter or justify boundaries with no actual change pressure.

## Core inputs

Predict Main's six lines, creating an existing id, replacing a missing id, invalid pipeline output, notification failure, nested mutation and explicit view refresh after failure.

## Core answers

Main prints:

```text
[bracket, upper]
a:[HI]
[a=[HI]]
a:[Ready]
[a=[Ready]]
1
```

Duplicate create raises IllegalArgumentException; missing replace raises NoSuchElementException. Invalid text/pipeline output fails before save. A repository save exception prevents notification. A sink exception follows a committed save; an equal-text accepted replacement still saves/notifies. Nested mutating calls raise IllegalStateException before nested mutation; read-only list is allowed and finally releases the guard. ViewModel.add refreshes only after create returns successfully. After failed notification, handle the error and refresh explicitly to show the committed note. Core reports 102 passed with copy unfinished; complete checks report 112 passed.

## Understanding inputs

Evaluate the five Understanding Check claims. Include missing plugin metadata, a duplicate provider id, an unknown later pipeline stage and a nested mutation during notification.

## Understanding answers

Constructor injection uses ordinary arguments and requires no container. A repository name promises neither a database nor durable storage. javac does not copy ServiceLoader metadata; package it in the JAR. A sink exception can follow a committed note. An immutable view snapshot remains unchanged until explicit refresh. Duplicate provider ids are rejected during catalog construction. Resolve all requested names before any provider effects. Nested mutation is rejected while read-only observations see committed state. All these contracts assume one synchronous thread.

## Transfer inputs

Use the worked example's uppercase processor. Write id2=hi, capture repository list and refresh the view; write id1=ready, then id2=new. Compare the old list and old screen with current storage and a refreshed screen. In separate cases use a null-returning processor and a throwing sink for id4.

## Transfer answers

After the first write, old list contains Item(2,HI) and the refreshed screen is [2=HI]. The later writes leave current storage ordered Item(2,NEW), Item(1,READY). The old list/screen remain unchanged. Refresh gives [2=NEW, 1=READY]. Notifications follow saves. A null result fails before id4 is saved. A sink exception after a valid id4 write leaves it committed and propagates. A controller could render service results directly; this view model retains its own immutable presentation state and needs refresh. Both keep domain/service rules outside formatting.

## Extension inputs

Start with a=one. Copy to b using suffix, then try an existing target, a missing source, an unknown provider, a throwing sink and a nested mutation. Verify source preservation and core independence.

## Extension answers

A successful copy saves b=one!, leaves a=one and notifies b after commit. Existing target raises IllegalArgumentException; missing source raises NoSuchElementException. Unknown provider fails before target save. A throwing sink leaves the new target committed. Nested mutation fails before nested effects, and the guard releases afterward. Core remains 102 passed; complete checks report 112 passed.
