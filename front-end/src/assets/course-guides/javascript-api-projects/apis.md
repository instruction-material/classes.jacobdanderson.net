API requests are asynchronous because the browser must wait for another service to respond. An API supplies data through a request. These projects use HTTP GET: the browser asks for a resource and receives a response. The response has a status, headers and a body. JSON represents values such as objects, arrays, strings and numbers; receiving JSON does not guarantee that its fields match the application.

## Worked request

`fetch` returns a promise. A promise describes work that may finish later or fail. `await` waits for that result inside an `async` function. Parsing the response body is another asynchronous operation. Without the wait, the next line receives a promise instead of the requested data.

The supplied `requestJson` helper performs the GET, checks the status, reads a bounded JSON body and applies a validation function. Its successful result contains `data` and `cached`:

```js
async function showLiveJoke() {
  try {
    const result = await requestJson(
      "https://official-joke-api.appspot.com/jokes/programming/random",
      normalizeJoke,
      { fresh: true }
    );
    renderJoke(result.data);
  } catch (error) {
    showProblem(error, true);
  }
}
```

`try` handles the success path. A rejected request or a thrown validation error moves control into `catch`. A `finally` block runs after either outcome, so it can re-enable a loading button. The complete project wraps loading in that structure.

Trace a valid one-joke array through the example: requestJson waits for the HTTP response, readJson parses the body, and normalizeJoke selects the first array element. The returned data record supplies both paragraphs to renderJoke. Loading finishes with one setup and its paired punchline. For an empty array, normalizeJoke throws before rendering; catch displays the problem and the previous joke stays visible. The caller's finally block restores the loading control in both cases.

## Identify the shape

An object and an array need different access:

```json
[{ "setup": "A setup sentence", "punchline": "Its answer" }]
```

For this array, `payload[0].setup` reads the first joke's setup. For a single object, use `payload.setup`. The joke parser normalizes either supported shape into one record. It rejects an empty array, missing fields, non-string values and oversized text before rendering.

Read only the fields needed by the project. Keep a joke's setup and punchline paired. Keep a Pokémon's name, ID, types, statistics and sprite in the same validated record. Use `textContent` for supplied text so markup-shaped characters remain text.

## Handle failure and overlap

An HTTP error such as 404 differs from a successful response containing invalid data. Both need a visible result. Keep the previous valid content until the replacement is validated; image projects also wait for image decoding. A failed refresh then changes the status instead of erasing useful work.

The helper permits one active request, uses a four-second deadline and supports cancellation. A late canceled response cannot overwrite a newer result. Do not retry in an unlimited loop. A browser may also refuse a cross-origin request when the provider's CORS policy does not allow it; `no-cors` does not make that response readable as JSON.

## Compare saved and live data

Saved responses pass through JSON parsing and the same validation functions as live responses. They let each project work with the network disabled. Implement the asynchronous response-selection function in the starter, then complete its parser and rendering or rating logic.

The Pokédex caches validated lookups for sixty seconds, avoiding repeated requests for the same record. Random joke and fox loads deliberately request a fresh value. Distinguish those purposes when choosing a cache policy. The supplied cache is bounded to 32 entries.
## Practice and reference

Complete the [response and fixture case](/course-assets/javascript-level-2/javascript-level-2-practice-pack.md#resilient-fetch-and-fixture-case), then compare the [verification guide](/course-assets/javascript-level-2/javascript-level-2-verification-guide.md#resilient-fetch-and-fixture-key). The [PokéAPI documentation](https://pokeapi.co/docs/v2) lists the response fields and provider use policy for the live lookup.

