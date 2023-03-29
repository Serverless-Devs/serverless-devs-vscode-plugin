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
  const {
    componentList = [
      {
        Component: 'devsapp/domain',
        Version: '0.0.38',
        Size: '1.92 MB',
        Description: '下发Serverless Devs默认域名',
      },
      {
        Component: 'devsapp/fc',
        Version: '0.1.68',
        Size: '1.56 MB',
        Description: 'Basic components of Alibaba cloud functional computing',
      },
      {
        Component: 'devsapp/fc-core',
        Version: '0.0.26',
        Size: '2.10 MB',
        Description: 'FC公共组件',
      },
      {
        Component: 'devsapp/fc-default',
        Version: '0.0.25',
        Size: '0.07 MB',
        Description: 'Alibaba Cloud switches FC default mode components',
      },
      {
        Component: 'devsapp/fc-deploy',
        Version: '0.0.114',
        Size: '7.02 MB',
        Description: '阿里云函数计算基础组件',
      },
      {
        Component: 'devsapp/fc-info',
        Version: '0.0.40',
        Size: '0.09 MB',
        Description: '阿里云函数计算基础组件',
      },
      {
        Component: 'devsapp/fc-metrics',
        Version: '0.1.9',
        Size: '59.93 MB',
        Description: '函数计算Metrics组件',
      },
      {
        Component: 'devsapp/fc-plan',
        Version: '0.0.46',
        Size: '0.07 MB',
        Description: '初始化component模板',
      },
      {
        Component: 'devsapp/fc-remote-invoke',
        Version: '0.0.33',
        Size: '0.12 MB',
        Description: '初始化component模板',
      },
      {
        Component: 'devsapp/fc@dev',
        Version: 'dev',
        Size: '1.53 MB',
        Description: 'Basic components of Alibaba cloud functional computing',
      },
      {
        Component: 'devsapp/nas',
        Version: '0.1.12',
        Size: '1.32 MB',
        Description: '阿里云NAS产品工具',
      },
      {
        Component: 'devsapp/oss',
        Version: '0.0.28',
        Size: '2.48 MB',
        Description: '阿里云OSS组件',
      },
      {
        Component: 'devsapp/ram',
        Version: '0.0.20',
        Size: '0.26 MB',
        Description: '阿里云RAM产品工具',
      },
      {
        Component: 'devsapp/sls',
        Version: '0.0.24',
        Size: '2.02 MB',
        Description: '阿里云SLS产品工具',
      },
      {
        Component: 'fc-api-component',
        Version: '0.0.13',
        Size: '17.56 MB',
        Description: 'fc api子组件',
      },
      {
        Component: 'registry',
        Version: '0.0.11',
        Size: '1.24 MB',
        Description: 'Serverless Registry Component',
      },
    ],
  } = props;
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
