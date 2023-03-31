import * as path from 'path';
import { commands, workspace, ExtensionContext } from 'vscode';
import GlobalSettings from './webviews/global-settings';
import CredentialList from './webviews/credential-list';
import ComponentList from './webviews/component-list';
import { ext } from './extensionVariables';
import { createTerminal } from './common';
import createApp from './commands/create-app';
import { LocalResource } from './views/local-resource';

export async function activate(context: ExtensionContext) {
  ext.context = context;
  const cwd =
    workspace.workspaceFolders && workspace.workspaceFolders.length > 0
      ? workspace.workspaceFolders[0].uri.fsPath
      : undefined;
  ext.cwd = cwd as string;

  // /**
  //  *  create the init command
  //  */
  // const initCommand = commands.registerCommand('serverless-devs.init', () => init(context));
  // /**
  //  *  create the verify command
  //  */
  // const verifyCommand = commands.registerCommand('serverless-devs.verify', (itemData) => {
  //   const template = path.relative(ext.cwd, itemData.fsPath);
  //   createTerminal(`s verify -t ${template}`);
  // });
  // /**
  //  *  create the edit command
  //  */
  // const editCommand = commands.registerCommand('serverless-devs.edit', (itemData) => {
  //   const template = path.relative(ext.cwd, itemData.fsPath);
  //   createTerminal(`s edit -t ${template}`);
  // });
  // /**
  //  *  create the home command
  //  */
  // const homeCommand = commands.registerCommand('serverless-devs.home', () => {
  //   open('https://www.serverless-devs.com');
  // });
  // /**
  //  *  create the registry command
  //  */
  // const registryCommand = commands.registerCommand('serverless-devs.registry', () => {
  //   open('http://www.devsapp.cn/index.html');
  // });
  // /**
  //  *  create the github command
  //  */
  // const githubCommand = commands.registerCommand('serverless-devs.github', () => {
  //   open('https://github.com/Serverless-Devs/Serverless-Devs');
  // });
  // /**
  //  *  create the group command
  //  */
  // const groupCommand = commands.registerCommand('serverless-devs.group', () => {
  //   open('http://i.serverless-devs.com');
  // });
  // /**
  //  *  create the issue command
  //  */
  // const issueCommand = commands.registerCommand('serverless-devs.issue', () => {
  //   open('https://github.com/Serverless-Devs/Serverless-Devs/issues');
  // });
  /**
   * create the set command, which will be used to open the GlobalSettings panel
   */
  const setCommand = commands.registerCommand('serverless-devs.set', async () => {
    await GlobalSettings.render(context);
  });
  /**
   * create the access command, which will be used to open the CredentialList panel
   */
  const accessCommand = commands.registerCommand('serverless-devs.access', async () => {
    await CredentialList.render(context);
  });
  /**
   * create the component command, which will be used to open the ComponentList panel
   */
  const componentCommand = commands.registerCommand('serverless-devs.component', async () => {
    await ComponentList.render(context);
  });
  const createAppCommand = commands.registerCommand('serverless-devs.createApp', async () => {
    await createApp(context);
  });
  /**
   * Add command to the extension context
   */
  context.subscriptions.push(
    // initCommand,
    // verifyCommand,
    // editCommand,
    // homeCommand,
    // registryCommand,
    // githubCommand,
    // groupCommand,
    // issueCommand,
    setCommand,
    accessCommand,
    componentCommand,
    createAppCommand,
  );
  await new LocalResource(context).autoMark();
}
