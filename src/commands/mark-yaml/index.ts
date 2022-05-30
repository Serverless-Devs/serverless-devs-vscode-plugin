import * as vscode from "vscode";
import * as core from "@serverless-devs/core";
import * as path from "path";
const { fse: fs } = core;

export class MarkYaml {
  constructor(private uri: vscode.Uri) {
    this.init();
  }
  async init() {
    const { fsPath } = this.uri;
    try {
      // 方法执行成功说明yaml文件符合devs规范
      await core.transforYamlPath(fsPath);
      await this.input();
    } catch (error) {
      vscode.window.showErrorMessage("yaml文件不符合Serverless Devs规范");
    }
  }
  private async input() {
    const { fsPath } = this.uri;

    const answer = await vscode.window.showInputBox({
      title: "标记Yaml到工作空间",
      prompt: "请输入",
      validateInput: (name: string) => {
        return name.length === 0 ? "value cannot be empty." : undefined;
      },
    });
    const vscodePath = path.join(path.dirname(fsPath), ".s", ".vscode.json");
    if (!fs.existsSync(vscodePath)) {
      fs.writeFileSync(vscodePath, "{}");
    }
    const vscodeJson = fs.readJSONSync(vscodePath);
    vscodeJson[fsPath] = answer;
    fs.writeJSONSync(vscodePath, vscodeJson);
  }
}
