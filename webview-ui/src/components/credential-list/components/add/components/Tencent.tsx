import { FC } from 'react';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_LAYOUT } from '@/constants';
const FormItem = Form.Item;

type Props = {
  field: Field;
};

const Azure: FC<Props> = (props) => {
  const { field } = props;
  const { init } = field;
  return (
    <>
      <FormItem label="AccountID" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入AccountID"
          className="full-width"
          {...init('AccountID', {
            rules: [
              {
                required: true,
                message: 'AccountID不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="SecretID" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入SecretID"
          className="full-width"
          {...init('SecretID', {
            rules: [
              {
                required: true,
                message: 'SecretID不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="SecretKey" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入SecretKey"
          className="full-width"
          {...init('SecretKey', {
            rules: [
              {
                required: true,
                message: 'SecretKey不能为空',
              },
            ],
          })}
        />
      </FormItem>
    </>
  );
};

export default Azure;
