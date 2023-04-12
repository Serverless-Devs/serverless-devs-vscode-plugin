import * as path from 'path';
import * as fs from 'fs';
import commandExsits from 'command-exists';
import * as vscode from 'vscode';
import { ext } from '../extensionVariables';
import { TEMPLTE_FILE, TERMINAL_NAME, DEVS_INSTALL_CMD } from '../constants';
import i18n from '../i18n';


export { MultiStepInput } from './multiStepInput';
export { ItemData, TreeItem } from './treeItem';

export function getQuickCommands() {
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return Array.isArray(data['quick-commands']) ? data['quick-commands'] : [];
}

export function getMarkedYamls() {
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return Array.isArray(data['marked-yamls']) ? data['marked-yamls'] : [];
}

function checkDevsInstalled() {
  return new Promise((resolve) => {
    commandExsits('s', (err, commandExists) => {
      if (err) {
        resolve(false);
      }
      resolve(commandExists);
    });
  });
}
export async function createTerminal(command: string) {
  const isDevsInstalled = await checkDevsInstalled();
  let newCommand = command;
  if (!isDevsInstalled) {
    const res = await vscode.window.showInformationMessage(
      i18n('vscode.common.check_devs_is_installed'),
      'yes',
      'no',
    );
    if (res !== 'yes') return;
    newCommand = `${DEVS_INSTALL_CMD} && ${command}`;
  }

  const terminals = vscode.window.terminals;
  for (const item of terminals) {
    if (item.name === TERMINAL_NAME) {
      item.dispose();
    }
  }
  const terminal = vscode.window.createTerminal(TERMINAL_NAME);
  terminal.sendText(newCommand);
  terminal.show();
  return terminal;

}
