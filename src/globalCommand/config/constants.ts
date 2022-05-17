export const providers = [
  {
    label: "Alibaba Cloud (alibaba)",
    value: "alibaba",
  },
  {
    label: "AWS (aws)",
    value: "aws",
  },
  {
    label: "Azure (azure)",
    value: "azure",
  },
  {
    label: "Baidu Cloud (baidu)",
    value: "baidu",
  },
  {
    label: "Google Cloud (google)",
    value: "google",
  },
  {
    label: "Huawei Cloud (huawei)",
    value: "huawei",
  },
  {
    label: "Tencent Cloud (tencent)",
    value: "tencent",
  },
  {
    label: "Custom (others)",
    value: "custom",
  },
];

export const providerCollection = {
  alibaba: ["AccessKeyID", "AccessKeySecret"],
  aws: ["AccessKeyID", "SecretAccessKey"],
  huawei: ["AccessKeyID", "SecretAccessKey"],
  azure: ["KeyVaultName", "TenantID", "ClentID", "ClientSecret"],
  baidu: ["AccessKeyID", "SecretAccessKey"],
  google: ["PrivateKeyData"],
  tencent: ["AccountID", "SecretID", "SecretKey"],
};
