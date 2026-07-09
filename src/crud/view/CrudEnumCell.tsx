import { Tag, Space, Typography } from "antd";
import { EnumCrudField } from "../CrudComponent";
import { tWithOrWithoutNS } from "../../locale";
import { ErrorBoundaryComponent } from "../../common/error/ErrorBoundaryComponent";
import {
  copyableFn,
  CopyToClipboardButtonWrapper,
} from "../../util/CopyUtilComponent";

export type CrudEnumCellProps = {
  field: EnumCrudField<{}>;
  value: any;
};

export function CrudEnumCell({ field, value }: Readonly<CrudEnumCellProps>) {
  if (!value) return "-";

  if (field.multiple) {
    const ar = (Array.isArray(value) ? value : value ? [value] : []).map(
      (item) => {
        const tagProps = field.tagRender?.[item];
        const translatedValue = tWithOrWithoutNS(
          field?.translation?.[item ?? ""] ?? item,
          undefined,
          item
        ) as any;
        return {
          tagProps,
          translatedValue,
          item,
        };
      }
    );
    if (typeof field.tagRender === "object") {
      return (
        <CopyToClipboardButtonWrapper
          copyable={field.copyable}
          value={() => {
            return ar
              .map(({ translatedValue, item }) => translatedValue ?? item)
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
    } else if (field?.translation) {
      return (
        <CopyToClipboardButtonWrapper
          copyable={field.copyable}
          value={() => {
            return ar
              .map(({ translatedValue, item }) => translatedValue ?? item)
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
        <Typography.Text copyable={copyableFn(field.copyable, text)}>
          {text}
        </Typography.Text>
      );
    }
  }

  const val = field?.translation?.[value ?? ""] ?? value;
  const v = tWithOrWithoutNS(val, undefined, value) as string;

  if (typeof field.tagRender === "object") {
    const tagProps = field.tagRender[value];
    if (tagProps) {
      return (
        <CopyToClipboardButtonWrapper copyable={field.copyable} value={v}>
          <Tag color={tagProps.color}>{v as any}</Tag>
        </CopyToClipboardButtonWrapper>
      );
    }
  }

  return (
    <Typography.Text copyable={copyableFn(field.copyable, v)}>
      {v}
    </Typography.Text>
  );
}
