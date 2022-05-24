import * as vscode from "vscode";

export default function (params: { type: string; message: string }) {
  switch (params.type) {
    case "hello":
      vscode.window.showInformationMessage(params.message);
      return;
  }
}
