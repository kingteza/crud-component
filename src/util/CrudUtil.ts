import type { InitialCrudField, SelectCrudField } from "../crud/CrudComponent";

class CrudUtil {
  public static getRealName<T>(
    name: InitialCrudField<T>["name"] | SelectCrudField<T>["name"],
    extract: "name" | "upsertFieldName" = "name"
  ) {
    if (Array.isArray(name)) {
      return name;
    }
    return typeof name === "object"
      ? name[extract]
      : name;
  }
}

export default CrudUtil;
