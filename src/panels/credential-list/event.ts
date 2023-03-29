import * as vscode from 'vscode';
import * as path from 'path';
import * as core from '@serverless-devs/core';
const { lodash: _, jsyaml: yaml, fse: fs } = core;

export async function deleteCredential(access: string) {
  const filePath = path.join(core.getRootHome(), 'access.yaml');
  const data = await core.getYamlContent(filePath);
  const newData = _.omit(data, access);
  fs.writeFileSync(filePath, yaml.dump(newData));
  vscode.window.showInformationMessage(`Key [${access}] has been successfully removed.`);
}

export async function addCredential(data: any) {
  const { provider, alias, ...rest } = data;
  const newData = rest;
  if (provider === 'alibaba') {
    try {
      const info = await core.getAccountId(rest);
      newData['AccountID'] = info.AccountId;
    } catch (error) {
      vscode.window.showErrorMessage(
        `The Alibaba Cloud SecretKey is not correct, please check and try again`,
      );
      return { success: false };
    }
  }
  await core.setKnownCredential(newData, alias);
  vscode.window.showInformationMessage(`Configuration successful`);
  return { success: true };
}
