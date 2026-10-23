import ts from "typescript";

function proseForCopyChecks(text: string) {
	return text
		.replace(/(`{3,}|~{3,})[\s\S]*?\1/g, " ")
		.replace(/(`+)[\s\S]*?\1/g, " ");
}

export function rawCourseProse(source: string) {
	const tree = ts.createSourceFile(
		"course.ts",
		source,
		ts.ScriptTarget.Latest
	);
	const literals: Array<[number, number, string]> = [];
	function visit(node: ts.Node) {
		if (
			ts.isPropertyAssignment(node) &&
			node.name.getText(tree) === "aliases" &&
			ts.isArrayLiteralExpression(node.initializer)
		) {
			literals.push([
				node.initializer.getStart(tree),
				node.initializer.end,
				"[]"
			]);
			return;
		}
		// Replacement search text is input syntax, not displayed course prose.
		// Keep checking the replacement and the normalized course separately.
		if (
			ts.isCallExpression(node) &&
			ts.isPropertyAccessExpression(node.expression) &&
			["replace", "replaceAll"].includes(node.expression.name.text) &&
			node.arguments.length > 1 &&
			ts.isStringLiteralLike(node.arguments[0])
		) {
			const pattern = node.arguments[0];
			literals.push([
				pattern.getStart(tree),
				pattern.end,
				'"COPY_PATTERN"'
			]);
			visit(node.expression);
			for (const argument of node.arguments.slice(1)) visit(argument);
			return;
		}
		if (
			ts.isStringLiteralLike(node) ||
			ts.isTemplateHead(node) ||
			ts.isTemplateMiddle(node) ||
			ts.isTemplateTail(node)
		) {
			const prose = proseForCopyChecks(node.text);
			if (prose !== node.text)
				literals.push([
					node.getStart(tree),
					node.end,
					JSON.stringify(prose)
				]);
		}
		ts.forEachChild(node, visit);
	}
	visit(tree);
	for (const [start, end, prose] of literals.sort((a, b) => b[0] - a[0]))
		source = source.slice(0, start) + prose + source.slice(end);
	return source;
}
