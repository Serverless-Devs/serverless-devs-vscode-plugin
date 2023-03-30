import { FC, useState } from 'react';
import { vscode, sleep } from '@/utils';
import { Button, Table, Dialog } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import Header from '@/components/header';

type IItem = { Component: string; Version: string; Size: string; Description: string };

type Props = {
  componentList: IItem[];
};

const ComponentList: FC<Props> = (props) => {
  const { componentList } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleDelete = (value: string) => {
    Dialog.alert({
      title: `删除组件：${value}`,
      content: '您确定要删除当前组件吗?',
      onOk: async () => {
        vscode.postMessage({
          command: 'deleteComponent',
          data: [value],
        });
        await sleep();
      },
    });
  };

  const handleBatchDelete = () => {
    Dialog.alert({
      title: `批量删除组件`,
      content: (
        <div style={{ lineHeight: '18px' }}>
          您确定对这些组件
          <span className="color-error ml-4 mr-4">{selectedRowKeys.join(', ')}</span>
          进行删除吗?
        </div>
      ),
      onOk: async () => {
        vscode.postMessage({
          command: 'deleteComponent',
          data: selectedRowKeys,
        });
        await sleep();
      },
    });
  };

  const columns = [
    {
      key: 'Component',
      title: 'Component',
      dataIndex: 'Component',
    },
    {
      key: 'Version',
      title: 'Version',
      dataIndex: 'Version',
    },
    {
      key: 'Size',
      title: 'Size',
      dataIndex: 'Size',
    },
    {
      key: 'Description',
      title: 'Description',
      dataIndex: 'Description',
    },
    {
      title: '操作',
      cell: (value, _index, record) => (
        // @ts-ignore
        <Actions>
          <LinkButton
            type="primary"
            text
            onClick={() => handleDelete(record.Component)}
            loading={record.loading}
          >
            删除
          </LinkButton>
        </Actions>
      ),
    },
  ];

  return (
    <>
      <Header title="组件管理" subtitle="工具已安装组件管理" />
      <Button disabled={selectedRowKeys.length === 0} type="primary" onClick={handleBatchDelete}>
        批量删除
      </Button>
      <Table
        rowSelection={{
          onChange(selectedRowKeys) {
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        className="mt-16"
        primaryKey="Component"
        dataSource={componentList}
        columns={columns}
      />
    </>
  );
};

export default ComponentList;
