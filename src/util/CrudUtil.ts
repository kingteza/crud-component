import { InitialCrudField, SelectCrudField } from "src/crud";

class CrudUtil {
  public static getRealName<T>(
    name: InitialCrudField<T>["name"] | SelectCrudField<T>["name"],
    extract: "name" | "upsertFieldName" = "name"
  ) {
    return typeof name === "object"
      ? name[extract]
      : name;
  }
}

export default CrudUtil;
