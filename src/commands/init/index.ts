import * as vscode from "vscode";
import { MultiStepInput } from "../../common";
import { getYaml } from "../../utils";
import * as core from "@serverless-devs/core";
import { ext } from "../../extensionVariables";
import { IMultiStepInputState as State } from "../../interface";
const { lodash: _, fse } = core;

const title = "Init Serverless Devs Application";

export async function init() {
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

    const registry = await core.getSetConfig(
      "registry",
      core.DEFAULT_REGIRSTRY
    );
    const appParams = {
      registry,
      source: template.value,
      target: "./",
      name: ext.cwd,
      parameters: {},
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
    vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
      },
      async (progress, token) => {
        progress.report({
          message: `Downloading: ${template.value}...`,
        });
        const appPath = await core.loadApplication(appParams);
        progress.report({
          message: `Downloaded: ${template.value}`,
        });
        ext.localResource.refresh();
        await core.sleep(1000);
        progress.report({
          message: `Thanks for using Serverless-Devs`,
        });
        await core.sleep(1000);
        return appPath;
      }
    );
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    });
  }
  if (!ext.cwd) {
    vscode.window.showErrorMessage("Please open a workspace");
    return;
  }

  const hasYaml = await getYaml();
  if (hasYaml) {
    vscode.window.showErrorMessage(
      "A Serverless-Devs project is detected in the current workspace, Please open a new workspace"
    );
    return;
  }
  await collectInputs();
}
