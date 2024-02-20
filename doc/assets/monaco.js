import * as monaco from "https://esm.sh/monaco-editor@0.46.0"
import * as jsonWorker from "https://esm.sh/monaco-editor@0.46.0/esm/vs/language/json/json.worker.js"
import * as cssWorker from "https://esm.sh/monaco-editor@0.46.0/esm/vs/language/css/css.worker.js"
import * as htmlWorker from "https://esm.sh/monaco-editor@0.46.0/esm/vs/language/html/html.worker.js"
import * as tsWorker from "https://esm.sh/monaco-editor@0.46.0/esm/vs/language/typescript/ts.worker.js"
import * as editorWorker from "https://esm.sh/monaco-editor@0.46.0/esm/vs/editor/editor.worker.js"

self.MonacoEnvironment = {
	getWorker: (workerId, label) => {
        console.log({ workerId, label })
		if (label === "json") {
			return jsonWorker()
		}
		if (label === "css" || label === "scss" || label === "less") {
			return cssWorker()
		}
		if (label === "html" || label === "handlebars" || label === "razor") {
			return htmlWorker()
		}
		if (label === "typescript" || label === "javascript") {
			return tsWorker()
		}
		return editorWorker()
	},
}

monaco.editor.create(document.getElementById("container"), {
	value: ["const x = () => {", '\tconsole.log("Hello world!")', "}"].join("\n"),
	language: "javascript",
})
