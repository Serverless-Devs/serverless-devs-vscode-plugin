import { FC, useState } from 'react';
import { vscode, sleep, alert } from '@/utils';
import { Button, Table } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import Header from '@/components/header';
import i18n from '@/i18n';

type IItem = { Component: string; Version: string; Size: string; Description: string };

type Props = {
  componentList: IItem[];
};

const ComponentList: FC<Props> = (props) => {
  const { componentList } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const handleDelete = (value: string) => {
    alert({
      title: i18n('webview.component_list.delete_component', { value }),
      content: i18n('webview.component_list.delete_component_tips'),
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
    alert({
      title: i18n('webview.component_list.batch_delete_component'),
      content: (
        <div style={{ lineHeight: '18px' }} dangerouslySetInnerHTML={{ __html: i18n('webview.component_list.batch_delete_tips', { selectedRowKeys }) }} />
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
      title: i18n('webview.common.operation'),
      cell: (value, _index, record) => (
        // @ts-ignore
        <Actions>
          <LinkButton
            type="primary"
            text
            onClick={() => handleDelete(record.Component)}
            loading={record.loading}
          >
            {i18n('webview.common.delete')}
          </LinkButton>
        </Actions>
      ),
    },
  ];

  return (
    <>
      <Header title={i18n('webview.component_list.component_management')} subtitle={i18n('webview.component_list.tools_installed_components_management')} />
      <Button disabled={selectedRowKeys.length === 0} type="primary" onClick={handleBatchDelete}>
        {i18n('webview.common.batch_delete')}
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
        emptyContent={i18n('webview.common.no_data')}
      />
    </>
  );
};

export default ComponentList;
