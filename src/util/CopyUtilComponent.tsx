import { Typography } from "antd";
import { CopyConfig } from "antd/es/typography/Base";
import { FC, PropsWithChildren } from "react";

export interface CopyProps {
  onCopy: (value: any) => any;
}

export interface Copyable<REQUIRED extends boolean> {
  copyable?: REQUIRED extends true ? false | CopyProps : boolean | CopyProps;
}

export const copyableFn = (copyable: Copyable<false>["copyable"], value: any) =>
  typeof copyable === "object"
    ? ({
        text() {
            return copyable.onCopy(value);
        },
        
      } as CopyConfig)
    : copyable
    ? true
    : undefined;

export const CopyToClipboardButtonWrapper: FC<
  PropsWithChildren<{
    copyable: (Copyable<true> | Copyable<false>)["copyable"];
    value: any | (() => PromiseLike<any>);
  }>
> = ({ copyable, value, children }) => {
  if (!copyable) {
    return children;
  }

  return (
    <Typography.Text
      copyable={
        typeof copyable === "object"
          ? copyableFn(copyable, value)
          : copyable
          ? {
              async text() {
                return typeof value === "function" ? await value() : value;
              },
            }
          : undefined 
      }
    >
      {children}
    </Typography.Text>
  );
};
