/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import { Button, ButtonProps, Tooltip } from "antd";

import React, { useCallback, useMemo, useState } from "react";
import { useTranslationLib } from "../../locale";
import "./style.css";
import { useNavigate } from "react-router-dom";

export interface ButtonComponentProps extends ButtonProps {
  to?: string | number;
  tooltip?: string | undefined;
  ref?: any;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({
  className,
  to,
  onClick,
  tooltip,
  ref,
  ...props
}) => {
  const { t } = useTranslationLib();

  let navigate;
  try {
    navigate = useNavigate?.();
  } catch (error) {
    console.error(error);
  }

  const btn = useMemo(
    () => (
      <Button
        onClick={
          onClick
            ? onClick
            : to && navigate
            ? () => navigate(to as any)
            : undefined
        }
        className={className}
        {...props}
      >{props.children}</Button>
    ),
    [className, navigate, onClick, props, t, to]
  );

  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
};

const Async: React.FC<ButtonComponentProps> = ({
  className,
  to,
  onClick,
  tooltip,
  ref,
  ...props
}) => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (error) {
    console.error(error);
  }

  const [loading, setLoading] = useState(false);
  const _onClick = useCallback(
    async (e) => {
      try {
        setLoading(true);
        return await (onClick as any)(e);
      } finally {
        setLoading(false);
      }
    },
    [onClick]
  );
  const btn = useMemo(
    () => (
      <Button
        loading={loading || props.loading}
        onClick={
          onClick
            ? _onClick
            : to
            ? () => {
                if (navigate) {
                  navigate?.(to as any);
                } else {
                  window.location.href = to as any;
                }
              }
            : undefined
        }
        className={className}
        {...props}
      />
    ),
    [_onClick, className, loading, navigate, onClick, props, to]
  );
  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
};

type ComponentType = React.FC<ButtonComponentProps> & {
  Async: React.FC<ButtonComponentProps>;
};

(ButtonComponent as ComponentType).Async = Async;
export default ButtonComponent as ComponentType;
