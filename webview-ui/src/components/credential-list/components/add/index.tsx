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
    console.log(obj.doc);
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
        title={'添加密钥'}
        isShowing={visible}
        onClose={handleClose}
        onOk={handleOK}
        onCancel={handleClose}
        isProcessing={loading}
      >
        {includes(existAlias, getValue('alias')) && (
          <Message type="warning" className="mb-16">
            您已经添加过 {getValue('alias')} 的密钥，继续添加将会覆盖原有的密钥
          </Message>
        )}
        <Form field={field} {...FORM_LAYOUT}>
          <FormItem label="云厂商" required style={{ position: 'relative' }}>
            <Select
              showSearch
              placeholder="请选择云厂商"
              className="full-width"
              {...init('provider', {
                initValue: PROVIDER.alibaba,
                rules: [
                  {
                    required: true,
                    message: '云厂商不能为空',
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
                密钥获取引导
              </Button>
            )}
          </FormItem>
          <FormItem label="密钥别名" required>
            <Input
              placeholder="请输入密钥别名"
              className="full-width"
              {...init('alias', {
                rules: [
                  {
                    required: true,
                    message: '密钥别名不能为空',
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