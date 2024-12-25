/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { MinusOutlined, PlusOutlined, ZoomInOutlined } from '@ant-design/icons';
import { useLocalStorage } from '@uidotdev/usehooks';
import { Col, Popconfirm, Row, Slider, Space } from 'antd';
import { translations } from 'config/localization/translations';
import React from 'react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ButtonComponent from '../button/Button';

export const ZoomSlider: FC<{ zoomKey: string; className?: string }> = ({
  zoomKey,
  className,
}) => {
  const { t } = useTranslation();

  const [zoom, setZoom] = useLocalStorage(`${zoomKey}_zoom`, 1);
  const [initValue, setInitValue] = useState<number>(1);

  const onChange = useCallback(
    async (value: number) => {
      setZoom(value);
    },
    [setZoom],
  );

  const [open, setOpen] = useState(false);
  return (
    <>
      <Popconfirm
        title={t(translations.str.adjustSize)}
        onCancel={() => {
          setZoom(initValue);
          setOpen(false);
        }}
        onConfirm={() => {
          setOpen(false);
          setInitValue(zoom);
        }}
        open={open}
        okText={t(translations.str.save)}
        cancelText={t(translations.str.cancel)}
        description={
          <Row>
            <Col>
              <ButtonComponent
                icon={<MinusOutlined />}
                type='text'
                onClick={() => onChange(zoom - 0.01)}
              />
            </Col>
            <Col>
              <Slider
                step={0.001}
                marks={{
                  1: t(translations.str.default),
                }}
                tooltip={{
                  open: false,
                }}
                onChange={onChange}
                value={zoom}
                min={0}
                max={2}
                style={{
                  width: 300,
                }}
              />
            </Col>
            <Col>
              <ButtonComponent
                icon={<PlusOutlined />}
                type='text'
                onClick={() => onChange(zoom + 0.01)}
              />
            </Col>
          </Row>
        }
      >
        <ButtonComponent
          type="dashed"
          className={className}
          icon={<ZoomInOutlined />}
          onClick={() => {
            setOpen(true);
            setInitValue(zoom);
          }}
        />
      </Popconfirm>
    </>
  );
};
