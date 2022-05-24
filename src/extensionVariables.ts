import * as vscode from "vscode";
import { LocalResource } from "./local-resource";

export namespace ext {
  export let context: vscode.ExtensionContext;
  export let cwd: string | undefined;
  export let localResource: LocalResource;
}
