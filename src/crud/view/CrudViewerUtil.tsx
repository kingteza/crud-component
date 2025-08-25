import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tooltip, Avatar, Tag, Space } from "antd";
import { ShowMore } from "../../common";
import {
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  TimeBasedFieldProps,
} from "../CrudComponent";
import { FileCrudCellValue } from "../FileCrudField";
import { ImageCrudCellValue, ImageCrudField } from "../ImageCrudField";

import DateUtil from "../../util/DateUtil";
import NumberUtil from "../../util/NumberUtil";
import { t } from "../../locale";
import { TextAreaBasedFieldProps } from "../CrudTextAreaComponent";

export function getRendererValueCrudViewer<T>({
  type,
  render,
  ...props
}: CrudFieldProps<T>) {
  try {
    return type === "object"
      ? (e, value, i) =>
          typeof render === "function" ? render(e, value, i) : String()
      : type === "select"
      ? (e, value, i) => {
          const selectProps = props as any as SelectCrudField<{}>;
          const v = selectProps.multiple
            ? Array.isArray(e)
              ? e.map((e) => e?.[selectProps.innerFieldLabel ?? "name"])
              : undefined
            : e?.[selectProps.innerFieldLabel ?? "name"];
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
          const propsEnum = props as any as EnumCrudField<{}>;
          if (typeof render === "function") {
            return render(e, value, i);
          }
          if (propsEnum.multiple) {
            const ar = Array.isArray(e) ? e : e ? [e] : [];
            if (typeof propsEnum.tagRender === "object") {
              return (
                <Space wrap>
                  {ar.map((item, index) => {
                    const tagProps = propsEnum.tagRender?.[item];
                    const translatedValue = t(
                      propsEnum?.translation?.[item ?? ""] ?? item
                    ) as any;
                    return tagProps ? (
                      <Tag key={index + item} color={tagProps.color}>
                        {translatedValue}
                      </Tag>
                    ) : (
                      translatedValue
                    );
                  })}
                </Space>
              );
            } else if (propsEnum?.translation) {
              return ar
                ?.map((e) => t(propsEnum?.translation?.[e ?? ""] ?? e))
                .join(", ");
            } else {
              return ar?.join(", ");
            }
          }

          const val = propsEnum?.translation?.[e ?? ""] ?? e;
          const v = t(val);

          if (typeof propsEnum.tagRender === "object") {
            const tagProps = propsEnum.tagRender[e];
            if (tagProps) {
              return <Tag color={tagProps.color}>{v as any}</Tag>;
            }
          }

          return v;
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
            format || (use12Hours ? "hh:mm:ss A" : undefined)
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
          const props0 = props as any as TextAreaBasedFieldProps<{}>;
          const truncated = props0.truncated ?? 1;
          return typeof render === "function" ? (
            render(e, value, i)
          ) : !truncated ? (
            props0.rich ? (
              <div
                style={{ all: "unset" }}
                dangerouslySetInnerHTML={{ __html: e }}
              ></div>
            ) : (
              e
            )
          ) : (
            <ShowMore lines={truncated === true ? 1 : truncated}>
              {props0.rich ? (
                <div
                  style={{ all: "unset" }}
                  dangerouslySetInnerHTML={{ __html: e }}
                ></div>
              ) : (
                e
              )}
            </ShowMore>
          );
        }
      : typeof render === "function"
      ? render
      : (e, value, i) => e;
  } catch (e) {
    console.warn(
      "An error occurred while rendering the value for field: " +
        String(props.name),
      e
    );
    return "-" as any;
  }
}
