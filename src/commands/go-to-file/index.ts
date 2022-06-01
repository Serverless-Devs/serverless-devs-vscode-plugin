import * as vscode from "vscode";

export async function goToFile(filePath: string) {
  const document = await vscode.workspace.openTextDocument(
    vscode.Uri.file(filePath)
  );
  await vscode.window.showTextDocument(document, {
    preserveFocus: true,
    preview: true,
  });
}
