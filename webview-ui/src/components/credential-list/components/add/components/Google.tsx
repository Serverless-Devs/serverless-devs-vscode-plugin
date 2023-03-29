import { FC } from 'react';
import { Form, Field, Input } from '@alicloud/console-components';
import { FORM_LAYOUT } from '@/constants';
const FormItem = Form.Item;

type Props = {
  field: Field;
};

const Google: FC<Props> = (props) => {
  const { field } = props;
  const { init } = field;
  return (
    <>
      <FormItem label="PrivateKeyData" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入PrivateKeyData"
          className="full-width"
          {...init('PrivateKeyData', {
            rules: [
              {
                required: true,
                message: 'PrivateKeyData不能为空',
              },
            ],
          })}
        />
      </FormItem>
    </>
  );
};

export default Google;
