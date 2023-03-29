import SlidePanel from '@alicloud/console-components-slide-panel';

const MySlidePanel = (props) => {
  return (
    <SlidePanel width="large" okText="确定" cancelText="取消" processingText="处理中" {...props} />
  );
};

export default MySlidePanel;
