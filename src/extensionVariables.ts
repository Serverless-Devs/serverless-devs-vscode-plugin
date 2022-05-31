import * as vscode from "vscode";
import { LocalResourceTreeDataProvider } from "./local-resource/treeDataProvider";

export namespace ext {
  export let context: vscode.ExtensionContext;
  export let cwd: string | undefined;
  export let localResource: LocalResourceTreeDataProvider;
}
