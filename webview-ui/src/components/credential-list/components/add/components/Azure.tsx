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
      <FormItem label="KeyVaultName" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入KeyVaultName"
          className="full-width"
          {...init('KeyVaultName', {
            rules: [
              {
                required: true,
                message: 'KeyVaultName不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="TenantID" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入TenantID"
          className="full-width"
          {...init('TenantID', {
            rules: [
              {
                required: true,
                message: 'TenantID不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="ClentID" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入ClentID"
          className="full-width"
          {...init('ClentID', {
            rules: [
              {
                required: true,
                message: 'ClentID不能为空',
              },
            ],
          })}
        />
      </FormItem>
      <FormItem label="ClientSecret" required {...FORM_LAYOUT}>
        <Input
          placeholder="请输入ClientSecret"
          className="full-width"
          {...init('ClientSecret', {
            rules: [
              {
                required: true,
                message: 'ClientSecret不能为空',
              },
            ],
          })}
        />
      </FormItem>
    </>
  );
};

export default Azure;
