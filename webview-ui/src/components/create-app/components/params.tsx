import { Button, Icon, Form, Field, Select, Input, Loading } from '@alicloud/console-components';
import { FC, useEffect, useState } from 'react';
import { FORM_LAYOUT, RANDOM_PATTERN } from '@/constants';
import { generateRandom, vscode, sleep } from '@/utils';
import { getAppParams } from '@/services/app';
import { useRequest } from 'ahooks';
import { endsWith, first, get, includes, map, replace } from 'lodash';
import { CreateAppType, IEventData } from '@/constants';
import i18n from '@/i18n';


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
  const [submitting, setSubmitting] = useState(false);
  const { data = {}, loading } = useRequest(getAppParams, {
    defaultParams: [{ name: appName }],
  });
  const field = Field.useField();
  const { init, validate, setValue, getValue } = field;

  useEffect(() => {
    const fn = (event: IEventData) => {
      const { eventId, data } = event.data;
      if (eventId === 'setDownloadPath') {
        setValue('$downloadPath', get(data, 'downloadPath'));
      }
    };
    // 监听webview发来的消息
    window.addEventListener('message', fn);
    return () => {
      window.removeEventListener('message', fn);
    };
  }, []);
  const handleCreate = () => {
    validate(async (errors, values) => {
      console.log('errors', errors, values);
      if (errors) return;
      setSubmitting(true);
      vscode.postMessage({
        command: 'createApp',
        data: {
          ...values,
          $template: appName,
        },
      });
      await sleep();
      setSubmitting(false);
    });
  };
  const openFolder = () => {
    vscode.postMessage({
      command: 'setDownloadPath',
      data: {
        downloadPath: getValue('$downloadPath'),
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
          message: i18n('webview.create_app.params_required', { name: item.title })
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
          <span className="ml-4">{i18n('webview.common.back')}</span>
        </div>
      )}
      <Loading visible={loading} inline={false}>
        <Form field={field} {...FORM_LAYOUT}>
          <FormItem label={i18n('webview.create_app.initialization_path')} required>
            <Input
              className="full-width"
              readOnly
              {...init('$downloadPath', {
                initValue: downloadPath,
                rules: [
                  {
                    required: true,
                    message: i18n('webview.create_app.initialization_path_required'),
                  },
                ],
              })}
              innerAfter={
                <Icon type="folder" className="mr-8 cursor-pointer" onClick={openFolder} />
              }
            />
          </FormItem>
          <FormItem label={i18n('webview.create_app.application_name')} required>
            <Input
              className="full-width"
              {...init('$appName', {
                initValue: appName,
                rules: [
                  {
                    required: true,
                    message: i18n('webview.create_app.application_name_required'),
                  },
                ],
              })}
            />
          </FormItem>
          <FormItem label={i18n('webview.create_app.key_alias')} required>
            <Select
              showSearch
              placeholder={i18n('webview.create_app.key_alias_placeholder')}
              className="full-width"
              {...init('$alias', {
                initValue: includes(aliasList, 'default') ? 'default' : first(aliasList),
                rules: [
                  {
                    required: true,
                    message: i18n('webview.create_app.key_alias_required'),
                  },
                ],
              })}
              dataSource={aliasList}
            />
          </FormItem>
          {renderProperties()}
          <FormItem className="mt-32">
            <Button type="primary" onClick={handleCreate} loading={submitting}>
              {i18n('webview.common.create')}
            </Button>
            {type === CreateAppType.registry && (
              <Button className="ml-16" onClick={onBack} disabled={submitting}>
                {i18n('webview.common.cancel')}
              </Button>
            )}
          </FormItem>
        </Form>
      </Loading>
    </div>
  );
};

export default Params;
