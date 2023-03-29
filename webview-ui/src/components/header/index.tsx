import { FC } from 'react';

type Props = {
  title: string;
  subtitle?: string;
};

const Header: FC<Props> = (props) => {
  const { title, subtitle } = props;
  return (
    <div className="align-center mb-16">
      <div className="text-bold fz-20">{title}</div>
      {subtitle && <span className="ml-8 color-gray">{subtitle}</span>}
    </div>
  );
};

export default Header;
