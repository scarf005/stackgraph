const readme = () =>
	Deno.readTextFile(import.meta.dirname + "/../README.md")
		.then((text) => text.split("\n").slice(3).join("\n"))

const header = /*md*/ `
# [StackGraph](https://github.com/daangn/stackgraph)

<div id="graph"></div>

(StackGraph 저장소의 모든 변수 관계도, 유색 선은 의존 관계, 무색 선은 디렉터리/파일 트리)

`

export default async (_: Lume.Data, { md }: Lume.Helpers) => /*html*/ `
    <!DOCTYPE html>

    <head>
        <meta charset="UTF-8">
        <title>StackGraph</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/github.min.css" />
        <style>
            body {
                margin-inline: 20vw;
            }
            blockquote {
                background-color: #f2e8da;
                padding: 0.5em 1em;
            }
            pre {
                border: 1px solid #e1e4e8;
            }
            code {
                background-color: #dff4e6;
            }
            #graph {
                height: 60vh;
	            background-color: #f7fafc;
            }

            h2,
            h3,
            ul {
                margin: 0.2em 0
            }
        </style>

        <script src="//unpkg.com/react/umd/react.production.min.js"></script>
        <script src="//unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
        <script src="//unpkg.com/@babel/standalone"></script>

        <script src="//unpkg.com/react-force-graph-2d"></script>
        <script>
            function genRandomTree(N = 300, reverse = false) {
                return {
                    nodes: [...Array(N).keys()].map(i => ({ id: i })),
                    links: [...Array(N).keys()]
                    .filter(id => id)
                    .map(id => ({
                        [reverse ? 'target' : 'source']: id,
                        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id-1))
                    }))
                }
            }
        </script>
    </head>

    <body>
        ${md(header + await readme())}

        <script type="text/jsx">
            const Graph = () => {
                return <ForceGraph2D graphData={genRandomTree()}/>
            }

            ReactDOM.render(
                <Graph />,
                document.getElementById('graph')
            )
        </script>
        <!-- <script type="module" src="./assets/demo.js"></script> -->
    </body>
`
