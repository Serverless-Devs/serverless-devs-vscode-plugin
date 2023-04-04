import { FC, useState } from 'react';
import { vscode, sleep } from '@/utils';
import { Table, Dialog, Input, Icon, Field, Form } from '@alicloud/console-components';
import Header from '@/components/header';
import { get, map } from 'lodash';
import { FORM_LAYOUT, ICONS } from '@/constants';

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
      title: '快捷按钮',
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
      title: '行为配置',
      dataIndex: 'command',
    },
    {
      key: 'args',
      align: 'center',
      title: '参数配置',
      dataIndex: 'args',
      cell: (value, _index, record) => {
        return <Input className='full-width' placeholder="请输入参数" value={value} onChange={(value,) => handleShortcutsArgs(value, record)} />;
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
      title: '命令',
      dataIndex: 'command',
    },
    {
      key: 'desc',
      align: 'center',
      title: '解释',
      dataIndex: 'desc',
    },
    {
      key: 'args',
      align: 'center',
      title: '参数配置',
      dataIndex: 'args',
      cell: (value, _index, record) => {
        return <Input className='full-width' placeholder="请输入参数" value={value} onChange={(value,) => handleArgs(value, record)} />;
      }
    },
    {
      title: '执行',
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
      <Header size='small' title="快捷方式操作" subtitle="针对左侧的快捷方式进行自定义配置" />
      <Table
        className="mt-16"
        dataSource={shortcuts}
        columns={shortcutsColumns}
      />
      <Header size='small' className='mt-16' title="快速操作" subtitle="快速执行自定义指令" />
      <Table
        className="mt-16"
        dataSource={quickCommandList}
        columns={quickCommandColumns}
      />
      {/* react 18 使用 Dialog.show 报错 */}
      <Dialog title="编辑"
        visible={getValue('visible')}
        size='small'
        onOk={handleUpdateAlias}
        onCancel={() => setValue('visible', false)}
        onClose={() => setValue('visible', false)}
        okProps={{ loading: getValue('updateAliasLoading') }}
      >
        <Form field={field}>
          <Form.Item label="别名" {...FORM_LAYOUT} required>
            <Input className='full-width' {...init('alias', {
              initValue: alias,
              rules: [{
                required: true,
                message: '别名不能为空',
              }]
            })} />
          </Form.Item>
        </Form>

      </Dialog>
    </>
  );
};

export default LocalResource;
