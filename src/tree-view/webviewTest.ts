import * as vscode from "vscode";
import * as path from "path";

export function webviewTest(context: vscode.ExtensionContext) {
  // Track currently webview panel
  let currentPanel: vscode.WebviewPanel | undefined = undefined;
  context.subscriptions.push(
    vscode.commands.registerCommand("catCoding.start", () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;

      if (currentPanel) {
        // If we already have a panel, show it in the target column
        currentPanel.reveal(columnToShowIn);
      } else {
        // Otherwise, create a new panel
        currentPanel = vscode.window.createWebviewPanel(
          "catCoding",
          "Cat Coding",
          columnToShowIn,
          {
            // Only allow the webview to access resources in our extension's media directory
            localResourceRoots: [
              vscode.Uri.file(path.join(context.extensionPath, "media")),
            ],
            // Enable scripts in the webview
            enableScripts: true,
          }
        );

        const onDiskPath = vscode.Uri.file(
          path.join(context.extensionPath, "media", "light", "fc.svg")
        );
        const catSrc = currentPanel.webview.asWebviewUri(onDiskPath);

        currentPanel.webview.html = getWebviewContent(catSrc);

        //  close webview
        // currentPanel.dispose()

        // Reset when the current panel is closed
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined;
          },
          null,
          context.subscriptions
        );
      }
    })
  );
}

function getWebviewContent(src) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>
  </head>
  <body>
      <img src="${src}" width="300" />
     <h1 id="lines-of-code-counter">0</h1>
     <script>
        const counter = document.getElementById('lines-of-code-counter');

        let count = 0;
        setInterval(() => {
            counter.textContent = count++;
        }, 100);
    </script>

  </body>
  </html>`;
}
