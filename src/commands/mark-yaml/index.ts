import * as vscode from "vscode";
import * as path from "path";
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
    const appPath = path.dirname(fsPath);
    const filePath = path.join(appPath, ".serverless-devs");
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({}));
    }
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!Array.isArray(data["vscode-marked-yamls"])) {
      data["vscode-marked-yamls"] = [
        {
          path: fsPath,
          alias: answer,
        },
      ];
    } else {
      const findObj = data["vscode-marked-yamls"].find(
        (item) => item.path === fsPath
      );
      if (findObj) {
        data["vscode-marked-yamls"] = data["vscode-marked-yamls"].map(
          (item) => {
            if (item.path === fsPath) {
              item.alias = answer;
            }
            return item;
          }
        );
      } else {
        data["vscode-marked-yamls"].push({
          path: fsPath,
          alias: answer,
        });
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    ext.localResource.refresh();
  } catch (error) {
    vscode.window.showErrorMessage("yaml文件不符合Serverless Devs规范");
  }
}
