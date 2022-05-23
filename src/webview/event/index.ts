import * as vscode from "vscode";

export function webViewEvent(message: any) {
  const command = message.command;
  const text = message.text;
  switch (command) {
    case "hello":
      vscode.window.showInformationMessage(text);
      return;
  }
}
