import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin } from "vite";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Vue from "@vitejs/plugin-vue";
import { build } from "vite";

const root = fileURLToPath(new URL("../", import.meta.url));

function publicAssetHeaders(
	request: IncomingMessage,
	response: ServerResponse,
	next: () => void
) {
	const pathname = request.url?.split("?")[0];
	if (
		pathname &&
		/^\/(?:python-runtime|(?:ide|python-ide)\/assets)\//.test(pathname)
	) {
		response.setHeader("Access-Control-Allow-Origin", "*");
		response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
	}
	next();
}

export function pythonRuntimePlugin(): Plugin {
	return {
		name: "isolated-python-runtime",
		async buildStart() {
			if (process.env.VITEST) return;
			await build({
				configFile: false,
				base: "/python-runtime/",
				root,
				publicDir: false,
				plugins: [Vue()],
				define: {
					"process.env.NODE_ENV": JSON.stringify("production"),
					__CLASSES_BUILD__: JSON.stringify({
						revision: "runtime",
						release: "unreleased"
					})
				},
				resolve: {
					alias: [
						{
							find: "@/api",
							replacement: path.join(
								root,
								"src/runtime/disabled-api.ts"
							)
						},
						{
							find: "@/stores/app",
							replacement: path.join(
								root,
								"src/runtime/empty-account.ts"
							)
						},
						{ find: "@", replacement: path.join(root, "src") },
						{ find: "~", replacement: path.join(root, "src") }
					]
				},
				build: {
					outDir: "public/python-runtime",
					emptyOutDir: true,
					lib: {
						entry: path.join(root, "src/runtime/python-entry.ts"),
						name: "ClassesPythonRuntime",
						formats: ["iife"],
						fileName: () => "runtime.js",
						cssFileName: "runtime"
					}
				}
			});
		},
		configureServer(server) {
			server.middlewares.use(publicAssetHeaders);
		},
		configurePreviewServer(server) {
			server.middlewares.use(publicAssetHeaders);
		}
	};
}
