import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as core from '@serverless-devs/core';
import { baseSchema } from './schema';
const { getRootHome, lodash: _ } = core;


export async function updateYamlSettings() {
  const yamlConfig: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('yaml');
  const schemasObj: any = yamlConfig.get('schemas');
  const schemaPath: string = path.join(getRootHome(), 'vscodeSchema.json');
  if (_.isEmpty(schemasObj)) {
    writeJsonSchema(yamlConfig, schemaPath, baseSchema);
  }


}

function writeJsonSchema(
  yamlConfig: vscode.WorkspaceConfiguration,
  schemaPath: string,
  schema: any
) {
  yamlConfig.update(
    'schemas',
    {
      [schemaPath]: ["*/*.yaml", "*/*.yml"]
    },
    vscode.ConfigurationTarget.Global
  );
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));
}
