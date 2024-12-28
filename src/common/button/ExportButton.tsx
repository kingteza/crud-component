import { ExportOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useTranslationLib } from "../../locale";

import ButtonComponent from "./Button";


export function ExportButton<T>({
  value,
  onClick,
}: {
  value: T;
  onClick: (value: T) => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslationLib();

  const _click = useCallback(async () => {
    setLoading(true);
    onClick(value).finally(() => setLoading(false));
  }, [onClick, value]);
  return (
    <ButtonComponent
      loading={loading}
      type="link"
      onClick={_click}
      icon={<ExportOutlined />}
      tooltip={t("str.export")}
    />
  );
}
