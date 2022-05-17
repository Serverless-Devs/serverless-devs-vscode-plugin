import {
  QuickPickItem,
  window,
  ExtensionContext,
  QuickInputButtons,
  Uri,
} from "vscode";
import { MultiStepInput } from "../../lib/multiStepInput";
import { providers, providerCollection } from "./constants";
import * as core from "@serverless-devs/core";
import * as path from "path";
import { setArgs } from "../../lib/utils";
const { lodash: _ } = core;

const title = "Add Account";

export async function config(context: ExtensionContext) {
  interface IPickItem extends QuickPickItem {
    value: string;
  }
  interface State {
    title: string;
    step: number;
    totalSteps: number;
    pickItem: IPickItem;
    name: string;
    value: string;
  }

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
      items: providers,
      activeItem: state.pickItem,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => pickSolution(input, state);
  }

  async function pickSolution(input: MultiStepInput, state: Partial<State>) {
    const tmp: any = {};
    const keyList = providerCollection[state.pickItem.value];
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
    // TODO：alibaba 的case需要获取 AccountID
    // alias
    let alias = await handleAlias(input, state);
    const filePath = path.join(core.getRootHome(), "access.yaml");
    const content = await core.getYamlContent(filePath);
    if (_.includes(_.keys(content), alias)) {
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
        alias = await handleAlias(input, state);
      }
      if (state.pickItem.value === "exit") {
        return;
      }
    }
    await core.setKnownCredential(tmp, alias);
    window.showInformationMessage(`Add ${alias} configuration successful.`);
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
  const state = await collectInputs();
}
