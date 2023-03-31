import { FC, useState, useEffect } from 'react';
import { vscode, sleep } from '@/utils';
import { Tab, Loading, Search } from '@alicloud/console-components';
import Header from '@/components/header';
import Empty from '@/components/empty';
import Params from './components/params';
import AppCard from '@serverless-cd/app-card-ui';
import { getApps, getTabs } from '@/services/app';
import { map, sortBy, filter, includes, first, get, isEmpty, find } from 'lodash';
import styled from 'styled-components';
import { CreateAppType } from '@/constants';

type Props = {
  downloadPath: string;
  aliasList: string[];
  step?: number;
  appName?: string;
  type?: `${CreateAppType}`;
};

const CreateApp: FC<Props> = (props) => {
  const {
    downloadPath = '/Users/shihuali',
    aliasList = ['default', 'dankun', 'sub', 'z-fc-console', 'test'],
    step: stepProps = 0,
    type = CreateAppType.registry,
    appName,
  } = props;
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [applist, setApplist] = useState<any>([]);
  const [searchValue, setSearchValue] = useState('');
  const [step, setStep] = useState(stepProps); // 0 选择模版 1 配置参数
  const [appInfo, setAppInfo] = useState<any>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    let [tabs, apps] = await Promise.all([getTabs(), getApps()]);
    tabs = map(tabs, (tab) => ({
      key: tab.id,
      name: tab.name,
      items: sortBy(
        filter(apps, (app) => includes(app.tabs, tab.id)),
        'x-range',
      ),
    }));
    const one = tabs.shift();
    if (one) {
      tabs = [one, { key: 'all', name: '所有模版', items: apps }, ...tabs];
    } else {
      tabs = [{ key: 'all', name: '所有模版', items: apps }, ...tabs];
    }
    const fistTab = first(tabs);
    setTemplates(tabs);
    setActiveTab(get(fistTab, 'key', ''));
    setApplist(get(fistTab, 'items'));
    setLoading(false);
  };

  const handleTabChange = (activeTab) => {
    const tmp = find(templates, (tab: any) => String(tab.key) === String(activeTab));
    if (isEmpty(searchValue)) {
      setActiveTab(activeTab);
      setApplist(get(tmp, 'items', []));
      return;
    }
    const newData = filter(tmp.items, (item) => {
      const title = get(item, 'title', '');
      return includes(title.toLowerCase(), searchValue.toLowerCase());
    });
    setActiveTab(activeTab);
    setApplist(newData);
  };

  const handleSearch = (value) => {
    const tmp = find(templates, (tab: any) => String(tab.key) === String(activeTab));
    if (isEmpty(value)) {
      setSearchValue(value);
      setApplist(tmp.items);
      return;
    }
    const newData = filter(tmp.items, (item) => {
      const title = get(item, 'title', '');
      return includes(title.toLowerCase(), value.toLowerCase());
    });
    setSearchValue(value);
    setApplist(newData);
  };
  const onCreate = async (item) => {
    setAppInfo(item);
    setStep(1);
  };

  const renderAppList = () => (
    <Loading inline={false} visible={loading} style={{ minHeight: 500 }}>
      <Search
        style={{ width: '50%' }}
        className="mb-16"
        placeholder="通过关键词快速搜索应用"
        hasClear
        value={searchValue}
        onSearch={handleSearch}
        onChange={handleSearch}
      />
      <Tab
        shape="capsule"
        className="applications-template-tab"
        activeKey={activeTab}
        onChange={handleTabChange}
      >
        {map(templates, (template: any) => (
          <Tab.Item
            title={
              template.key === 'all' ? template.name : `${template.name} ${template.items.length}`
            }
            key={template.key}
          >
            {isEmpty(applist) ? (
              <Empty />
            ) : (
              <Wrapper>
                {map(applist, (item: any) => (
                  <AppCard
                    key={item.package}
                    dataSouce={item}
                    column={3}
                    onCreate={onCreate}
                    env="vscode"
                  />
                ))}
              </Wrapper>
            )}
          </Tab.Item>
        ))}
      </Tab>
    </Loading>
  );
  return (
    <>
      <Header
        title="创建应用"
        subtitle={
          type === CreateAppType.registry ? '通过registry创建新的应用' : '通过模版创建新的应用'
        }
      />
      {step === 0 && renderAppList()}
      {step === 1 && (
        <Params
          onBack={() => setStep(0)}
          aliasList={aliasList}
          downloadPath={downloadPath}
          appName={get(appInfo, 'package', appName)}
          type={type}
        />
      )}
    </>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 -8px;
`;

export default CreateApp;
