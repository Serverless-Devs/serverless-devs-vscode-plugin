import * as fs from "fs";
import * as path from "path";
import * as core from "@serverless-devs/core";
import { ext } from "../../extensionVariables";

export class AutoMark {
  private spath: string;
  constructor(private appPath: string) {
    console.log(appPath, "appPath");

    this.spath = this.getYamlPath();
    this.init();
  }
  async init() {
    try {
      // 方法执行成功说明yaml文件符合devs规范
      await core.transforYamlPath(this.spath);
      await this.input();
    } catch (error) {
      // ignore
    }
  }
  private getYamlPath() {
    const yamlPath = path.join(this.appPath, "s.yaml");
    if (fs.existsSync(yamlPath)) {
      return yamlPath;
    }
    const ymlPath = path.join(this.appPath, "s.yml");
    if (fs.existsSync(ymlPath)) {
      return ymlPath;
    }
  }
  private async input() {
    const yamlData = await core.getYamlContent(this.spath);
    if (yamlData.alias) return;
    yamlData.alias = "默认环境";
    const doc = core.modifyYaml(yamlData, fs.readFileSync(this.spath, "utf-8"));
    fs.writeFileSync(this.spath, doc, "utf-8");
    ext.localResource.refresh();
  }
}
