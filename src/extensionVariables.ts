import * as vscode from "vscode";
import { ProjectTreeProvider } from "./tree-view/provider";

export namespace ext {
  export let context: vscode.ExtensionContext;
  export let cwd: string | undefined;
  export let localResource: ProjectTreeProvider;
}
