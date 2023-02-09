// import * as vscode from "vscode";

// let myStatusBarItem: vscode.StatusBarItem;

// export function statusBarItem(context: vscode.ExtensionContext) {
//   const { subscriptions } = context;
//   // register a command that is invoked when the status bar
//   // item is selected
//   const myCommandId = "sample.showSelectionCount";
//   subscriptions.push(
//     vscode.commands.registerCommand(myCommandId, () => {
//       const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
//       vscode.window.showInformationMessage(
//         `Yeah, ${n} line(s) selected... Keep going---serverless-devs!`
//       );
//     })
//   );

//   // create a new status bar item that we can now manage
//   // 终端的权重大概在50
//   myStatusBarItem = vscode.window.createStatusBarItem(
//     vscode.StatusBarAlignment.Left,
//     100
//   );
//   myStatusBarItem.command = myCommandId;
//   subscriptions.push(myStatusBarItem);

//   // register some listener that make sure the status bar
//   // item always up-to-date
//   subscriptions.push(
//     vscode.window.onDidChangeActiveTextEditor(updateStatusBarItem)
//   );
//   subscriptions.push(
//     vscode.window.onDidChangeTextEditorSelection(updateStatusBarItem)
//   );

//   // update status bar item once at start
//   updateStatusBarItem();
// }

// function updateStatusBarItem(): void {
//   const n = getNumberOfSelectedLines(vscode.window.activeTextEditor);
//   if (n > 0) {
//     myStatusBarItem.text = `$(megaphone) ${n} line(s) selected---serverless-devs`;
//     myStatusBarItem.show();
//   } else {
//     myStatusBarItem.hide();
//   }
// }

// function getNumberOfSelectedLines(
//   editor: vscode.TextEditor | undefined
// ): number {
//   let lines = 0;
//   if (editor) {
//     lines = editor.selections.reduce(
//       (prev, curr) => prev + (curr.end.line - curr.start.line),
//       0
//     );
//   }
//   return lines;
// }

import * as vscode from 'vscode';

let myStatusBarItem: vscode.StatusBarItem;

export function statusBarItem(context: vscode.ExtensionContext) {
  const { subscriptions } = context;
  // register a command that is invoked when the status bar
  // item is selected
  const myCommandId = 'sample.showSelectionCount';
  subscriptions.push(
    vscode.commands.registerCommand(myCommandId, () => {
      vscode.window.showInformationMessage(`this message from status bar`);
    }),
  );

  // create a new status bar item that we can now manage
  // 终端的权重大概在50
  myStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  myStatusBarItem.command = myCommandId;
  myStatusBarItem.text = `default:cn-hangzhou`;
  myStatusBarItem.show();
  subscriptions.push(myStatusBarItem);
}
