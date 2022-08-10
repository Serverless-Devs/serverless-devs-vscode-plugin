import * as vscode from "vscode";
import { MultiStepInput } from "../../common";
import * as core from "@serverless-devs/core";
import { IMultiStepInputState as State } from "../../interface";
import { activeTemplateAppWebviewPanel } from "../../pages/template-app";
const { lodash: _ } = core;

const title = "Init Serverless Devs Application";

export async function init(context: vscode.ExtensionContext) {
  async function collectInputs() {
    const state = {} as Partial<State>;
    state.step = 1;
    await MultiStepInput.run((input) => pickCloudProvider(input, state));
    return state as State;
  }

  async function pickCloudProvider(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    // 第一层级
    state.pickItem = await input.showQuickPick({
      title,
      step: state.step++,
      totalSteps: state.totalSteps,
      placeholder: "Hello Serverless for Cloud Vendors",
      items: core.INIT_PROVIDERS,
      activeItem: state.pickItem,
      shouldResume: shouldResume,
    });
    return await pickSolution(input, state);
  }

  async function pickSolution(input: MultiStepInput, state: Partial<State>) {
    const pickValue = state.pickItem.value;
    let template = state.pickItem;
    if (pickValue === "Alibaba_Cloud_Serverless") {
      // 第二层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: "Hello, serverlesser. Which template do you like?",
        items: _.get(core.INIT_TEMPLATE, pickValue),
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      // 第三层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: "Which template do you like?",
        items: _.get(core.INIT_ALI_TEMPLATE, state.pickItem.value),
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      template = state.pickItem;
    }
    if (pickValue === "Dev_Template_for_Serverless_Devs") {
      // 第二层级
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: "Which template do you like?",
        items: core.INIT_DEVS_TEMPLATE,
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      template = state.pickItem;
    }

    const appParams = {
      source: template.value,
    };

    if (pickValue !== "Dev_Template_for_Serverless_Devs") {
      const credentialAliasList = _.map(
        await core.getCredentialAliasList(),
        (o) => ({
          label: o,
          value: o,
        })
      );
      if (credentialAliasList.length > 0) {
        state.pickItem = await input.showQuickPick({
          title,
          step: state.step++,
          totalSteps: state.totalSteps,
          placeholder: "please select credential alias",
          items: credentialAliasList,
          activeItem: state.pickItem,
          shouldResume: shouldResume,
        });
        _.set(appParams, "access", state.pickItem.value);
      }
    }
    activeTemplateAppWebviewPanel(context, appParams);
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    });
  }
  await collectInputs();
}
