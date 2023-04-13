import { FC, useState } from 'react';
import { vscode, sleep, alert } from '@/utils';
import { Button, Table } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import { map, set, startsWith } from 'lodash';
import CredentialUi from '@serverless-cd/credential-ui';
import Header from '@/components/header';
import i18n from '@/i18n';

type Props = {
  credentialList: { Alias: string;[prop: string]: any }[];
};

const CredentialList: FC<Props> = (props) => {
  const { credentialList } = props;
  const newCredentialList = map(credentialList, (item) => {
    const { Alias, ...rest } = item;
    for (const key in rest) {
      const val = rest[key];
      set(
        item,
        `$${key}`,
        val.length > 6
          ? val.slice(0, 3) + '*'.repeat(val.length - 6) + val.slice(val.length - 3)
          : val,
      );
    }
    return {
      ...item,
      $show: false,
    };
  });
  const [data, setData] = useState(newCredentialList);

  const handleDelete = (value: string) => {
    alert({
      title: i18n('webview.credential_list.delete_key', { value }),
      content: i18n('webview.credential_list.delete_key_tips'),
      onOk: async () => {
        vscode.postMessage({
          command: 'deleteCredential',
          data: value,
        });
        await sleep();
      },
    });
  };
  const handleShow = (record) => {
    const newData = map(data, (item) => {
      if (record.Alias === item.Alias) {
        return {
          ...item,
          $show: !record.$show,
        };
      }
      return item;
    });
    setData(newData as any);
  };

  const handleAdd = async (data: Record<string, any>) => {
    vscode.postMessage({
      command: 'addCredential',
      data,
    });
    await sleep();
  }

  const handleOpenDocument = (data: Record<string, any>) => {
    vscode.postMessage({
      command: 'openAccessUrl',
      data,
    });
  }

  const columns = [
    {
      key: 'Alias',
      title: i18n('webview.common.alias'),
      dataIndex: 'Alias',
    },
    {
      title: i18n('webview.credential_list.key_info'),
      cell: (value, _index, record) => {
        return map(record, (v, k) => {
          if (k === 'Alias' || startsWith(k, '$')) return;
          return (
            <div key={k}>
              {k}: <span className="ml-4">{record.$show ? v : record[`$${k}`]}</span>
            </div>
          );
        });
      },
    },
    {
      title: i18n('webview.common.operation'),
      cell: (value, _index, record) => (
        // @ts-ignore
        <Actions>
          <LinkButton onClick={() => handleShow(record)}>
            {record.$show ? i18n('webview.common.hide') : i18n('webview.common.show')}
          </LinkButton>
          <LinkButton
            type="primary"
            text
            onClick={() => handleDelete(record.Alias)}
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
      <Header title={i18n('webview.credential_list.key_management')} subtitle={i18n('webview.credential_list.management_of_local_key_information')} />
      <CredentialUi existAlias={map(data, (item) => item.Alias)} onConfirm={handleAdd} onOpenDocument={handleOpenDocument}>
        <Button type="primary">{i18n('webview.credential_list.add_key')}</Button>
      </CredentialUi>
      <Table className="mt-16" dataSource={data} columns={columns} emptyContent={i18n('webview.common.no_data')} />
    </>
  );
};

export default CredentialList;
