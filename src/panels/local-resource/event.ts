import * as vscode from 'vscode';
import * as path from 'path';
import * as core from '@serverless-devs/core';
import { ext } from '../../extensionVariables';
import { ItemData, getQuickCommands, getMarkedYamls, createTerminal } from '../../common';
import { getComponentInfo } from '../../services';
import { TEMPLTE_FILE } from "../../constants";
const { lodash: _, fse: fs } = core;
interface CommandItem {
  command: string;
  desc: string;
  id?: string;
  args?: string;
}

export async function executeCommand(params: { command: string }) {
  const { command } = params;
  createTerminal(command);
}
export async function updateQuickCommandList(params: { quickCommandList: CommandItem[], itemData: ItemData }) {
  const { quickCommandList, itemData } = params;
  const stroreKey = itemData.contextValue === "app" ? "app" : itemData.label;
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (Array.isArray(data["quick-commands"])) {
    const findObj = data["quick-commands"].find(
      (item) => item.path === itemData.spath
    );
    if (findObj) {
      data["quick-commands"] = data["quick-commands"].map((item) => {
        if (item.path === itemData.spath) {
          item[stroreKey] = quickCommandList;
        }
        return item;
      });
    } else {
      data["quick-commands"].push({
        path: itemData.spath,
        [stroreKey]: quickCommandList,
      });
    }
  } else {
    data["quick-commands"] = [
      {
        path: itemData.spath,
        [stroreKey]: quickCommandList,
      },
    ];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function updateShortcuts(params: { shortcuts: { id: string; command: string, args: string }[], itemData: ItemData }) {
  const { shortcuts, itemData } = params;
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (Array.isArray(data["quick-commands"])) {
    const findObj = data["quick-commands"].find(
      (item) => item.path === itemData.spath
    );
    if (findObj) {
      data["quick-commands"] = data["quick-commands"].map((item) => {
        if (item.path === itemData.spath) {
          item.$shortcuts = shortcuts;
        }
        return item;
      });
    } else {
      data["quick-commands"].push({
        path: itemData.spath,
        $shortcuts: shortcuts,
      });
    }
  } else {
    data["quick-commands"] = [
      {
        path: itemData.spath,
        $shortcuts: shortcuts,
      },
    ];
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export async function updateAlias(params: { itemData: ItemData; alias: string }) {
  const fsPath = _.get(params, "itemData.spath");
  const alias = _.get(params, "alias");
  const filePath = path.join(ext.cwd, TEMPLTE_FILE);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify({}));
  }
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  if (!Array.isArray(data["marked-yamls"])) {
    data["marked-yamls"] = [
      {
        path: fsPath,
        alias,
      },
    ];
  } else {
    const findObj = data["marked-yamls"].find((item) => item.path === fsPath);
    if (findObj) {
      data["marked-yamls"] = data["marked-yamls"].map((item) => {
        if (item.path === fsPath) {
          item.alias = alias;
        }
        return item;
      });
    } else {
      data["marked-yamls"].push({
        path: fsPath,
        alias: alias,
      });
    }
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  ext.localResource.refresh();
}

export async function getParams(itemData: ItemData) {
  const result: any = { itemData };
  const markedYamls = getMarkedYamls();
  const markedYamlObj = _.find(markedYamls, (item) => item.path === itemData.spath);
  if (markedYamlObj) {
    result.itemData.alias = markedYamlObj.alias;
  }
  const quickCommands = getQuickCommands();
  const quickCommandObj = _.find(quickCommands, (item) => item.path === itemData.spath);
  if (itemData.contextValue === 'app') {
    const quickCommandList = await updateWithApp(itemData);
    const app = _.get(quickCommandObj, 'app');
    if (app) {
      for (const commandItem of quickCommandList) {
        const obj = _.find(app, (item) => item.command === commandItem.command);
        if (obj) {
          commandItem.args = obj.args;
        }
      }
    }
    result.quickCommandList = quickCommandList;
  } else {
    const quickCommandList = await updateWithService(itemData);
    const service = _.get(quickCommandObj, itemData.label);
    if (service) {
      for (const commandItem of quickCommandList) {
        const obj = _.find(service, (item) => item.command === commandItem.command);
        if (obj) {
          commandItem.args = obj.args;
        }
      }
    }
    result.quickCommandList = quickCommandList;
  }
  const shortcuts = _.get(quickCommandObj, '$shortcuts');
  if (shortcuts) {
    result.shortcuts = shortcuts;
  }
  return result;
}

async function updateWithApp(itemData: ItemData) {
  const filePath = path.join(ext.cwd, itemData.spath);
  const yamlData = await core.getYamlContent(filePath);
  const services = _.get(yamlData, 'services', {});
  // 寻找所有组件的命令
  const commandList = [] as CommandItem[][];
  for (const service in services) {
    const ele = services[service];
    const response = await getComponentInfo(ele.component);
    const commands = _.get(response, 'commands', {});
    const currentCommand = [] as CommandItem[];
    for (const command in commands) {
      const ele = commands[command];
      if (_.isPlainObject(ele)) {
        for (const key in ele) {
          const value = ele[key];
          currentCommand.push({ command: key, desc: value });
        }
      } else {
        currentCommand.push({ command, desc: ele });
      }
    }
    commandList.push(currentCommand);
  }
  // 寻找最少命令的组件
  let minCommand = commandList[0];
  for (const commandItem of commandList) {
    if (commandItem.length < minCommand.length) {
      minCommand = commandItem;
    }
  }
  const commonCommand = [] as CommandItem[];
  // 寻找组件共同的命令
  for (const item of minCommand) {
    const needs = [] as boolean[];
    for (const commandItem of commandList) {
      const findObj = _.find(commandItem, (obj) => obj.command === item.command);
      if (findObj) {
        needs.push(true);
      }
    }
    if (needs.length === commandList.length) {
      item.id = _.uniqueId();
      commonCommand.push(item);
    }
  }
  return commonCommand;
}
async function updateWithService(itemData: ItemData) {
  const filePath = path.join(ext.cwd, itemData.spath);
  const yamlData = await core.getYamlContent(filePath);
  const componentName = _.get(yamlData, `services.${itemData.label}.component`);
  if (_.isEmpty(componentName)) return [];
  const commandList = [] as CommandItem[];
  const response = await getComponentInfo(componentName);
  const commands = _.get(response, 'commands', {});
  for (const command in commands) {
    const ele = commands[command];
    if (_.isPlainObject(ele)) {
      for (const key in ele) {
        commandList.push({
          command: key,
          desc: ele[key],
          id: _.uniqueId(),
        });
      }
    } else {
      commandList.push({ command, desc: ele, id: _.uniqueId() });
    }
  }
  return commandList;
}

