import { ImportOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useTranslationLib } from "../../locale";


import CrudImportComponent, {
  CrudImportComponentProps,
} from "./CrudImportComponent";
import ButtonComponent from "../../common/button/Button";

function CrudImportButton<T>(props: CrudImportComponentProps<T>) {
  const { t } = useTranslationLib();
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
