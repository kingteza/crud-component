import { ErrorBoundary } from "react-error-boundary";

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
import { t, tWithOrWithoutNS } from "../../locale";
import { TextAreaBasedFieldProps } from "../CrudTextAreaComponent";
import CrudUtil from "src/util/CrudUtil";
import { ErrorBoundaryComponent } from "src/common/error/ErrorBoundaryComponent";

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
          if (!e) return "-";
          const selectProps = props as any as SelectCrudField<{}>;
          const e0 =
            e ||
            (selectProps.items ?? []).find(
              (item) =>
                item[selectProps.innerFieldId ?? "key"] ===
                value[CrudUtil.getRealName(props.name, "upsertFieldName")]
            );
          const v = selectProps.multiple
            ? Array.isArray(e0)
              ? e0.map((e) => e?.[selectProps.innerFieldLabel ?? "name"])
              : undefined
            : e0?.[selectProps.innerFieldLabel ?? "value"];
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
          if (!e) return "-";
          const propsEnum = props as any as EnumCrudField<{}>;
          if (typeof render === "function") {
            return render(e, value, i);
          }
          if (propsEnum.multiple) {
            const ar = Array.isArray(e) ? e : e ? [e] : [];
            if (typeof propsEnum.tagRender === "object") {
              return (
                <ErrorBoundaryComponent>
                  <Space wrap>
                    {ar.map((item, index) => {
                      const tagProps = propsEnum.tagRender?.[item];
                      const translatedValue = tWithOrWithoutNS(
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
                </ErrorBoundaryComponent>
              );
            } else if (propsEnum?.translation) {
              return (
                <ErrorBoundaryComponent>
                  {ar
                    ?.map((e) =>
                      tWithOrWithoutNS(propsEnum?.translation?.[e ?? ""] ?? e)
                    )
                    .join(", ")}
                </ErrorBoundaryComponent>
              );
            } else {
              return ar?.join(", ");
            }
          }

          const val = propsEnum?.translation?.[e ?? ""] ?? e;
          const v = tWithOrWithoutNS(val);

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
          return (
            <ErrorBoundaryComponent>
              {typeof render === "function" ? render(e, value, i) : v}
            </ErrorBoundaryComponent>
          );
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
          if (!e) return "-";
          return (
            <ErrorBoundaryComponent>
              {typeof render === "function" ? (
                render(e, value, i)
              ) : (
                <ImageCrudCellValue
                  value={e}
                  provider={(props as ImageCrudField<T>).provider}
                />
              )}
            </ErrorBoundaryComponent>
          );
        }
      : type === "file"
      ? (e, value, i) => {
          if (!e) return "";
          return (
            <ErrorBoundaryComponent>
              {typeof render === "function" ? (
                render(e, value, i)
              ) : (
                <FileCrudCellValue
                  value={e}
                  provider={(props as ImageCrudField<T>).provider}
                />
              )}
            </ErrorBoundaryComponent>
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

          return (
            <ErrorBoundaryComponent>
              {typeof render === "function"
                ? render(e, value, i)
                : valueFormatted}
            </ErrorBoundaryComponent>
          );
        }
      : type === "color"
      ? (e, value, i) => {
          if (!e) return "-";
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
          if (!e) return "-";
          const props0 = props as any as TextAreaBasedFieldProps<{}>;
          const truncated = props0.truncated ?? 1;
          const component = typeof render === "function" ? (
            render(e, value, i)
          ) : truncated ? (
            <ErrorBoundaryComponent>
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
            </ErrorBoundaryComponent>
          ) : props0.rich ? (
            <div
              style={{ all: "unset" }}
              dangerouslySetInnerHTML={{ __html: e }}
            ></div>
          ) : (
            e
          );
          console.log("component", component);
          return component;
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
