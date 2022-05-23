import * as vscode from "vscode";
import { MultiStepInput } from "../../lib/multiStepInput";
import * as core from "@serverless-devs/core";
import * as path from "path";
import { ext } from "../../extensionVariables";
import { setArgs } from "../../lib/utils";
import { State } from "../../interface";
const { lodash: _ } = core;

const title = "Add Account";

export async function config() {
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
    state.pickItem = await input.showQuickPick({
      title,
      step: state.step++,
      totalSteps: state.totalSteps,
      placeholder: "Please select a provider:",
      items: core.CONFIG_PROVIDERS,
      activeItem: state.pickItem,
      shouldResume: shouldResume,
    });
    return await pickSolution(input, state);
  }

  async function pickSolution(input: MultiStepInput, state: Partial<State>) {
    const tmp: any = {};
    const pickValue = state.pickItem.value;
    const keyList = _.get(core.CONFIG_ACCESS, pickValue);
    if (pickValue === "custom") {
      await handleCustom(tmp, input, state);
    } else {
      for (const k of keyList) {
        tmp[k] = await input.showInputBox({
          title,
          step: state.step++,
          totalSteps: state.totalSteps,
          value: state.value,
          prompt: k,
          validate: validate,
          shouldResume: shouldResume,
        });
      }
    }
    // alias
    tmp.$alias = await handleAlias(input, state);
    await checkAliasExisted(tmp, input, state);

    // alibaba 的case需要获取 AccountID
    if (pickValue === "alibaba") {
      try {
        const data: any = await core.getAccountId(tmp);
        tmp.AccountID = data.AccountId;
      } catch (error) {
        vscode.window.showErrorMessage(
          "You are configuring an incorrect Alibaba Cloud SecretKey."
        );
        return;
      }
    }
    const { $alias, ...rest } = tmp;
    await core.setKnownCredential(rest, $alias);
    ext.localResource.refresh();
    vscode.window.showInformationMessage(
      `Add ${$alias} configuration successfully.`
    );
  }

  async function checkAliasExisted(
    tmp: any,
    input: MultiStepInput,
    state: Partial<State>
  ) {
    const filePath = path.join(core.getRootHome(), "access.yaml");
    const content = await core.getYamlContent(filePath);
    if (_.includes(_.keys(content), tmp.$alias)) {
      state.pickItem = await input.showQuickPick({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        placeholder: "Alias already exists. Please select a type:",
        items: [
          { label: "overwrite", value: "overwrite" },
          { label: "rename", value: "rename" },
          { label: "exit", value: "exit" },
        ],
        activeItem: state.pickItem,
        shouldResume: shouldResume,
      });
      if (state.pickItem.value === "overwrite") {
        setArgs(["-f"]);
      }
      if (state.pickItem.value === "rename") {
        tmp.$alias = await handleAlias(input, state);
        await checkAliasExisted(tmp, input, state);
      }
      if (state.pickItem.value === "exit") {
        process.exit();
      }
    }
  }

  async function handleCustom(
    tmp: any,
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.pickItem = await input.showQuickPick({
      title,
      step: state.step++,
      totalSteps: state.totalSteps,
      placeholder: "Please select a type:",
      items: [
        { label: "Add key-value pairs", value: "add" },
        { label: "End of adding key-value pairs", value: "over" },
      ],
      activeItem: state.pickItem,
      shouldResume: shouldResume,
    });
    if (state.pickItem.value === "add") {
      const customKey = await input.showInputBox({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        value: state.value,
        prompt: "Please enter key",
        validate: validate,
        shouldResume: shouldResume,
      });
      tmp[customKey] = await input.showInputBox({
        title,
        step: state.step++,
        totalSteps: state.totalSteps,
        value: state.value,
        prompt: "Please enter value",
        validate: validate,
        shouldResume: shouldResume,
      });
      await handleCustom(tmp, input, state);
    }
  }

  async function handleAlias(input: MultiStepInput, state: Partial<State>) {
    return await input.showInputBox({
      title,
      step: state.step++,
      totalSteps: state.totalSteps,
      value: state.value,
      prompt: `Please create alias for key pair.`,
      validate: validate,
      shouldResume: shouldResume,
    });
  }

  async function validate(name: string) {
    return name.length === 0 ? "value cannot be empty." : undefined;
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    });
  }
  await collectInputs();
}
