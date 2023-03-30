import * as vscode from 'vscode';
import init from '../init';
import * as core from '@serverless-devs/core';
import CreateAppPanel from '../../panels/create-app';
import { CreateAppType } from '../../interface';
const { lodash: _ } = core;

const createApp = async (context: vscode.ExtensionContext) => {
  const result = await vscode.window.showQuickPick(
    [
      {
        label: '通过模板创建新的应用',
        value: CreateAppType.template,
      },
      {
        label: '通过registry创建新的应用',
        value: CreateAppType.registry,
      },
    ],
    {
      placeHolder: '您希望以哪种方式创建应用？',
    },
  );
  _.get(result, 'value') === CreateAppType.template
    ? await init(context)
    : await CreateAppPanel.render(context);
};

export default createApp;
