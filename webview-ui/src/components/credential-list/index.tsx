import { FC, useState } from 'react';
import { vscode, sleep } from '@/utils';
import { Button, Table, Dialog } from '@alicloud/console-components';
import Actions, { LinkButton } from '@alicloud/console-components-actions';
import { map, set, startsWith } from 'lodash';
import Add from './components/add';

type Props = {
  credentialList: { Alias: string; [prop: string]: any }[];
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
    Dialog.alert({
      title: `删除密钥：${value}`,
      content: '您确定删除当前密钥吗?',
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

  const columns = [
    {
      key: 'Alias',
      title: 'Alias',
      dataIndex: 'Alias',
    },
    {
      title: '密钥详情',
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
      title: '操作',
      cell: (value, _index, record) => (
        // @ts-ignore
        <Actions>
          <LinkButton onClick={() => handleShow(record)}>
            {record.$show ? '隐藏' : '显示'}
          </LinkButton>
          <LinkButton
            type="primary"
            text
            onClick={() => handleDelete(record.Alias)}
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
      <Add existAlias={map(data, (item) => item.Alias)}>
        <Button type="primary">添加密钥</Button>
      </Add>
      <Table className="mt-16" dataSource={data} columns={columns} />
    </>
  );
};

export default CredentialList;
