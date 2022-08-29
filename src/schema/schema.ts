import * as core from '@serverless-devs/core';
const { getYamlContent, lodash: _ } = core;

// 基本信息的schema
export const baseSchema = {
  "$id": "http://json-schema.org/draft-04/schema#",
  "type": "object",
  "definitions": {},
  "properties": {
    "edition": {
      "type": "string",
      "description": "命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范"
    },
    "name": {
      "type": "string",
      "description": "应用名称"
    },
    "access": {
      "type": "string",
      "description": "密钥别名"
    },
    "vars": {
      "type": "object",
      "description": "全局变量，提供给各个服务使用，是一个Key-Value的形式"
    },
    "services": {
      "type": "object",
      "description": "应用所包含的服务",
      "patternProperties": {
        "^[a-zA-Z0-9-]*$": {
          "properties": {
            "access": {
              "type": "string",
              "description": "密钥别名(此处的密钥可忽略)"
            },
            "component": {
              "type": "string",
              "description": "组件名称"
            },
            "actions": {
              "type": "object",
              "description": "自定义执行逻辑"
            },
            "props": {
              "type": "object",
              "description": "组件的属性值"
            }
          }
        }
      }
    }
  },
  "required": ["edition", "name", "access"],
  "additionalProperties": true
};

// 应用所依赖组件的schema
export async function getCmptSchema(
  cmptPublishPath: string
): Promise<any> {
  const cmptBaseSchema: any = baseSchema;
  const cmptYamlContent: any = await getYamlContent(cmptPublishPath);
  console.log(cmptYamlContent);
  const definitions: any = cmptYamlContent.Properties.definitions;
  const properties: any = _.omit(cmptYamlContent.Properties, "definitions");
  if (!_.isEmpty(properties)) {
    cmptBaseSchema.definitions = definitions;
    cmptBaseSchema
      .properties
      .services
      .patternProperties['^[a-zA-Z0-9-]*$']
      .properties.props = properties;
  } else {
    throw new Error('The component maybe invalid.');
  }
  return cmptBaseSchema;
}
