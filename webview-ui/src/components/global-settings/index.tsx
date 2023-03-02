import { vscode } from '../../utilities/vscode';
import { Button, Switch, Input, Divider, Form, Field } from '@alicloud/console-components';
import { FORM_LAYOUT } from '../../constants';
import { get } from 'lodash';

function GlobalSettings() {
  const initValue = get(window, 'SERVERLESS_DEVS_CONFIG.data');

  const field = Field.useField({ values: initValue });
  const { init } = field;
  const onResetWorkspace = () => {
    vscode.postMessage({
      command: 'resetWorkspace',
    });
  };
  const onManageWorkspace = () => {
    vscode.postMessage({
      command: 'manageWorkspace',
    });
  };
  const onIssueFeedback = () => {
    vscode.postMessage({
      command: 'issueFeedback',
    });
  };
  return (
    <>
      <div className="align-center">
        <div className="text-bold fz-20">设置中心</div>
        <span className="ml-8 color-gray">系统功能配置</span>
      </div>
      <>
        <div className="mt-32 text-bold fz-18">默认工具工作空间配置</div>
        <Divider />
        <div className="color-gray">
          在使用Serverless
          Devs的过程中，我们可能会缓存一些组件到您的电脑空间，如果您想要自定义这部分内容，可以对下面的工作空间路径进行配置。
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label="工作空间配置：">
            <div className="align-center">
              <Input {...init('workspace')} isPreview />
              <Button className="ml-16" onClick={onResetWorkspace}>
                配置默认路径
              </Button>
              <Button className="ml-8" onClick={onManageWorkspace}>
                管理工作空间
              </Button>
            </div>
          </Form.Item>
        </Form>
      </>
      <>
        <div className="mt-32 text-bold fz-18">数据收集相关配置</div>
        <Divider />
        <div className="color-gray">
          为了更好的帮助我们改善Serverless Devs（包括不限于Serverless Devs CLI、Serverless
          Desktop等），我们可能会采集部分数据，进行分析，也感谢您对我们的支持。当然，如果您不想参与到我们的改善计划，您也可以在下面手动关闭。
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label="数据收集功能：" className="align-center">
            <Switch
              {...init('analysis', {
                valueName: 'checked',
                props: {
                  onChange: (checked: boolean) => {
                    vscode.postMessage({
                      command: 'setAnalysis',
                      data: {
                        analysis: checked,
                      },
                    });
                  },
                },
              })}
            />
          </Form.Item>
        </Form>
      </>
      <>
        <div className="mt-32 text-bold fz-18">Registry 配置</div>
        <Divider />
        <div className="color-gray">
          IDE插件 目前仅支持 serverless registry, 所以该字段暂不支持修改。
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label="当前Registry：" className="align-center">
            <Input value="http://registry.devsapp.cn/simple" isPreview />
          </Form.Item>
        </Form>
      </>
      <Button className="mt-32" type="primary" text size="large" onClick={onIssueFeedback}>
        问题反馈
      </Button>
    </>
  );
}

export default GlobalSettings;
