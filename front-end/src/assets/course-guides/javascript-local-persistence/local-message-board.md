A board stores topics, and the optional extension stores comments inside their parent topics. Each object has an ID. The title, site URL and image address are separate fields because each serves a different purpose: naming the topic, opening its resource and illustrating it.

## Worked parent lookup

Suppose topic `post-a` links to a drawing reference and topic `post-b` links to a field guide. Adding a newer topic changes their display positions. A comment form captures `post-a` when it is created, so submitting it still updates that topic after the list is reordered.

```js
const post = state.posts.find(post => post.id === postId);
if (!post) return false;
post.comments.push({ id, text: textField(value, 400) });
```

This excerpt shows the parent lookup and safe text normalization. The complete function also checks per-topic and whole-board comment limits and rejects a repeated comment ID. Two comments with the same text can be legitimate separate records.

## Model and validate the document

The core document has `schemaVersion: 1` and a `posts` array. Each post contains `id`, `title`, `url`, `imageUrl` and `order`. The optional document uses version two and adds a `comments` array to every post. A version-one board can be upgraded by retaining its posts and adding empty comment arrays.

The supplied validator accepts at most 30 topics, titles up to 100 characters and URLs up to 1,024 characters. Comments are limited to 400 characters, 20 per topic and 200 overall. The encoded document must also fit within 128 KiB; reaching any limit leaves the previous document intact.

The order value increases when a topic is added. Render a sorted copy so newest topics appear first while their stored IDs remain stable. Keep comments attached to their parent objects throughout sorting and saving.

## Read addresses as URLs

Use the supplied `reviewedUrl` helper to parse an address, check HTTPS, reject embedded credentials and compare its origin with a small explicit allowlist. Site links in these packs use example.com, MDN, English Wikipedia or the Fish and Wildlife Service. Image addresses use the Fish and Wildlife Service or Wikimedia raster-image hosts. Review the constants in `storage.js` before choosing an address.

An empty image address uses the supplied decorative illustration. A failed image load displays a text fallback. A valid address can still fail to load, so creating the topic and handling its image are separate outcomes. The board remains usable when the image fails.

Create anchors with DOM properties and titles/comments with `textContent`. An input such as `<img src=x onerror=alert(1)>` should remain visible text. The URL field follows its own validation path; it does not become executable page content.

## Save before replacing state

The shared transaction helper clones state, applies one mutation, validates the whole document and saves its JSON. A failed save preserves both the working document and the previous stored value. Read failures preserve the original bytes and show a read-only example with recovery text.

The core starter implements topic creation and rendering. The comment starter supplies that earlier work and asks for a comment mutation. The form passes a captured topic ID to the mutation; a missing topic leaves the document unchanged. After a successful comment, restore focus to that topic's newly rendered input.

## Check the complete workflow

Create two topics, add a newer one and comment on an older one. Refresh and verify the same association. Check duplicate text, whitespace-only input, overlength fields, foreign origins, unsupported schemas, storage denial and quota failure. Resetting a writable board requires confirmation and restores the supplied example, clearing its comments. The read-only recovery state preserves the saved bytes.

Run the exported `index.html` in the tested browser or serve its folder on loopback as described in `README.md`. Keep the same origin for reload checks. These projects implement one browser's local board; multi-user synchronization requires a different server-backed design.
