/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Steps } from 'antd';
import { StepsProps } from 'antd/lib';
import React, {
  FC,
  forwardRef,
  ReactElement,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

import Hider from '../appearance/Hider';

interface WizardViewFormProps {
  pages: {
    hidden?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    title: string;
    component: (
      func: {
        forward: (value?: any, submit?: boolean, isRetry?: boolean) => void;
        backward: () => void;
      },
      formSubmissionData: any[],
      isActive: boolean,
    ) => ReactElement;
  }[];
  labelPlacement?: 'vertical' | 'horizontal';
  initPosition?: number;
  onSubmit?: (val: (any | undefined)[], combinedValue: any) => void;
  type?: StepsProps['type'];
  className?: string;
  pageStyle?: React.CSSProperties;
  showSteps?: boolean;
  freeNavigation?: boolean;
}


export interface WizardViewFormRef {
  gotTo: (index: number) => void;
}

const WizardViewForm = forwardRef<WizardViewFormRef, WizardViewFormProps>(
  (
    {
      pages,
      onSubmit,
      initPosition = 0,
      type,
      labelPlacement,
      className,
      pageStyle,
      showSteps = true,
      freeNavigation,
    },
    ref,
  ) => {
    const [current, setCurrent] = useState(0);

    const [formSubmissions, setFormSubmissions] = useState<(any | undefined)[]>([]);

    useEffect(() => {
      setCurrent(initPosition);
    }, [initPosition]);

    useImperativeHandle(
      ref,
      () => ({
        gotTo: (index: number) => setCurrent(index),
      }),
      [],
    );

    const forward = useCallback(
      (value?: any, submit: boolean = false, isRetry: boolean = false) => {
        const newS = [...formSubmissions];
        if (value !== undefined) {
          newS[current] = value;
          setFormSubmissions(newS);
        }
        if (!isRetry) setCurrent(current + 1);
        if (submit && onSubmit) {
          let value = {} as any;
          for (const values of newS) {
            for (const key in values) {
              value[key] = values[key];
            }
          }
          onSubmit(newS, value);
        }
      },
      [current, formSubmissions, onSubmit],
    );

    const backward = useCallback(() => {
      const newS = [...formSubmissions];
      newS[current] = undefined;
      setFormSubmissions(newS);
      setCurrent(current - 1);
    }, [current, formSubmissions]);

    const components = useMemo(() => {
      let steps: StepsProps['items'] = [];
      let _pages: ReactElement[] = [];
      const list = pages.filter((e) => !e.hidden);
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        _pages.push(
          <Hider hide={current !== i} key={`${p.title}${i}`}>
            {p.component({ forward, backward }, formSubmissions, current === i)}
          </Hider>,
        );
        steps.push({
          icon: p.icon,
          title: p.title,
          disabled: p.disabled,
        })
      }
      return {
        _pages,
        steps,
      };
    }, [backward, current, formSubmissions, forward, pages]);

    const onChange = useCallback((current: number) => {
      setCurrent(current);
    }, []);
    return (
      <>
        {showSteps && (
          <Steps
            labelPlacement={labelPlacement}
            titlePlacement={labelPlacement}
            className={[className, 'pb-3'].join(' ')}
            current={current}
            type={type}
            items={components.steps}
            onChange={freeNavigation ? onChange : undefined}
          >
          </Steps>
        )}
        <div style={pageStyle}>{components._pages}</div>
      </>
    );
  },
);

export default WizardViewForm;
