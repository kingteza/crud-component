/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Rule } from "antd/lib/form";
import NumberUtil from "./NumberUtil";
import { t } from "../locale";

const required = (modelName: string) => {
  return [
    {
      required: true,
      message: `${modelName} ${t("err.validation.required")}`,
    },
  ];
};

const passwordValidation = (): Rule[] => {
  const message = t("err.validation.minLength8");
  return [
    {
      min: 8,
      message: message as any,
    },
  ];
};

const percentageValidation = (): Rule[] => {
  return [
    {
      type: "number",
      validator(_, value, callback) {
        const val = Number(value);
        const message = t("err.validation.percentage") as string;
        if (isNaN(val) && value) {
          callback(message);
        } else if (val < 0 || val > 100) {
          callback(message);
        } else {
          callback();
        }
      },
      message: t("err.validation.percentage") as string,
    },
  ];
};

const maxValidation = (max: number): Rule[] => {
  return [
    {
      max: Number(max),
      min: 0,
      type: "number",
      message: (t("err.validation.maximumValueExceeded") as string).replace(
        "%maxValue%",
        NumberUtil.toMoney(max)
      ),
    },
  ];
};

const nicValidation = (): Rule[] => {
  return [
    {
      validator: (_, v: string, callback) => {
        const message = t("err.validation.invalidNic") as string;
        return v.length === 12 || v.length === 10
          ? v.search(/^([0-9]{9}[x|X|v|V])|([0-9]{12})$/) !== -1
            ? callback()
            : callback(message)
          : callback(message);
      },
    },
  ];
};

const phoneValidation = (modelName: string): Rule[] => {
  const message = `${t("err.validation.invalid")} ${modelName}`;
  return [
    {
      message: message as any,
      pattern:
        /^(?:0|94|\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/,
    },
  ];
};

const positiveNumberValidation = (): Rule[] => {
  const message = t("err.validation.positiveNumber") as string;
  return [
    {
      message: message as any,
      type: "number",
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
