import {
  QuickPickItem,
  window,
  ExtensionContext,
  QuickInputButtons,
  Uri,
} from "vscode";
import { MultiStepInput } from "../../lib/multiStepInput";
import { providers } from "./constants";

const title = "Init Serverless Devs Application";

export async function init(context: ExtensionContext) {
  interface State {
    title: string;
    step: number;
    totalSteps: number;
    provider: QuickPickItem;
    name: string;
  }

  async function collectInputs() {
    const state = {} as Partial<State>;
    await MultiStepInput.run((input) => pickCloudProvider(input, state));
    return state as State;
  }

  async function pickCloudProvider(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.provider = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 3,
      placeholder: "Pick a resource group",
      items: providers,
      activeItem:
        typeof state.provider !== "string" ? state.provider : undefined,
      shouldResume: shouldResume,
    });
    return (input: MultiStepInput) => pickSolution(input, state);
  }

  async function pickSolution(input: MultiStepInput, state: Partial<State>) {
    console.log(state);

    if (state.provider.label === "Alibaba Cloud Serverless") {
      await input.showQuickPick({
        title,
        step: 2,
        totalSteps: 3,
        placeholder: "Hello, serverlesser. Which template do you like?",
        items: [
          {
            label: "Quick start",
            description: "Deploy a Hello World function to FaaS",
          },
          {
            label: "Web Framework",
            description: "Deploy a web framework to FaaS",
          },
          {
            label: "Container example",
            description: "Deploy function to FaaS with custom-container",
          },
          {
            label: "Static website",
            description: "Deploy a static website",
          },
          {
            label: "Best practice",
            description: "Experience serverless project",
          },
        ],
        shouldResume: shouldResume,
      });
      return (input: MultiStepInput) => pickAliyunCommand(input, state);
    } else if (state.provider.label === "AWS Cloud Serverless") {
    }
  }

  async function pickAliyunCommand(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    const commandItem = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 3,
      placeholder: "Pick a runtime",
      items: ["Express.js", "Egg.js", "Koa.js"].map((label) => ({ label })),
      shouldResume: shouldResume,
    });
    state.name = commandItem.label;
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    });
  }
  const state = await collectInputs();
  window.showInformationMessage(`Creating Application Service '${state.name}'`);
}
