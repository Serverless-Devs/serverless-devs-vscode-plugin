import { FC, useState, PropsWithChildren } from 'react';
import SlidePanel from '@/components/slide-panel';
import { Form, Field, Select, Button, Input, Message } from '@alicloud/console-components';
import { FORM_LAYOUT, PROVIDER_LIST, PROVIDER } from '@/constants';
import { sleep, vscode } from '@/utils';
import Alibaba from './components/Alibaba';
import Aws from './components/Aws';
import Azure from './components/Azure';
import Google from './components/Google';
import Tencent from './components/Tencent';
import Custom, { customValidate, customFormat } from './components/Custom';
import { find, includes, isEmpty } from 'lodash';
import i18n from '@/i18n';

const FormItem = Form.Item;

type IProps = PropsWithChildren & {
  existAlias: string[];
};

const Add: FC<IProps> = (props) => {
  const { children, existAlias } = props;
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const field = Field.useField();
  const { init, resetToDefault, validate, getValue } = field;
  const handleClose = () => {
    resetToDefault();
    setVisible(false);
  };
  const handleOK = async () => {
    validate(async (errors, values: any) => {
      if (errors) return;
      setLoading(true);
      const { provider, alias, custom, ...rest } = values;
      let data = { provider, alias, ...rest };
      if (provider === PROVIDER.custom) {
        const customData = customFormat(custom);
        data = { provider, alias, ...customData };
      }
      vscode.postMessage({
        command: 'addCredential',
        data,
      });
      await sleep();
      setLoading(false);
    });
  };
  const handleDoc = () => {
    const obj = find(PROVIDER_LIST, (item) => item.value === getValue('provider'));
    if (isEmpty(obj)) return;
    vscode.postMessage({
      command: 'openAccessUrl',
      data: obj,
    });
  };

  const showDocButton = !!getValue('provider') && getValue('provider') !== PROVIDER.custom;

  return (
    <>
      <span onClick={() => setVisible(true)}>{children}</span>
      <SlidePanel
        title={i18n('webview.credential_list.add_key')}
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        {includes(existAlias, getValue('alias')) && (
          <Message type="warning" className="mb-16">
            {i18n('webview.credential_list.alias_exist', { alias: getValue('alias') })}
          </Message>
        )}
        <Form field={field} {...FORM_LAYOUT}>
          <FormItem label={i18n('webview.credential_list.cloud_vendor')} required style={{ position: 'relative' }}>
            <Select
              showSearch
              placeholder={i18n('webview.credential_list.cloud_vendor_placeholder')}
              className="full-width"
              {...init('provider', {
                initValue: PROVIDER.alibaba,
                rules: [
                  {
                    required: true,
                    message: i18n('webview.credential_list.cloud_vendor_required'),
                  },
                ],
              })}
              dataSource={PROVIDER_LIST}
            />
            {showDocButton && (
              <Button
                style={{ position: 'absolute', right: 0, top: 5 }}
                type="primary"
                text
                onClick={handleDoc}
              >
                {i18n('webview.credential_list.how_to_get')}
              </Button>
            )}
          </FormItem>
          <FormItem label={i18n('webview.create_app.key_alias')} required>
            <Input
              placeholder={i18n('webview.create_app.input_key_alias_placeholder')}
              className="full-width"
              {...init('alias', {
                rules: [
                  {
                    required: true,
                    message: i18n('webview.create_app.key_alias_required'),
                  },
                ],
              })}
            />
          </FormItem>
          {getValue('provider') === PROVIDER.alibaba && <Alibaba field={field} />}
          {[PROVIDER.aws, PROVIDER.huawei, PROVIDER.baidu].includes(getValue('provider')) && (
            <Aws field={field} />
          )}
          {getValue('provider') === PROVIDER.azure && <Azure field={field} />}
          {getValue('provider') === PROVIDER.google && <Google field={field} />}
          {getValue('provider') === PROVIDER.tencent && <Tencent field={field} />}

          {getValue('provider') === PROVIDER.custom && (
            <FormItem label="Custom" required>
              <Custom
                {...init('custom', {
                  rules: [
                    {
                      required: true,
                      validator: customValidate,
                    },
                  ],
                })}
              />
            </FormItem>
          )}
        </Form>
      </SlidePanel>
    </>
  );
};

export default Add;
