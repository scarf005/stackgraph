export default () => /*html*/ `
    <!DOCTYPE html>
        <html lang="en">
            <head>
                <link rel="stylesheet" type="text/css" href="https://esm.sh/monaco-editor@0.46.0/min/vs/editor/editor.main.css" />
                <style>
                    main {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        min-height: 90vh;
                    }

                    section {
                        border: 1px solid #ccc;
                    }

                    #container {
                        height: 100%;
                    }
                </style>
            </head>

            <body>
                <h1>Monaco Editor</h1>
                <main>
                    <section>
                        <h2>Editor</h2>
                        <div id="container"></div>
                    </section>
                    <section>
                        <h2>Output</h2>
                        (Empty)
                    </section>
                </main>
            </body>
            <script type="module" src="/assets/monaco.js"></script>
    </html>
`
