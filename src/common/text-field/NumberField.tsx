/* *****************************************************************************
 Copyright (c) 2020-2021 KINGTEZA and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, InputNumber } from "antd";
import {
  ElementRef,
  forwardRef,
  KeyboardEvent,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { useTranslationLib } from "../../locale";

import TooltipComponent from "../tooltip/TooltipComponent";
import { onEnterInternalTextField, TextFieldProps } from "./TextField";

const POSITIVE_INT_REPLACE_LOGIC = /\D/g;
const THOUSAND_SEPARATOR = /\B(?=(\d{3})+(?!\d))/g;
const MONEY_PARSER = /\$\s?|(,*)/g;
const BLOCKED_INT_KEYS = new Set(["e", "E", "."]);

export interface NumberTextFieldProps extends TextFieldProps {
  moneyField?: boolean;
  addonAfter?: ReactNode;
  minLength?: number;
  isInt?: boolean;
  max?: number;
  pattern?: string;
  min?: number | null;
}

function getRequiredMessage(
  label: TextFieldProps["label"],
  placeholder: string | undefined,
  requiredMessage: string
) {
  const fieldLabel = label ?? placeholder ?? "";
  return `${fieldLabel} ${requiredMessage}`.trim();
}

function formatMoney(value: number | string | null | undefined): string {
  if (value == null) return "";

  const str = String(value);
  if (!str.includes(".")) {
    return str.replace(THOUSAND_SEPARATOR, ",");
  }

  const [integer, ...fraction] = str.split(".");
  return [integer.replace(THOUSAND_SEPARATOR, ","), ...fraction].join(".");
}

function parseMoney(value: string | undefined): string {
  return value?.replace(MONEY_PARSER, "") ?? "";
}

function formatInt(
  value: number | string | null | undefined,
  replaceLogic: RegExp
): string {
  return value == null ? "" : String(value).replace(replaceLogic, "");
}

function parseIntValue(
  value: string | undefined,
  replaceLogic: RegExp
): string {
  return value == null ? "" : value.replace(replaceLogic, "");
}

const NumberTextField = forwardRef<
  ElementRef<typeof InputNumber>,
  NumberTextFieldProps
>(
  function NumberTextField(
    {
      type: _type,
      required,
      label,
      rules = [],
      placeholder,
      onEnter,
      form,
      nextFocus,
      min,
      moneyField,
      addonAfter,
      minLength,
      defaultValue,
      pattern,
      disabled,
      readOnly,
      onChange,
      value,
      max,
      addonBefore,
      size,
      isInt = false,
      tooltip,
      help,
      ...props
    },
    ref
  ) {
    const { t } = useTranslationLib();
    const allowNegative = min === null;
    const usePositiveIntFormat = isInt && !allowNegative;
    const resolvedPlaceholder = placeholder ?? (label as string);

    const formRules = useMemo(() => {
      const ruleList = [
        ...rules,
        {
          required,
          message: getRequiredMessage(
            label,
            placeholder,
            t("err.validation.required")
          ),
        },
      ];

      if (isInt) {
        ruleList.push({
          type: "number",
          validator: async (_: unknown, fieldValue: number | null) => {
            if (fieldValue == null || Number.isInteger(fieldValue)) return;
            throw new Error(t("err.validation.integer"));
          },
        });
      }

      return ruleList;
    }, [rules, label, placeholder, t, required, isInt]);

    const formatter = useMemo(() => {
      if (moneyField) return formatMoney;
      if (usePositiveIntFormat) {
        return (fieldValue: number | string | null | undefined) =>
          formatInt(fieldValue, POSITIVE_INT_REPLACE_LOGIC);
      }
      return undefined;
    }, [moneyField, usePositiveIntFormat]);

    const parser = useMemo(() => {
      if (moneyField) return parseMoney;
      if (usePositiveIntFormat) {
        return (fieldValue: string | undefined) =>
          parseIntValue(fieldValue, POSITIVE_INT_REPLACE_LOGIC);
      }
      return undefined;
    }, [moneyField, usePositiveIntFormat]);

    const handlePressEnter = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) =>
        onEnterInternalTextField(e, nextFocus, form, onEnter),
      [nextFocus, form, onEnter]
    );

    const handleIntKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (!allowNegative && e.key === "-") {
          e.preventDefault();
          return;
        }

        if (BLOCKED_INT_KEYS.has(e.key)) {
          e.preventDefault();
        }
      },
      [allowNegative]
    );

    return (
      <TooltipComponent title={tooltip as any}>
        <Form.Item {...props} label={label} rules={formRules} help={help}>
          <InputNumber
            ref={ref}
            disabled={disabled}
            defaultValue={defaultValue}
            value={value}
            readOnly={readOnly}
            addonBefore={addonBefore}
            minLength={minLength}
            addonAfter={addonAfter}
            step={isInt ? 1 : undefined}
            inputMode={isInt ? "numeric" : undefined}
            pattern={
              isInt ? (allowNegative ? "-?[0-9]*" : "[0-9]*") : pattern
            }
            precision={isInt ? 0 : undefined}
            onChange={onChange}
            onPressEnter={handlePressEnter}
            className="max-width"
            min={allowNegative ? undefined : min ?? 0}
            max={max}
            type={moneyField ? undefined : "number"}
            size={size}
            formatter={formatter}
            parser={parser}
            onKeyDown={isInt ? handleIntKeyDown : undefined}
            placeholder={resolvedPlaceholder}
          />
        </Form.Item>
      </TooltipComponent>
    );
  }
);

export default NumberTextField;
