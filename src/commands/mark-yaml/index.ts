import * as vscode from 'vscode';
import * as path from 'path';
import * as core from '@serverless-devs/core';
import * as fs from 'fs';
import { ext } from '../../extensionVariables';
import i18n from '../../i18n';
import { TEMPLTE_FILE } from '../../constants';
const { lodash: _ } = core;

async function markYaml(uri: vscode.Uri) {
  const { fsPath } = uri;
  try {
    // 方法执行成功说明yaml文件符合devs规范
    await core.transforYamlPath(fsPath);
    const answer = await vscode.window.showInputBox({
      title: i18n('vscode.commands.mark_yaml.alias_for_this_workspace_configuration'),
      prompt: i18n('vscode.common.please_enter'),
      validateInput: (name: string) => {
        return name.length === 0 ? i18n('vscode.common.value_required') : undefined;
      },
    });
    if (_.isEmpty(answer)) return;
    const filePath = path.join(ext.cwd, TEMPLTE_FILE);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}));
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const relativePath = path.relative(ext.cwd, fsPath);

    if (!Array.isArray(data['marked-yamls'])) {
      data['marked-yamls'] = [
        {
          path: relativePath,
          alias: answer,
        },
      ];
    } else {
      const findObj = data['marked-yamls'].find((item) => item.path === relativePath);
      if (findObj) {
        data['marked-yamls'] = data['marked-yamls'].map((item) => {
          if (item.path === relativePath) {
            item.alias = answer;
          }
          return item;
        });
      } else {
        data['marked-yamls'].push({
          path: relativePath,
          alias: answer,
        });
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    ext.localResource.refresh();
  } catch (error) {
    vscode.window.showErrorMessage(i18n('vscode.commands.mark_yaml.bad_yaml_file'));
  }
}

export default markYaml;
