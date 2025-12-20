/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import { Button, ButtonProps, Tooltip } from "antd";

import React, { forwardRef, useCallback, useMemo, useState } from "react";
import { useTranslationLib } from "../../locale";
import { useNavigateOptional } from "src/hooks/NavigatorHooks";

export interface ButtonComponentProps extends ButtonProps {
  to?: string | number;
  tooltip?: string | undefined;
}

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  ({ className, to, onClick, tooltip, ...props }, ref) => {
    const { t } = useTranslationLib();

    const navigate = useNavigateOptional();

    const btn = useMemo(
      () => (
        <Button
          ref={ref}
          onClick={
            onClick ?? (to && navigate ? () => navigate(to as any) : undefined)
          }
          className={className}
          {...props}
        >
          {props.children}
        </Button>
      ),
      [className, navigate, onClick, props, t, to]
    );

    return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
  }
);

const Async = forwardRef<HTMLButtonElement, ButtonComponentProps>(
  ({ className, to, onClick, tooltip, ...props }, ref) => {
    const navigate = useNavigateOptional();

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
          ref={ref}
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
      [_onClick, className, loading, navigate, onClick, props, to, ref]
    );
    return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
  }
);

Async.displayName = "ButtonComponent.Async";

type ComponentType = React.ForwardRefExoticComponent<
  ButtonComponentProps & React.RefAttributes<HTMLElement>
> & {
  Async: React.ForwardRefExoticComponent<
    ButtonComponentProps & React.RefAttributes<HTMLElement>
  >;
};

(ButtonComponent as ComponentType as any).Async = Async;
export default ButtonComponent as ComponentType;
