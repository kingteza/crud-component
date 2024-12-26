import { ExportOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import ButtonComponent from "./Button";
import { TRANSLATION_NAMESPACE } from "locale/hooks/translation-constants";

export function ExportButton<T>({
  value,
  onClick,
}: {
  value: T;
  onClick: (value: T) => Promise<any>;
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(TRANSLATION_NAMESPACE);

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
