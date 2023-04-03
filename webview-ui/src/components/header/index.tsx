import { FC } from 'react';

type Props = {
  title: string;
  subtitle?: string;
  className?: string;
  size?: 'small' | 'medium';
  extra?: React.ReactNode;
};

const Header: FC<Props> = (props) => {
  const { title, subtitle, className, size = 'medium', extra } = props;
  return (
    <div className={`align-center mb-16 mt-16 ${className || ''}`}>
      {size === 'small' && <div className="text-bold fz-16">{title}</div>}
      {size === 'medium' && <div className="text-bold fz-20">{title}</div>}
      {subtitle && <span className="ml-8 color-gray">{subtitle}</span>}
      {extra && <div className="ml-8">{extra}</div>}
    </div>
  );
};

export default Header;
