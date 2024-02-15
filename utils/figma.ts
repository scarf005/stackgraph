/** Clean figma URL into `file?node-id` format that can be used as an ID */
const parseFigmaURL = (url: URL): FigmaNode => {
	const id = url.pathname.split("/")[2]
	const node = url.searchParams.get("node-id")!.replace("-", ":")

	return { id, node }
}

export type FigmaNode = { id: string; node: string }

type FigmaResponse = {
	err: null
	images: Record<string, string>
}

export const queryFigmaSVGs = (token: string) => {
	const headers = new Headers({ "X-FIGMA-TOKEN": token })
	return async ({ id, nodes }: { id: string; nodes: string[] }) => {
		const params = new URLSearchParams({
			ids: nodes.join(","),
			format: "svg",
		})
		const url = `https://api.figma.com/v1/images/${id}?${params}`
		const res = await fetch(url, { headers })
		const { images } = await res.json() as FigmaResponse

		const svgs = Object.entries(images)
			.map(async ([node, url]) =>
				[node, await fetch(url).then((res) => res.text())] as const
			)

		return Object.fromEntries(await Promise.all(svgs))
	}
}

if (import.meta.main) {
	const token = Deno.env.get("FIGMA_TOKEN")
	if (!token) throw new Error("FIGMA_TOKEN not found in environment variables")

	const url = new URL(
		"https://www.figma.com/file/fTDL0WNgyJc1TIbW6UJfJ4?type=design&node-id=5486-68807&mode=design&t=lw17VcXjRU8sH0be-0",
	)

	const node = parseFigmaURL(url)
	console.log(node)

	const getSVGs = queryFigmaSVGs(token)

	console.log(await getSVGs({ id: node.id, nodes: [node.node] }))
}
