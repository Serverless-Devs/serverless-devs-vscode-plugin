import { FC, useState } from 'react';
import { vscode, sleep } from '@/utils';
import { Button, Table, Dialog, Input, Icon, Field, Form } from '@alicloud/console-components';
import Header from '@/components/header';
import { get, map, uniqueId } from 'lodash';
import { FORM_LAYOUT } from '@/constants';

type IShortcutsItem = { id: string; command: string, args?: string }
type IQuickCommandItem = IShortcutsItem & { desc: string };


type Props = {
  itemData: any;
  quickCommandList: IQuickCommandItem[];
  shortcuts: IShortcutsItem[];
};

const LocalResource: FC<Props> = (props) => {
  const {
    itemData = {
      "label": "framework",
      "id": "Default environment(s_en.yaml) > framework",
      "description": "",
      "tooltip": "",
      "scommand": "",
      "spath": "s_en.yaml",
      "alias": "Default environment",
      "contextValue": "service",
      "icon": "box.svg",
      "children": [],
      "initialCollapsibleState": 0,
      "command": {
        "command": "serverless-devs.goToFile",
        "title": "Go to file",
        "arguments": [
          "/Users/shihuali/todolist-app/s_en.yaml",
          "framework"
        ]
      }
    },
    quickCommandList: _quickCommandList = [
      {
        "command": "deploy",
        "desc": "Deploy local resources online",
        "id": "1"
      },
      {
        "command": "build",
        "desc": "Build the dependencies.",
        "id": "2"
      },
      {
        "command": "remove",
        "desc": "The ability to delete resources",
        "id": "3"
      },
      {
        "command": "metrics",
        "desc": "Query function metrics information",
        "id": "4"
      },
      {
        "command": "logs",
        "desc": "Query the function log. You need to open SLS log service",
        "id": "5"
      },
      {
        "command": "local",
        "desc": "Run your serverless application locally for quick development & testing",
        "id": "6"
      },
      {
        "command": "invoke",
        "desc": "Invoke/Trigger online functions",
        "id": "7"
      },
      {
        "command": "proxied",
        "desc": "Local invoke via proxied service.",
        "id": "8"
      },
      {
        "command": "remote",
        "desc": "Remote invoke via proxied service.",
        "id": "9"
      },
      {
        "command": "version",
        "desc": "Service version operation",
        "id": "10"
      },
      {
        "command": "alias",
        "desc": "Service alias operation",
        "id": "11"
      },
      {
        "command": "provision",
        "desc": "provision reservation operation",
        "id": "12"
      },
      {
        "command": "ondemand",
        "desc": "Resource on-demand operation",
        "id": "13"
      },
      {
        "command": "layer",
        "desc": "Resource layer operation",
        "id": "14"
      },
      {
        "command": "nas",
        "desc": "Manage nas, include upload,download and so on",
        "id": "15"
      },
      {
        "command": "plan",
        "desc": "Perceived resource change",
        "id": "16"
      },
      {
        "command": "info",
        "desc": "Query online resource details",
        "id": "17"
      },
      {
        "command": "sync",
        "desc": "Synchronize online resources to offline resources",
        "id": "18"
      },
      {
        "command": "stress",
        "desc": "Stress test for the serverless application",
        "id": "19"
      },
      {
        "command": "fun2s",
        "desc": "Convert the Yaml specification of Funcraft to Serverless Devs",
        "id": "20"
      },
      {
        "command": "instance",
        "desc": "Instance login and operation [beta]",
        "id": "21"
      },
      {
        "command": "api",
        "desc": "API call directly [beta]",
        "id": "22"
      }
    ],
    shortcuts: _shortcuts = [
      {
        id: uniqueId(),
        command: "deploy",
      },
      {
        id: uniqueId(),
        command: "build",
      },
      {
        id: uniqueId(),
        command: "invoke",
      },
    ]
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
          return <img src='https://img.alicdn.com/imgextra/i3/O1CN01BtNlJq1w6DLASrvHV_!!6000000006258-55-tps-16-16.svg' />
        }
        if (record.command === 'build') {
          return <img src='https://img.alicdn.com/imgextra/i1/O1CN01VUgjJx1kEfG9jD4vn_!!6000000004652-2-tps-16-16.png' />
        }
        if (record.command === 'invoke') {
          return <img src='https://img.alicdn.com/imgextra/i4/O1CN01Tno0SH1oJ1UTq1PWB_!!6000000005203-55-tps-16-16.svg' />
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
        <img onClick={() => handleOperate(record)} className='cursor-pointer' src='https://img.alicdn.com/imgextra/i4/O1CN01Tno0SH1oJ1UTq1PWB_!!6000000005203-55-tps-16-16.svg' />
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
