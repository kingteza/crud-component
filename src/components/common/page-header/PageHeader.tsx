/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { ArrowLeftOutlined, LeftOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useHtmlHeader } from 'context/HtmlHeaderContext';
import React, { FC, PropsWithChildren, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router';

import ButtonComponent from '../button/Button';

interface PageHeaderComponentProps {
  title?: string;
  onBack?: () => void;
  backUrl?: string;
  className?: string;
  updateHtmlTitle?: boolean;
  hideBackButton?: boolean;
}
const PageHeaderComponent: FC<PropsWithChildren<PageHeaderComponentProps>> = ({
  title = '',
  onBack,
  backUrl = '..',
  className = ' mb-3',
  children,
  updateHtmlTitle = true,
  hideBackButton,
}) => {
  const navigate = useNavigate();

  const onClickGoBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    } else if (backUrl) {
      navigate(backUrl);
    }
  }, [backUrl, navigate, onBack]);

  const header = useHtmlHeader();

  useEffect(() => {
    if (updateHtmlTitle) {
      if (typeof title === 'string') header?.updatePageTitle(title);
    }
  }, [header, title, updateHtmlTitle]);

  // return <PageHeader className={className as any} onBack={onClickGoBack} backIcon={<LeftCircleTwoTone />} title={<Typography>{title}</Typography>} />;
  return (
    <div className={className + ' d-flex w-100'} style={{ textAlignLast: 'left' }}>
      <div className="d-flex">
        {!hideBackButton && onClickGoBack && (
          <ButtonComponent
            className="mr-2"
            type="text"
            onClick={onClickGoBack}
            icon={<ArrowLeftOutlined></ArrowLeftOutlined>}
          />
        )}
        {title && (
          <Typography.Title style={{ paddingTop: 0.5, paddingBottom: 0 }} className='my-0' level={5}>
            {title}
          </Typography.Title>
        )}
      </div>
      {children}
    </div>
  );
};

export default PageHeaderComponent;
