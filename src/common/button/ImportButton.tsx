import { ImportOutlined } from "@ant-design/icons";
import { BaseButtonProps } from "antd/es/button/button";
import {
  ElementRef,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import { useTranslationLib } from "../../locale";


import ButtonComponent from "./Button";

export function ImportButton({
  onClick,
  children,
  accept,
  className,
  disabled,
  type = "link",
}: PropsWithChildren<{
  className?: string;
  accept?: string;
  disabled?: boolean;
  onClick: (file: File) => Promise<any>;
  type?: BaseButtonProps["type"];
}>) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslationLib();

  const fileInputRef = useRef<ElementRef<"input">>(null);
  const _click = useCallback(() => {
    setKey((key) => key + 1);
    if (fileInputRef.current) {
      setTimeout(() => {
        fileInputRef?.current?.click();
      }, 10);
    }
  }, []);

  const [key, setKey] = useState(0);
  const onFileChange = useCallback(
    async (event) => {
      setLoading(true);
      const file = event.target.files[0];
      if (file) {
        await onClick(file);
      }
      setLoading(false);
    },
    [onClick]
  );
  return (
    <div className={className}>
      <input
        type="file"
        key={key}
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onFileChange}
        accept={accept}
      />
      <ButtonComponent
        loading={loading}
        type={type}
        disabled={disabled}
        onClick={_click}
        icon={<ImportOutlined />}
        tooltip={t("str.import")}
      >
        {children}
      </ButtonComponent>
    </div>
  );
}
