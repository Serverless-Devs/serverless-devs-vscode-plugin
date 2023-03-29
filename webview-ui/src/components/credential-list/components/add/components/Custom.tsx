import { FC, useState } from 'react';
import { uniqueId, concat, map, filter, noop, isEmpty, set } from 'lodash';
import { Grid, Button, Icon, Input } from '@alicloud/console-components';

const { Row, Col } = Grid;

type IItem = {
  id: string;
  key?: string;
  value?: string;
};

type Props = {
  value?: IItem[];
  onChange?: (value: IItem[]) => void;
  keyText?: string;
  valueText?: string;
};

export const customFormat = (value: IItem[]) => {
  if (isEmpty(value)) return;
  const obj = {};
  for (const item of value) {
    set(obj, item.key as string, item.value);
  }
  return obj;
};

export const customValidate = (rule, value, callback) => {
  const newData = filter(value, (item) => item.key && item.value);
  if (newData.length === 0) {
    return callback('请至少填写一条完整的数据');
  }
  callback();
};

const KeyValue: FC<Props> = (props) => {
  const { value, onChange = noop, keyText = 'Key', valueText = 'Value' } = props;
  const defaultValue = isEmpty(value)
    ? [{ id: uniqueId() }]
    : map(value, (item) => ({ ...item, id: uniqueId() }));
  const [list, setList] = useState<IItem[]>(defaultValue);

  const handleAdd = () => {
    const option = concat(list, { id: uniqueId() });
    setList(option);
    onChange(option);
  };

  const handleDelete = (id: string) => {
    const option = filter(list, (item) => item.id !== id);
    setList(option);
    onChange(option);
  };

  const handleChangeKey = (key: string, id: string) => {
    const option = map(list, (item) => (item.id === id ? { ...item, key } : item));
    setList(option);
    onChange(option);
  };

  const handleChangeValue = (value: string, id: string) => {
    const option = map(list, (item) => (item.id === id ? { ...item, value } : item));
    setList(option);
    onChange(option);
  };

  return (
    <>
      {map(list, (item) => {
        return (
          <Row
            key={item.id}
            style={{
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Col span="12" className="pr-16">
              <Input
                addonTextBefore={keyText}
                style={{ width: '100%' }}
                value={item.key}
                onChange={(key) => handleChangeKey(key, item.id)}
              />
            </Col>
            <Col span="12" className="pl-16" style={{ position: 'relative' }}>
              <Input
                addonTextBefore={valueText}
                style={{ width: '100%' }}
                value={item.value}
                onChange={(value) => handleChangeValue(value, item.id)}
              />
              {list.length > 1 && (
                <Icon
                  style={{ cursor: 'pointer', position: 'absolute', right: -20, top: 6 }}
                  size="xs"
                  type="ashbin"
                  onClick={() => handleDelete(item.id)}
                />
              )}
            </Col>
          </Row>
        );
      })}
      <Button onClick={handleAdd}>+添加条目</Button>
    </>
  );
};

export default KeyValue;
