type Align = 'right' | 'left' | undefined;

export const FORM_LAYOUT = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: {
    span: 18,
  },
  labelTextAlign: 'left' as Align,
};

export enum PROVIDER {
  alibaba = 'alibaba',
  aws = 'aws',
  azure = 'azure',
  baidu = 'baidu',
  google = 'google',
  huawei = 'huawei',
  tencent = 'tencent',
  custom = 'custom',
}

export const PROVIDER_LIST = [
  {
    label: 'Alibaba Cloud (alibaba)',
    value: PROVIDER.alibaba,
    doc: 'http://config.devsapp.net/account/alibaba',
  },
  { label: 'AWS (aws)', value: PROVIDER.aws, doc: 'http://config.devsapp.net/account/aws' },
  { label: 'Azure (azure)', value: PROVIDER.azure, doc: 'http://config.devsapp.net/account/azure' },
  {
    label: 'Baidu Cloud (baidu)',
    value: PROVIDER.baidu,
    doc: 'http://config.devsapp.net/account/baidu',
  },
  {
    label: 'Google Cloud (google)',
    value: PROVIDER.google,
    doc: 'http://config.devsapp.net/account/gcp',
  },
  {
    label: 'Huawei Cloud (huawei)',
    value: PROVIDER.huawei,
    doc: 'http://config.devsapp.net/account/huawei',
  },
  {
    label: 'Tencent Cloud (tencent)',
    value: PROVIDER.tencent,
    doc: 'http://config.devsapp.net/account/tencent',
  },
  { label: 'Custom (others)', value: PROVIDER.custom },
];

export type IEventData = { data: { eventId: string; data: any } };

export enum LANG {
  en = 'en',
  zh = 'zh',
}
// eslint-disable-next-line 
export const RANDOM_PATTERN = '${default-suffix}';

export enum CreateAppType {
  template = 'template',
  registry = 'registry',
}

export const ICONS = {
  DEPLOY: 'https://img.alicdn.com/imgextra/i3/O1CN01BtNlJq1w6DLASrvHV_!!6000000006258-55-tps-16-16.svg',
  BUILD: 'https://img.alicdn.com/imgextra/i1/O1CN01VUgjJx1kEfG9jD4vn_!!6000000004652-2-tps-16-16.png',
  INVOKE: 'https://img.alicdn.com/imgextra/i4/O1CN01Tno0SH1oJ1UTq1PWB_!!6000000005203-55-tps-16-16.svg'
}

export const DEFAULT_REGISTRY = "http://registry.devsapp.cn/simple"
