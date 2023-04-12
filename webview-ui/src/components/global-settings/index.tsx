import { FC } from 'react';
import { vscode } from '@/utils';
import { Button, Switch, Input, Divider, Form, Field } from '@alicloud/console-components';
import { FORM_LAYOUT, DEFAULT_REGISTRY } from '@/constants';
import Header from '@/components/header';
import i18n from '@/i18n';


type Props = {
  analysis: boolean;
  workspace: string;
};

const GlobalSettings: FC<Props> = (props) => {
  const field = Field.useField({ values: props });
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
      <Header title={i18n('webview.global_settings.set_center')} subtitle={i18n('webview.global_settings.system_function_configuration')} />
      <>
        <div className="text-bold fz-18">{i18n('webview.global_settings.default_tool_workspace_configuration')}</div>
        <Divider />
        <div className="color-gray">
          {i18n('webview.global_settings.set_center_tips')}
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label={i18n('webview.global_settings.workspace_configuration')}>
            <div className="align-center">
              <Input {...init('workspace')} isPreview />
              <Button className="ml-16" onClick={onResetWorkspace}>
                {i18n('webview.global_settings.configure_the_default_path')}
              </Button>
              <Button className="ml-8" onClick={onManageWorkspace}>
                {i18n('webview.global_settings.manage_workspace')}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </>
      <>
        <div className="mt-32 text-bold fz-18">{i18n('webview.global_settings.data_collection_related_configuration')}</div>
        <Divider />
        <div className="color-gray">
          {i18n('webview.global_settings.data_collection_related_configuration_tips')}
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label={i18n('webview.global_settings.data_collection_functions')} className="align-center">
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
        <div className="mt-32 text-bold fz-18">{i18n('webview.global_settings.registry_configuration')}</div>
        <Divider />
        <div className="color-gray">
          {i18n('webview.global_settings.registry_configuration_tips')}
        </div>
        <Form className="mt-16" {...FORM_LAYOUT}>
          <Form.Item label={i18n('webview.global_settings.current_registry')} className="align-center">
            <Input value={DEFAULT_REGISTRY} isPreview />
          </Form.Item>
        </Form>
      </>
      <Button className="mt-32" type="primary" text size="large" onClick={onIssueFeedback}>
        {i18n('webview.global_settings.feedback')}
      </Button>
    </>
  );
};

export default GlobalSettings;
