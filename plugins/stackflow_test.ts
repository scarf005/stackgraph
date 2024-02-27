import { Stream } from "https://deno.land/x/rimbu@1.2.0/stream/mod.ts"
import {
	CallExpression,
	Identifier,
	ImportDeclaration,
	KindToNodeMappings,
	Node,
	ts,
} from "../deps/ts_morph.ts"
import { inMemoryProject } from "../graph/_project.ts"
import type { Declaration } from "../graph/decl_deps.ts"
import { printNodes } from "../utils/_format.ts"

const fakePushText = /*javascript*/ `
    import other from "other"

    const Comp = () => {
        const push = () => {}

        push(10)
    }
`

const pushText = /*javascript*/ `
    import other from "other"

    import useFlowDefault from "useFlow1"
    import { useFlowNamed } from "useFlow2"
    import { foo as useFlowRenamed } from "useFlow3"
    import useFlowDefaultAnd, { foo } from "useFlow4"

    const Comp = () => {
        const { replace } = useFlowDefault()
        const { push } = useFlowNamed()
        const { pop } = useFlowRenamed()

        push(LINKS.AAA, { method: "create" })
        replace(LINKS.BBB)
        pop(LINKS.AAA)

        return <div>Test</div>
    }
`

const getUseFlowDefault = (node: ImportDeclaration) => {
}

const links = {
	AAA: "AAA",
	BBB: "BBB",
}

const project = inMemoryProject()
const fake = project.createSourceFile("fake.ts", fakePushText)

const real = project.createSourceFile("real.ts", pushText)

export const allImportIdents = (node: ImportDeclaration): Identifier[] => {
	const named = node.getNamedImports()
		.map((x) => x.getAliasNode() ?? x.getNameNode())

	const defaultImport = node.getDefaultImport()
	return defaultImport ? [defaultImport, ...named] : named
}

export const nonNull = <T>(x: T): x is Exclude<T, undefined> => x !== undefined
export const isKind =
	<T extends ts.SyntaxKind>(kind: T) =>
	(node?: Node): node is KindToNodeMappings[T] =>
		node !== undefined && node.isKind(kind)

export const allUsagesOf = (node: Identifier) => {
	const usages = node.findReferencesAsNodes()
		.map((x) => x.getParent())
		.filter(isKind(ts.SyntaxKind.CallExpression))
		.map((x) => x.getParent())
		.filter(isKind(ts.SyntaxKind.VariableDeclaration))
		.map((x) => x.getDescendantsOfKind(ts.SyntaxKind.BindingElement))

	printNodes("usages:", usages.flat())
}

real.getImportDeclarations().forEach((x) => {
	const named = x.getNamedImports()
		.map((y) => y.getAliasNode() ?? y.getNameNode())

	const defaultImport = x.getDefaultImport()
	const all = defaultImport ? [defaultImport, ...named] : named

	printNodes("x:", x, "imports:", all)
})

// console.log(real.getText())
export const getUseFlow = () => {
}

real.getImportDeclarations()
	.filter((node) => node.getModuleSpecifier().getText().startsWith("useFlow"))
	.flatMap(allImportIdents)
	.forEach((x) => {
		allUsagesOf(x)
	})
// export const getStackflowLinks =
// 	(filterUseFlow: (node: ImportDeclaration) => boolean) =>
// 	(decl: Declaration): CallExpression[] => {
// 		return []
// 	}

Deno.test("getStackflowLink() finds ", () => {
})
