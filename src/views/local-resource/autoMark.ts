import * as fs from 'fs';
import * as path from 'path';
import * as core from '@serverless-devs/core';
import { ext } from '../../extensionVariables';
import { TEMPLTE_FILE } from '../../constants';
import { ImarkedYamlItem } from '../../interface';
import i18n from '../../i18n';
const globby = require('globby');
const { lodash: _ } = core;


async function autoMark(appPath: string) {
  const filePath = path.join(appPath, TEMPLTE_FILE);
  // 如果文件存在，说明已经标记过了，直接返回
  if (fs.existsSync(filePath)) return;
  const files = await globby(['**/*.yaml', '**/*.yml', '!**/node_modules'], {
    cwd: appPath,
  });
  const markedYamls = [] as ImarkedYamlItem[];
  for (const filePath of files) {
    const checked = await checkYaml(path.join(appPath, filePath));
    if (checked) {
      markedYamls.push({
        path: filePath,
        alias: i18n('vscode.common.default_environment'),
      });
    }
  }
  if (_.isEmpty(markedYamls)) return;
  fs.writeFileSync(filePath, JSON.stringify({ 'marked-yamls': markedYamls }, null, 2));
  ext.localResource.refresh();
}

async function checkYaml(filePath: string) {
  try {
    // 方法执行成功说明yaml文件符合devs规范
    const res = await core.transforYamlPath(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

export default autoMark;
