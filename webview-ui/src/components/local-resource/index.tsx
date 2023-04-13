import { FC, useState } from 'react';
import { vscode, sleep } from '@/utils';
import { Table, Dialog, Input, Icon, Field, Form } from '@alicloud/console-components';
import Header from '@/components/header';
import { get, map } from 'lodash';
import { FORM_LAYOUT, ICONS } from '@/constants';
import i18n from '@/i18n';

type IShortcutsItem = { id: string; command: string, args?: string }
type IQuickCommandItem = IShortcutsItem & { desc: string };


type Props = {
  itemData: any;
  quickCommandList: IQuickCommandItem[];
  shortcuts: IShortcutsItem[];
};

const LocalResource: FC<Props> = (props) => {
  const {
    itemData = {},
    quickCommandList: _quickCommandList = [],
    shortcuts: _shortcuts = []
  } = props;

  const [alias, setAlias] = useState<string>(itemData.alias);
  const [shortcuts, setShortcuts] = useState<IShortcutsItem[]>(_shortcuts);
  const [quickCommandList, setQuickCommandList] = useState<IQuickCommandItem[]>(_quickCommandList);

  const field = Field.useField();
  const { init, getValue, setValue, validate } = field;

  const handleUpdateAlias = async () => {
    validate(async (errors, values) => {
      if (errors) return;
      const newAlias = get(values, 'alias', '');
      setAlias(newAlias);
      setValue('updateAliasLoading', true);
      vscode.postMessage({
        command: 'updateAlias',
        data: {
          alias: newAlias,
          itemData
        }
      });
      await sleep(300);
      setValue('updateAliasLoading', false);
      setValue('visible', false);
    });
  }

  const handleShortcutsArgs = (value: string, record: IShortcutsItem) => {
    const newData = map(shortcuts, (item) => {
      if (item.id === record.id) {
        return {
          ...item,
          args: value
        }
      }
      return item;
    });
    setShortcuts(newData);
    vscode.postMessage({
      command: 'updateShortcuts',
      data: {
        shortcuts: newData,
        itemData,
      }
    });

  }

  const handleArgs = (value: string, record: IShortcutsItem) => {
    const newData = map(quickCommandList, (item) => {
      if (item.id === record.id) {
        return {
          ...item,
          args: value
        }
      }
      return item;
    });
    setQuickCommandList(newData);
    vscode.postMessage({
      command: 'updateQuickCommandList',
      data: {
        quickCommandList: newData,
        itemData,
      }
    });

  }

  const shortcutsColumns = [
    {
      title: i18n('webview.local_resource.shortcut_button'),
      align: 'center',
      cell: (value, _index, record) => {
        if (record.command === 'deploy') {
          return <img src={ICONS.DEPLOY} alt='deploy' />
        }
        if (record.command === 'build') {
          return <img src={ICONS.BUILD} alt='build' />
        }
        if (record.command === 'invoke') {
          return <img src={ICONS.INVOKE} alt='invoke' />
        }
      }
    },
    {
      key: 'command',
      align: 'center',
      title: i18n('webview.local_resource.behavior_configuration'),
      dataIndex: 'command',
    },
    {
      key: 'args',
      align: 'center',
      title: i18n('webview.local_resource.parameter_configuration'),
      dataIndex: 'args',
      cell: (value, _index, record) => {
        return <Input className='full-width' placeholder={i18n('webview.common.enter_parameters')} value={value} onChange={(value,) => handleShortcutsArgs(value, record)} />;
      }
    },

  ];

  const handleOperate = (record: IQuickCommandItem) => {
    let spath = itemData.spath;
    let command =
      itemData.contextValue === "app"
        ? `s ${record.command}`
        : `s ${itemData.label} ${record.command}`;
    if (record.args) {
      command = `${command} ${record.args}`;
    }
    command = `${command} -t ${spath}`
    vscode.postMessage({
      command: "executeCommand",
      data: {
        command,
      }
    });
  }

  const quickCommandColumns = [
    {
      key: 'command',
      align: 'center',
      title: i18n('webview.common.command'),
      dataIndex: 'command',
    },
    {
      key: 'desc',
      align: 'center',
      title: i18n('webview.common.explain'),
      dataIndex: 'desc',
    },
    {
      key: 'args',
      align: 'center',
      title: i18n('webview.local_resource.parameter_configuration'),
      dataIndex: 'args',
      cell: (value, _index, record) => {
        return <Input className='full-width' placeholder={i18n('webview.common.enter_parameters')} value={value} onChange={(value,) => handleArgs(value, record)} />;
      }
    },
    {
      title: i18n('webview.common.exec'),
      align: 'center',
      cell: (value, _index, record) => (
        <img onClick={() => handleOperate(record)} className='cursor-pointer' src={ICONS.INVOKE} alt='execute' />
      ),
    },
  ];


  const renderAlias = () => {
    if (itemData.contextValue === "app") {
      return `${alias}(${itemData.spath})`;
    }
    return `${alias}(${itemData.spath}) > ${itemData.label}`;
  }

  return (
    <>
      <Header title={renderAlias()} extra={<Icon className='cursor-pointer' type='edit' onClick={() => { setValue('visible', true) }} />} />
      <Header size='small' title={i18n('webview.local_resource.shortcut_operation')} subtitle={i18n('webview.local_resource.shortcut_operation_subtitle')} />
      <Table
        className="mt-16"
        dataSource={shortcuts}
        columns={shortcutsColumns}
        emptyContent={i18n('webview.common.no_data')}
      />
      <Header size='small' className='mt-16' title={i18n('webview.common.quick_operation')} subtitle={i18n('webview.common.quick_operation_subtitle')} />
      <Table
        className="mt-16"
        dataSource={quickCommandList}
        columns={quickCommandColumns}
        emptyContent={i18n('webview.common.no_data')}
      />
      {/* react 18 使用 Dialog.show 报错 */}
      <Dialog title={i18n('webview.common.edit')}
        visible={getValue('visible')}
        size='small'
        onOk={handleUpdateAlias}
        onCancel={() => setValue('visible', false)}
        onClose={() => setValue('visible', false)}
        okProps={{ loading: getValue('updateAliasLoading') }}
      >
        <Form field={field}>
          <Form.Item label={i18n('webview.common.alias')} {...FORM_LAYOUT} required>
            <Input className='full-width' {...init('alias', {
              initValue: alias,
              rules: [{
                required: true,
                message: i18n('"webview.common.alias_required'),
              }]
            })} />
          </Form.Item>
        </Form>

      </Dialog>
    </>
  );
};

export default LocalResource;
