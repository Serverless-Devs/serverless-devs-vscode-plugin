import { FC } from 'react';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_LAYOUT } from '@/constants';
const FormItem = Form.Item;

type Props = {
  field: Field;
};

const Aws: FC<Props> = (props) => {
  const { field } = props;
  const { init } = field;
  return (
    <>
      <FormItem label="AccessKeyID" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入AccessKeyID"
          className="full-width"
          {...init('AccessKeyID', {
            rules: [
              {
                required: true,
                message: 'AccessKeyID不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="SecretAccessKey" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入SecretAccessKey"
          className="full-width"
          {...init('SecretAccessKey', {
            rules: [
              {
                required: true,
                message: 'SecretAccessKey不能为空',
              },
            ],
          })}
        />
      </FormItem>
    </>
  );
};

export default Aws;