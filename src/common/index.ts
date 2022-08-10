import * as path from "path";
import * as fs from "fs";
import { ext } from "../extensionVariables";
import { TEMPLTE_FILE, TERMINAL_NAME } from "../constants";
import * as vscode from "vscode";
import { getHtmlForWebview } from "./getHtmlForWebview";

export { getHtmlForWebview } from "./getHtmlForWebview";
export { MultiStepInput } from "./multiStepInput";
export { ItemData, TreeItem } from "./treeItem";

export function getQuickCommands() {
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  return Array.isArray(data["quick-commands"]) ? data["quick-commands"] : [];
}

export function createTerminal(command: string) {
  const terminals = vscode.window.terminals;
  for (const item of terminals) {
    if (item.name === TERMINAL_NAME) {
      item.dispose();
    }
  }
  const terminal = vscode.window.createTerminal(TERMINAL_NAME);
  terminal.sendText(command);
  terminal.show();
}

export function updateWebview(
  panel:vscode.WebviewPanel,
  filename: string,
  context: vscode.ExtensionContext,
  parameter?: any
  ) {
  panel.webview.html = getHtmlForWebview(
    filename,
    context,
    panel.webview,
    parameter
  );
}
