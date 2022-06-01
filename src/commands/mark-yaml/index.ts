import * as vscode from "vscode";
import * as core from "@serverless-devs/core";
import * as fs from "fs";
import { ext } from "../../extensionVariables";

export async function markYaml(uri: vscode.Uri) {
  const { fsPath } = uri;
  try {
    // 方法执行成功说明yaml文件符合devs规范
    await core.transforYamlPath(fsPath);
    const answer = await vscode.window.showInputBox({
      title: "标记Yaml到工作空间",
      prompt: "请输入",
      validateInput: (name: string) => {
        return name.length === 0 ? "value cannot be empty." : undefined;
      },
    });
    const yamlData = await core.getYamlContent(fsPath);
    yamlData.alias = answer;
    const doc = core.modifyYaml(yamlData, fs.readFileSync(fsPath, "utf-8"));
    fs.writeFileSync(fsPath, doc, "utf-8");
    ext.localResource.refresh();
  } catch (error) {
    vscode.window.showErrorMessage("yaml文件不符合Serverless Devs规范");
  }
}
