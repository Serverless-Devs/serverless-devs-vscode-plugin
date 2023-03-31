import { Button, Icon, Form, Field, Select, Input, Loading } from '@alicloud/console-components';
import { FC, useEffect } from 'react';
import { FORM_LAYOUT, RANDOM_PATTERN } from '@/constants';
import { generateRandom, vscode } from '@/utils';
import { getAppParams } from '@/services/app';
import { useRequest } from 'ahooks';
import { endsWith, get, includes, map, replace } from 'lodash';
import { CreateAppType, IEventData } from '@/constants';

const FormItem = Form.Item;

type Props = {
  onBack: () => void;
  downloadPath: string;
  aliasList: string[];
  appName: string;
  type: `${CreateAppType}`;
};

const Params: FC<Props> = (props) => {
  const { onBack, downloadPath, appName, aliasList, type = CreateAppType.registry } = props;
  const { data = {}, loading } = useRequest(getAppParams, {
    defaultParams: [{ name: appName }],
  });
  const field = Field.useField();
  const { init, validate, setValue, getValue } = field;

  useEffect(() => {
    const fn = (event: IEventData) => {
      const { eventId, data } = event.data;
      if (eventId === 'setDownloadPath') {
        setValue('downloadPath', get(data, 'downloadPath'));
      }
    };
    // 监听webview发来的消息
    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
  const handleCreate = () => {
    validate((errors, values) => {
      console.log('errors', errors, values);
      if (errors) return;
    });
  };
  const openFolder = () => {
    vscode.postMessage({
      command: 'setDownloadPath',
      data: {
        downloadPath: getValue('downloadPath'),
      },
    });
  };
  const renderProperties = () => {
    return map(data.properties, (item, key) => {
      const required = includes(data.required, key);
      const rules: any = [];
      if (required) {
        rules.push({
          required: true,
          message: `${item.title}不能为空`,
        });
      }
      if (item.pattern) {
        rules.push({
          pattern: new RegExp(item.pattern),
        });
      }
      const initValue = endsWith(item.default, RANDOM_PATTERN)
        ? replace(item.default, RANDOM_PATTERN, generateRandom())
        : item.default;
      return (
        <FormItem key={key} label={item.title} required={required} help={item.description}>
          {item.enum ? (
            <Select
              className="full-width"
              {...init(key, {
                initValue,
                rules,
              })}
              dataSource={item.enum}
            />
          ) : (
            <Input
              className="full-width"
              {...init(key, {
                initValue,
                rules,
              })}
            />
          )}
        </FormItem>
      );
    });
  };

  return (
    <div>
      {type === CreateAppType.registry && (
        <div className="text-bold fz-20 cursor-pointer mb-16" onClick={onBack}>
          <Icon type="wind-arrow-left" />
          <span className="ml-4">返回</span>
        </div>
      )}
      <Loading visible={loading} inline={false}>
        <Form field={field} {...FORM_LAYOUT}>
          <FormItem label="初始化路径" required>
            <Input
              className="full-width"
              readOnly
              {...init('downloadPath', {
                initValue: downloadPath,
                rules: [
                  {
                    required: true,
                    message: '初始化路径不能为空',
                  },
                ],
              })}
              innerAfter={
                <Icon type="folder" className="mr-8 cursor-pointer" onClick={openFolder} />
              }
            />
          </FormItem>
          <FormItem label="应用名称" required>
            <Input
              className="full-width"
              {...init('appName', {
                initValue: appName,
                rules: [
                  {
                    required: true,
                    message: '应用名称不能为空',
                  },
                ],
              })}
            />
          </FormItem>
          <FormItem label="密钥别名" required>
            <Select
              showSearch
              placeholder="请选择密钥别名"
              className="full-width"
              {...init('alias', {
                rules: [
                  {
                    required: true,
                    message: '密钥别名不能为空',
                  },
                ],
              })}
              dataSource={aliasList}
            />
          </FormItem>
          {renderProperties()}
          <FormItem className="mt-32">
            <Button type="primary" onClick={handleCreate}>
              创建
            </Button>
            {type === CreateAppType.registry && (
              <Button className="ml-16" onClick={onBack}>
                取消
              </Button>
            )}
          </FormItem>
        </Form>
      </Loading>
    </div>
  );
};

export default Params;
