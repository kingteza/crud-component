import { Space } from 'antd';
import { FC, PropsWithChildren } from 'react';

const VerticalSpace: FC<PropsWithChildren & {className?: string}> = ({ children, className = '' }) => {
  return (
    <Space direction="vertical" className={[className, "w-100"].join(' ')}>
      {children}
    </Space>
  );
};

export default VerticalSpace;
