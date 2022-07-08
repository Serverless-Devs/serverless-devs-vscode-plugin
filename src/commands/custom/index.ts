import { ItemData, getQuickCommands, createTerminal } from "../../common";
import * as core from "@serverless-devs/core";
const { lodash: _ } = core;

export async function custom(itemData: ItemData) {
  const quickCommandList = getQuickCommands();
  const findObj = _.find(
    quickCommandList,
    (item) => item.path === itemData.spath
  );
  let command =
    itemData.contextValue === "app"
      ? `s ${itemData.scommand} -t ${itemData.spath}`
      : `s ${itemData.label} ${itemData.scommand} -t ${itemData.spath}`;
  if (findObj) {
    command = `${command} -t ${findObj.path}`;
    const argsObj = _.find(
      findObj.$shortcuts,
      (item) => item.command === itemData.scommand
    );
    if (argsObj.args) {
      command = `${command} ${argsObj.args}`;
    }
  }
  createTerminal(command);
}
