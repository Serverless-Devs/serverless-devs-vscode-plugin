import * as path from 'path';
import * as core from '@serverless-devs/core';
import { commands, workspace, ExtensionContext, Uri } from 'vscode';
import GlobalSettings from './panels/global-settings';
import CredentialList from './panels/credential-list';
import ComponentList from './panels/component-list';
import LocalResourceWebview from './panels/local-resource';
import { ext } from './extensionVariables';
import { createTerminal } from './common';
import createApp from './commands/create-app';
import init from './commands/init';
import custom from './commands/custom';
import markYaml from './commands/mark-yaml';
import goToFile from './commands/go-to-file';
import { LocalResource } from './views/local-resource';
import { ItemData } from './common/treeItem';
import * as C from './constants';
import open from 'open';
const { lodash: _ } = core;

export async function activate(context: ExtensionContext) {
  ext.context = context;
  const cwd =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
      ? workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  ext.cwd = cwd as string;

  const subscriptionList = [
    {
      command: 'serverless-devs.goToFile',
      callback: (filePath: string, flowName: string) => {
        goToFile(filePath, flowName);
      }
    },
    {
      command: 'serverless-devs.yaml',
      callback: (uri: Uri) => markYaml(uri)
    },
    {
      command: 'serverless-devs.init',
      callback: () => init(context)
    },
    {
      command: 'serverless-devs.verify',
      callback: async (itemData) => {
        const template = path.relative(ext.cwd, itemData.fsPath);
        await createTerminal(`s verify -t ${template}`);
      }
    },
    {
      command: 'serverless-devs.edit',
      callback: async (itemData) => {
        const template = path.relative(ext.cwd, itemData.fsPath);
        await createTerminal(`s edit -t ${template}`);
      }
    },
    {
      command: 'serverless-devs.home',
      callback: () => open(C.HOME_URL)
    },
    {
      command: 'serverless-devs.registry',
      callback: () => open(C.REGISTRY_URL)
    },
    {
      command: 'serverless-devs.github',
      callback: () => open(C.GITHUB_URL)
    },
    {
      command: 'serverless-devs.group',
      callback: () => open(C.GROUP_URL)
    },
    {
      command: 'serverless-devs.issue',
      callback: () => open(C.ISSUE_URL)
    },
    {
      command: 'serverless-devs.set',
      callback: () => GlobalSettings.render(context)
    },
    {
      command: 'serverless-devs.access',
      callback: () => CredentialList.render(context)
    },
    {
      command: 'serverless-devs.component',
      callback: () => ComponentList.render(context)
    },
    {
      command: 'serverless-devs.createApp',
      callback: () => createApp(context)
    },
    {
      command: 'local-resource.set',
      callback: (itemData: ItemData) => LocalResourceWebview.render(context, { itemData })
    },
    {
      command: 'local-resource.deploy',
      callback: (itemData: ItemData) => {
        itemData.scommand = "deploy";
        custom(itemData);
      }
    },
    {
      command: 'local-resource.build',
      callback: (itemData: ItemData) => {
        itemData.scommand = "build";
        custom(itemData);
      }
    },
    {
      command: 'local-resource.invoke',
      callback: (itemData: ItemData) => {
        itemData.scommand = "invoke";
        custom(itemData);
      }
    }
  ]

  for (const item of subscriptionList) {
    const cmd = commands.registerCommand(item.command, item.callback);
    context.subscriptions.push(cmd);
  }

  await new LocalResource(context).autoMark();
}
