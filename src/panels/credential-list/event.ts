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
