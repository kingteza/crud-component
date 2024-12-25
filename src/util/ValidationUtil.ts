/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Rule } from 'antd/lib/form'; 
import { t } from 'i18next';
import NumberUtil from './NumberUtil';


const required = (modelName: string) => {
  return [
    {
      required: true,
      message: `${modelName} ${t('err.validation.required')}`,
    },
  ];
};

const passwordValidation = (): Rule[] => {
  return [
    {
      min: 8,
      message: t('err.validation.minLength8'),
    },
  ];
};

const percentageValidation = (): Rule[] => {
  return [
    {
      type: 'number',
      validator(rule, value, callback) {
        const val = Number(value);
        if (isNaN(val) && value) {
          callback(t('err.validation.percentage'));
        } else if (val < 0 || val > 100) {
          callback(t('err.validation.percentage'));
        } else {
          callback();
        }
      },
      message: t('err.validation.percentage'),
    },
  ];
};

const maxValidation = (max: number): Rule[] => {
  return [
    {
      max: Number(max),
      min: 0,
      type: 'number',
      message: t('err.validation.maximumValueExceeded').replace(
        '%maxValue%',
        NumberUtil.toMoney(max),
      ),
    },
  ];
};

const nicValidation = (): Rule[] => {
  return [
    {
      validator: (_, v: string, callback) =>
        v.length === 12 || v.length === 10
          ? v.search(/^([0-9]{9}[x|X|v|V])|([0-9]{12})$/) !== -1
            ? callback()
            : callback(t('err.validation.invalidNic'))
          : callback(t('err.validation.invalidNic')),
    },
  ];
};

const phoneValidation = (modelName: string): Rule[] => {
  return [
    {
      message: `${t('err.validation.invalid')} ${modelName}`,
      pattern:
        /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/,
    },
  ];
};

const positiveNumberValidation = (): Rule[] => {
  return [
    {
      message: `${t('err.validation.positiveNumber')}`,
      type: 'number',
      validator(rule, value, callback) {
        if (value <= 0) {
          callback(rule.message as any);
        } else {
          callback();
        }
      },
    },
  ] as Rule[];
};

export default {
  percentageValidation,
  required,
  maxValidation,
  passwordValidation,
  nicValidation,
  phoneValidation,
  positiveNumberValidation,
};
