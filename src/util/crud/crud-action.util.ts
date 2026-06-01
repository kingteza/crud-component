import { CrudActionsProps } from "../../crud";

export function hasCrudActions<T, FormType>(
  props: CrudActionsProps<T, FormType>,
  data: T | undefined
): boolean {
  const {
    extraAction,
    onUpdate,
    onClickUpdate,
    onClickClone,
    onDelete,
    onHide,
    onExport,
    inBuiltModalProps,
    updatable,
    deletable,
  } = props;

  if (!data) return false;

  const extra = extraAction?.(data);
  const canUpdate = updatable ? updatable(data) : true;
  const canDelete = deletable ? deletable(data) : true;

  return Boolean(
    (Array.isArray(extra) ? extra.filter(Boolean).length : extra) ||
      onUpdate ||
      (canUpdate && onClickUpdate) ||
      inBuiltModalProps?.onUpdate ||
      onClickClone ||
      inBuiltModalProps?.onCreate ||
      (canDelete && onDelete) ||
      onExport ||
      onHide
  );
}
