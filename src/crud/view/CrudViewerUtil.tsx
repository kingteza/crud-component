import { ErrorBoundary } from "react-error-boundary";

import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Tooltip, Avatar, Tag, Space, Typography } from "antd";
import {
  ColorPickerFieldProps,
  CrudFieldProps,
  DateBasedFieldProps,
  EnumCrudField,
  NumberBasedFieldProps,
  SelectCrudField,
  TextBasedFieldProps,
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
import {
  Copyable,
  copyableFn,
  CopyToClipboardButtonWrapper,
} from "src/util/CopyUtilComponent";

export function getRendererValueCrudViewer<T>({
  type,
  render,
  ...props
}: CrudFieldProps<T>) {
  try {
    return type === "object"
      ? (e, value, i) => (
          <CopyToClipboardButtonWrapper
            copyable={(props as any).copyable}
            value={e}
          >
            {typeof render === "function" ? render(e, value, i) : String()}
          </CopyToClipboardButtonWrapper>
        )
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
          return (
            <Typography.Text copyable={copyableFn(selectProps.copyable, v)}>
              {typeof render === "function"
                ? render(v, value, i)
                : Array.isArray(v)
                ? v.join(", ")
                : v}
            </Typography.Text>
          );
        }
      : type === "number"
      ? (e, value, i) => {
          const numberProps = props as NumberBasedFieldProps<T>;
          return (
            <Typography.Text copyable={copyableFn(numberProps.copyable, e)}>
              {typeof render === "function"
                ? render(e, value, i)
                : numberProps.int
                ? NumberUtil.toInt(e, numberProps.formatted)
                : NumberUtil.toMoney(e)}
            </Typography.Text>
          );
        }
      : type === "enum"
      ? (e, value, i) => {
          if (!e) return "-";
          const propsEnum = props as any as EnumCrudField<{}>;
          if (typeof render === "function") {
            return (
              <CopyToClipboardButtonWrapper
                copyable={propsEnum.copyable}
                value={e}
              >
                {render(e, value, i)}
              </CopyToClipboardButtonWrapper>
            );
          }
          if (propsEnum.multiple) {
            const ar = (Array.isArray(e) ? e : e ? [e] : []).map((item) => {
              const tagProps = propsEnum.tagRender?.[item];
              const translatedValue = tWithOrWithoutNS(
                propsEnum?.translation?.[item ?? ""] ?? item,
                undefined,
                item
              ) as any;
              return {
                tagProps,
                translatedValue,
                item,
              };
            });
            if (typeof propsEnum.tagRender === "object") {
              return (
                <CopyToClipboardButtonWrapper
                  copyable={propsEnum.copyable}
                  value={() => {
                    return ar
                      .map(
                        ({ translatedValue, item }) => translatedValue ?? item
                      )
                      .join(", ");
                  }}
                >
                  <ErrorBoundaryComponent>
                    <Space wrap>
                      {ar.map(({ tagProps, translatedValue, item }, index) => {
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
                </CopyToClipboardButtonWrapper>
              );
            } else if (propsEnum?.translation) {
              return (
                <CopyToClipboardButtonWrapper
                  copyable={propsEnum.copyable}
                  value={() => {
                    return ar
                      .map(
                        ({ translatedValue, item }) => translatedValue ?? item
                      )
                      .join(", ");
                  }}
                >
                  <ErrorBoundaryComponent>
                    {ar
                      ?.map(
                        ({ translatedValue, item }) =>
                          translatedValue ?? (item as string)
                      )
                      .join(", ")}
                  </ErrorBoundaryComponent>
                </CopyToClipboardButtonWrapper>
              );
            } else {
              const text = ar
                .map(({ translatedValue, item }) => translatedValue ?? item)
                .join(", ");
              return (
                <Typography.Text
                  copyable={copyableFn(propsEnum.copyable, text)}
                >
                  {text}
                </Typography.Text>
              );
            }
          }

          const val = propsEnum?.translation?.[e ?? ""] ?? e;
          const v = tWithOrWithoutNS(val, undefined, e) as string;

          if (typeof propsEnum.tagRender === "object") {
            const tagProps = propsEnum.tagRender[e];
            if (tagProps) {
              return (
                <CopyToClipboardButtonWrapper
                  copyable={propsEnum.copyable}
                  value={v}
                >
                  <Tag color={tagProps.color}>{v as any}</Tag>
                </CopyToClipboardButtonWrapper>
              );
            }
          }

          return (
            <Typography.Text copyable={copyableFn(propsEnum.copyable, v)}>
              {v}
            </Typography.Text>
          );
        }
      : type === "date"
      ? (e, value, i) => {
          if (!e) return "-";
          const propsDate = props as any as DateBasedFieldProps<{}>;
          const v = propsDate.formatTime
            ? DateUtil.formatDateTime(e)
            : DateUtil.formatDate(e);
          return (
            <CopyToClipboardButtonWrapper
              copyable={propsDate.copyable}
              value={v}
            >
              <ErrorBoundaryComponent>
                {typeof render === "function" ? render(e, value, i) : v}
              </ErrorBoundaryComponent>
            </CopyToClipboardButtonWrapper>
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
          const props0 = props as any as TimeBasedFieldProps<{}>;
          const format = props0.format;
          const use12Hours = props0.use12Hours;
          const valueFormatted = DateUtil.formatTime(
            e,
            format || (use12Hours ? "hh:mm:ss A" : undefined)
          );

          return (
            <CopyToClipboardButtonWrapper
              copyable={props0.copyable}
              value={valueFormatted}
            >
              <ErrorBoundaryComponent>
                {typeof render === "function"
                  ? render(e, value, i)
                  : valueFormatted}
              </ErrorBoundaryComponent>
            </CopyToClipboardButtonWrapper>
          );
        }
      : type === "color"
      ? (e, value, i) => {
          const props0 = props as any as ColorPickerFieldProps<T>;
          if (!e) return "-";
          return (
            <CopyToClipboardButtonWrapper copyable={props0.copyable} value={e}>
              <ErrorBoundaryComponent>
                {typeof render === "function" ? (
                  render(e, value, i)
                ) : typeof e === "string" && e.startsWith("#") ? (
                  <Tooltip title={e}>
                    <Avatar style={{ backgroundColor: e }}></Avatar>
                  </Tooltip>
                ) : (
                  String(e)
                )}
              </ErrorBoundaryComponent>
            </CopyToClipboardButtonWrapper>
          );
        }
      : type === "textarea"
      ? (e, value, i) => {
          if (!e) return "-";
          const props0 = props as any as TextAreaBasedFieldProps<{}>;
          const truncated = props0.truncated ?? 1;
          const isVeryShort = typeof e === "string" && e.split(" ").length < 10;
          const component =
            typeof render === "function" ? (
              <CopyToClipboardButtonWrapper
                copyable={props0.copyable}
                value={e}
              >
                {render(e, value, i)}
              </CopyToClipboardButtonWrapper>
            ) : truncated ? (
              <ErrorBoundaryComponent>
                <Typography.Paragraph
                  ellipsis={
                    !isVeryShort && {
                      rows: truncated === true ? 1 : truncated,
                      expandable: "collapsible",
                    }
                  }
                  copyable={copyableFn(props0.copyable, e)}
                >
                  {props0.rich ? (
                    <div
                      style={{ all: "unset" }}
                      dangerouslySetInnerHTML={{ __html: e }}
                    ></div>
                  ) : (
                    e
                  )}
                </Typography.Paragraph>
              </ErrorBoundaryComponent>
            ) : props0.rich ? (
              <CopyToClipboardButtonWrapper
                copyable={props0.copyable}
                value={e}
              >
                <div
                  style={{ all: "unset" }}
                  dangerouslySetInnerHTML={{ __html: e }}
                ></div>
              </CopyToClipboardButtonWrapper>
            ) : (
              <CopyToClipboardButtonWrapper
                copyable={props0.copyable}
                value={e}
              >
                {e}
              </CopyToClipboardButtonWrapper>
            );
          return component;
        }
      : typeof render === "function"
      ? render
      : (e, value, i) => {
          const textProps = props as TextBasedFieldProps<T>;
          return (
            <Typography.Text copyable={copyableFn(textProps.copyable, e)}>
              {e}
            </Typography.Text>
          );
        };
  } catch (e) {
    console.warn(
      "An error occurred while rendering the value for field: " +
        String(props.name),
      e
    );
    return "-" as any;
  }
}
