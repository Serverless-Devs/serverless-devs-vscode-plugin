import * as vscode from "vscode";
import { ItemData, getQuickCommands } from "../../common";
import * as core from "@serverless-devs/core";
import { TERMINAL_NAME } from "../../constants";
const { lodash: _ } = core;

export async function custom(itemData: ItemData) {
  const quickCommandList = getQuickCommands();
  const findObj = _.find(
    quickCommandList,
    (item) => item.path === itemData.spath
  );
  let command =
    itemData.contextValue === "app"
      ? `s ${itemData.scommand}`
      : `s ${itemData.label} ${itemData.scommand}`;
  if (findObj) {
    const argsObj = _.find(
      findObj.shortcuts,
      (item) => item.command === itemData.scommand
    );
    if (argsObj) {
      command = `${command} ${argsObj.args}`;
    }
  }

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
