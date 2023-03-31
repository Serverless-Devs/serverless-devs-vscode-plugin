import * as vscode from 'vscode';
import { MultiStepInput } from '../../common';
import * as core from '@serverless-devs/core';
import { IMultiStepInputState as State, CreateAppType } from '../../interface';
import CreateAppPanel from '../../panels/create-app';

const { lodash: _ } = core;

const title = 'Init Serverless Devs Application';

async function init(context: vscode.ExtensionContext) {
  async function collectInputs() {
    const state = { step: 1 } as State;
    await MultiStepInput.run((input) => pickCloudProvider(input, state));
    return state as State;
  }

  async function pickCloudProvider(input: MultiStepInput, state: State) {
    // 第一层级
    state.pickItem = await input.showQuickPick({
      title,
      step: state.step++,
      totalSteps: state.totalSteps,
      placeholder: 'Hello Serverless for Cloud Vendors',
      items: core.INIT_PROVIDERS,
      activeItem: state.pickItem,
      shouldResume: shouldResume,
    });
    return await pickSolution(input, state);
  }

  async function pickSolution(input: MultiStepInput, state: State) {
    const pickValue = state.pickItem.value;
    let template = state.pickItem;
    if (pickValue === 'Alibaba_Cloud_Serverless') {
      // 第二层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: 'Hello, serverlesser. Which template do you like?',
        items: _.get(core.INIT_TEMPLATE, pickValue),
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      // 第三层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: 'Which template do you like?',
        items: _.get(core.INIT_ALI_TEMPLATE, state.pickItem.value),
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      template = state.pickItem;
    }
    if (pickValue === 'Dev_Template_for_Serverless_Devs') {
      // 第二层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: 'Which template do you like?',
        items: core.INIT_DEVS_TEMPLATE,
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      template = state.pickItem;
    }

    if (pickValue === 'Dev_Template_for_Serverless_Devs') {
      return;
    }
    await CreateAppPanel.render(context, {
      step: 1,
      type: CreateAppType.template,
      appName: template.value,
    });
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    });
  }
  await collectInputs();
}

export default init;
