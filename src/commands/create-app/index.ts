import * as vscode from 'vscode';
import init from '../init';
import * as core from '@serverless-devs/core';
import CreateAppPanel from '../../panels/create-app';
import { CreateAppType } from '../../interface';
import i18n from '../../i18n';
const { lodash: _ } = core;

const createApp = async (context: vscode.ExtensionContext) => {
  const result = await vscode.window.showQuickPick(
    [
      {
        label: i18n('vscode.commands.create_app.create_new_applications_from_templates'),
        value: CreateAppType.template,
      },
      {
        label: i18n('vscode.commands.create_app.create_new_applications_from_registry'),
        value: CreateAppType.registry,
      },
    ],
    {
      placeHolder: i18n('vscode.commands.create_app.how_would_you_like_to_create_your_app'),
    },
  );
  _.get(result, 'value') === CreateAppType.template
    ? await init(context)
    : await CreateAppPanel.render(context);
};

export default createApp;
