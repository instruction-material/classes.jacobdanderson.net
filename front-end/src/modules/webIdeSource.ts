export const webStarterCode = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Web project</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <main></main>
    <script type="module" src="main.js"></script>
</body>
</html>
`;

export function webStarterFiles() {
	return [
		{
			name: "index.html",
			content: webStarterCode,
			encoding: "text" as const
		},
		{ name: "main.js", content: "", encoding: "text" as const },
		{ name: "styles.css", content: "", encoding: "text" as const }
	];
}
