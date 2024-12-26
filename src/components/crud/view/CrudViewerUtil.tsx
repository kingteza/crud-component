import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tooltip, Avatar } from "antd";
import { ShowMore } from "components/common";
import {
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  TextAreaBasedFieldProps,
  TimeBasedFieldProps,
} from "components/crud/CrudComponent";
import { FileCrudCellValue } from "components/crud/FileCrudField";
import {
  ImageCrudCellValue,
  ImageCrudField,
} from "components/crud/ImageCrudField";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";
import { t } from "i18next";
import React from "react";
import DateUtil from "util/DateUtil";
import NumberUtil from "util/NumberUtil";

export function getRendererValueCrudViewer<T>(
  { type, render, ...props }: CrudFieldProps<T>,
  plain = false
) {
  return type === "object"
    ? (e, value, i) =>
        typeof render === "function" ? render(e, value, i) : String()
    : type === "select"
    ? (e, value, i) => {
        const selectProps = props as any as SelectCrudField<{}>;
        let v = selectProps.multiple
          ? Array.isArray(e)
            ? e.map((e) => e?.[selectProps.innerFieldLabel ?? "name"])
            : undefined
          : e?.[selectProps.innerFieldLabel ?? "name"];
        if ((!v && typeof e === "string") || typeof e === "number") v = e;
        return typeof render === "function"
          ? render(v, value, i)
          : Array.isArray(v)
          ? v.join(", ")
          : v;
      }
    : type === "number"
    ? (e, value, i) =>
        typeof render === "function"
          ? render(e, value, i)
          : (props as NumberBasedFieldProps<T>)?.int
          ? NumberUtil.toInt(e, (props as NumberBasedFieldProps<T>).formatted)
          : NumberUtil.toMoney(e)
    : type === "enum"
    ? (e, value, i) => {
        const v = t(
          (props as any as EnumCrudField<{}>)?.translation?.[e ?? ""] ?? e,
          { ns: TRANSLATION_NAMESPACE }
        );
        return typeof render === "function" ? render(e, value, i) : v;
      }
    : type === "date"
    ? (e, value, i) => {
        if (!e) return "-";
        const v = (props as any as DateBasedFieldProps<{}>)?.formatTime
          ? DateUtil.formatDateTime(e)
          : DateUtil.formatDate(e);
        return typeof render === "function" ? render(e, value, i) : v;
      }
    : type === "checkbox"
    ? (e, value, i) =>
        typeof render === "function" ? (
          render(e, value, i)
        ) : e ? (
          <CheckOutlined />
        ) : (
          <CloseOutlined />
        )
    : type === "image"
    ? (e, value, i) => {
        return typeof render === "function" ? (
          render(e, value, i)
        ) : (
          <ImageCrudCellValue
            value={e}
            provider={(props as ImageCrudField<T>).provider}
          />
        );
      }
    : type === "file"
    ? (e, value, i) => {
        return typeof render === "function" ? (
          render(e, value, i)
        ) : (
          <FileCrudCellValue
            value={e}
            provider={(props as ImageCrudField<T>).provider}
          />
        );
      }
    : type === "time"
    ? (e, value, i) => {
        if (!e) return "-";
        const format = (props as any as TimeBasedFieldProps<{}>)?.format;
        const use12Hours = (props as any as TimeBasedFieldProps<{}>)
          ?.use12Hours;
        const valueFormatted = DateUtil.formatTime(
          e,
          format ? format : use12Hours ? "hh:mm:ss A" : undefined
        );
        return typeof render === "function"
          ? render(e, value, i)
          : valueFormatted;
      }
    : type === "color"
    ? (e, value, i) => {
        return typeof render === "function" ? (
          render(e, value, i)
        ) : typeof e === "string" && e.startsWith("#") ? (
          <Tooltip title={e}>
            <Avatar style={{ backgroundColor: e }}></Avatar>
          </Tooltip>
        ) : (
          String(e)
        );
      }
    : type === "textarea"
    ? (e, value, i) => {
        const truncated =
          (props as any as TextAreaBasedFieldProps<{}>)?.truncated ?? 1;
        return typeof render === "function" ? (
          render(e, value, i)
        ) : !truncated ? (
          e
        ) : (
          <ShowMore lines={truncated === true ? 1 : (truncated as number)}>
            {e}
          </ShowMore>
        );
      }
    : typeof render === "function"
    ? render
    : (e, value, i) => e;
}