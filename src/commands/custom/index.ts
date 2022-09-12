import { ItemData, getQuickCommands, createTerminal } from "../../common";
import * as core from "@serverless-devs/core";
import * as path from 'path';
import { ext } from "../../extensionVariables";
const { lodash: _ } = core;

export async function custom(itemData: ItemData) {
  const quickCommandList = getQuickCommands();
  itemData.spath = itemData.spath
    ? itemData.spath
    : itemData.path.replace(ext.cwd, '');
  const lastPathSep = itemData.spath.lastIndexOf('/');
  const spath = lastPathSep
    ? path.join(ext.cwd, itemData.spath.substring(0, lastPathSep))
    : ext.cwd;
  const yamlFileName = itemData.spath.split('/').pop();
  const findObj = _.find(
    quickCommandList,
    (item) => item.path === itemData.spath
  );
  let command = `s ${itemData.scommand}`;
  if (findObj) {
    const argsObj = _.find(
      findObj.$shortcuts,
      (item) => item.command === itemData.scommand
    );
    if (argsObj.args) {
      command = `${command} ${argsObj.args}`;
    }
  }
  createTerminal(command, spath, yamlFileName);
}

