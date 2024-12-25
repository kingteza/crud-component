import { ImportOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import CrudImportComponent, {
  CrudImportComponentProps,
} from "./CrudImportComponent";
import ButtonComponent from "components/common/button/Button";

function CrudImportButton<T>(props: CrudImportComponentProps<T>) {
  const { t } = useTranslation();
  const [openImport, setOpenImport] = useState(false);

  return (
    <>
      <CrudImportComponent
        open={openImport}
        onCloseMethod={setOpenImport}
        {...props}
      />
      <ButtonComponent
        icon={<ImportOutlined />}
        onClick={() => setOpenImport(true)}
      >
        {t("str.import")}
      </ButtonComponent>
    </>
  );
}

export default CrudImportButton;
