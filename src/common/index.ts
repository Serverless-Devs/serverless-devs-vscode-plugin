import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { ext } from '../extensionVariables';
import { TEMPLTE_FILE, TERMINAL_NAME } from '../constants';
export { MultiStepInput } from './multiStepInput';
export { ItemData, TreeItem } from './treeItem';

const ICON_PATH = 'https://docs.serverless-devs.com/favicon.ico';

export async function setPanelIcon(panel: vscode.WebviewPanel) {
  panel.iconPath = vscode.Uri.parse(ICON_PATH);
}

export function getQuickCommands() {
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return Array.isArray(data['quick-commands']) ? data['quick-commands'] : [];
}

export function createTerminal(
  command: string,
  shellPath?: string,
  yamlFileName?: string,
): vscode.Terminal {
  const terminals = vscode.window.terminals;
  const exec = yamlFileName ? `${command} -t ${yamlFileName}` : command;
  for (const item of terminals) {
    if (item.name === TERMINAL_NAME) {
      item.dispose();
    }
  }
  const terminal = shellPath
    ? vscode.window.createTerminal({ name: TERMINAL_NAME, cwd: shellPath })
    : vscode.window.createTerminal(TERMINAL_NAME);
  terminal.show();
  terminal.sendText(exec);
  return terminal;
}

export function createTerminalWithExitStatus(command: string): Promise<vscode.TerminalExitStatus> {
  const terminal = createTerminal(command);
  terminal.sendText('exit');
  return new Promise((resolve, reject) => {
    const disposeToken = vscode.window.onDidCloseTerminal(async (closedTerminal) => {
      if (closedTerminal === terminal) {
        disposeToken.dispose();
        if (terminal.exitStatus !== undefined) {
          resolve(terminal.exitStatus);
        } else {
          reject('Terminal exited with undefined status');
        }
      }
    });
  });
}
