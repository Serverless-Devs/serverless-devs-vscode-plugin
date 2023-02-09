import * as vscode from 'vscode';
import * as commandExsits from 'command-exists';
import { createTerminalWithExitStatus } from '.';

export function installSTool() {
  if (commandExsits.sync('npm')) {
    createTerminalWithExitStatus(`npm install @serverless-devs/s -g`)
      .then((res) => {
        vscode.commands.executeCommand('workbench.action.reloadWindow');
      })
      .catch((err) => {
        vscode.window.showErrorMessage(`Installation failed, please report to us in Dingding`);
        vscode.window.showErrorMessage(`Error: ${err}`);
      });
  } else {
    vscode.window.showErrorMessage(`You don't seem to have Node.js installed.
      Go to https://nodejs.org/ to get the installer for your computer`);
  }
}
