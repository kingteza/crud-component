import { ImportOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TRANSLATION_NAMESPACE } from "../../locale/hooks/translation-constants";

import CrudImportComponent, {
  CrudImportComponentProps,
} from "./CrudImportComponent";
import ButtonComponent from "../../common/button/Button";

function CrudImportButton<T>(props: CrudImportComponentProps<T>) {
  const { t } = useTranslation(TRANSLATION_NAMESPACE);
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
