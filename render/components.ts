/* eslint-disable @typescript-eslint/no-unused-vars */
import {
	walk,
	type WalkOptions,
} from "https://deno.land/std@0.217.0/fs/walk.ts"
import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts"

import { timer } from "../utils/timer.ts"
import { Project, ts } from "../deps/ts_morph.ts"
import {
	getDecls,
	getGraph,
	type GithubURIOption,
	mkToGithubURI,
	type VSCodeURI,
} from "../graph/mod.ts"
import { colors, hashRGB } from "./colors.ts"
import { AsyncStream } from "https://deno.land/x/rimbu@1.2.0/stream/mod.ts"

export type Option = {
	root: Parameters<typeof walk>[0]
	walkOption: WalkOptions
	github: GithubURIOption
}

const project = await timer("project init", async () => {
	const project = new Project({ useInMemoryFileSystem: true })

	const walkIter = walk(import.meta.dirname + "/../search-client/src", {
		exts: [".tsx"],
		skip: [/__/],
		includeDirs: false,
	})

	await AsyncStream
		.from(walkIter)
		.map(async ({ path }) => ({
			path,
			text: await Deno.readTextFile(path),
		}))
		.forEach(({ path, text }) => {
			project.createSourceFile(path, text)
		})

	return project
})

const toGithubURI = mkToGithubURI({
	owner: "daangn",
	repo: "search-webview",
	commit: "main",
})

const decls = timer("decl collection", () =>
	getDecls(
		(node) =>
			node.getFirstDescendantByKind(ts.SyntaxKind.JsxElement) !== undefined,
	)(project.getSourceFiles()).toArray())

const root = resolve(import.meta.dirname!, "../")

const graph = timer("getting graph", () => getGraph(decls))

const links = graph
	.streamConnections()
	.map(([source, target]) => ({ source, target }))
	.toArray()

const nodes = graph
	.streamNodes()
	.map((id) => {
		const name = new URL(id).searchParams.get("name")
		const url = toGithubURI(id.replace(root, "") as VSCodeURI)

		return { id, name, url, ...colors(hashRGB(id)) }
	})
	.toArray()

await Deno.writeTextFile(
	import.meta.dirname + "/assets/data.json",
	JSON.stringify({ nodes, links }, null, 2),
)
