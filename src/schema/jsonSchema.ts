import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as core from '@serverless-devs/core';
import { baseSchema, getCmptSchema } from './schema';
const { getRootHome, getYamlContent, lodash: _ } = core;


export async function updateYamlSettings(
  appPath: string
) {
  const sPath: string = getRootHome();
  const yamlConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('yaml');
  const schemasObj: any = yamlConfig.get('schemas');
  const schemaPath: string = path.join(sPath, 'vscodeSchema', 'baseSchema.json');
  const sYamlPath: string = path.join(appPath, 's.yaml');
  if (_.isEmpty(schemasObj) || _.has(schemasObj, 'schemaPath')) {
    await writeJsonSchema(schemaPath, baseSchema);
  }
  const sYamlData = await getYamlContent(sYamlPath);
  for (const service in sYamlData['services']) {
    const cmptName: string = sYamlData['services'][service]['component'];
    const cmptSchemaPath = path.join(
      sPath,
      'vscodeSchema',
      `${cmptName}Schema.json`
    );
    const cmptPublishPath = path.join(
      sPath,
      'components',
      'devsapp.cn',
      cmptName,
      'publish.yaml'
    );
    if (!(_.has(schemasObj, cmptSchemaPath))) {
      try {
        const cmptChemaData: any = await getCmptSchema(cmptPublishPath);
        await writeJsonSchema(cmptSchemaPath, cmptChemaData, schemasObj);
      } catch (e) {
        vscode.window.showErrorMessage(e);
      }
    }
  }
}

async function writeJsonSchema(
  schemaPath: string,
  schema: any,
  schemaObj?: any
) {
  const yamlConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('yaml');
  if (schemaObj && _.isEmpty(schemaObj)) {
    schemaObj[schemaPath] = ["*/*.yaml", "*/*.yml"];
    yamlConfig.update(
      'schemas',
      schemaObj,
      vscode.ConfigurationTarget.Global
    );
  } else {
    yamlConfig.update(
      'schemas',
      {
        [schemaPath]: ["*/*.yaml", "*/*.yml"]
      },
      vscode.ConfigurationTarget.Global
    );
  }
  writeSchema(schemaPath, schema);
}

// 解决fs无法创建多级目录的问题
function writeSchema(schemaPath, schemaData) {
  const pathArr = schemaPath.split('/');
  let _path = '';
  for (let i = 0; i < pathArr.length - 1; i++) {
    if (pathArr[i]) {
      _path += `/${pathArr[i]}`;
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    }
  }
  fs.writeFileSync(schemaPath, JSON.stringify(schemaData, null, 2));
}