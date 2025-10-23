import { ReactElement, useCallback, useRef } from "react";
import {
  CloneButtonTable,
  DeleteButtonTable,
  ExportButton,
  HideButtonTable,
  UpdateButtonTable,
} from "../../common";
import IdProps from "../../types/Id";
import { CrudModalProps, CrudModalRef } from "../modal";
import { CrudModal } from "..";

export interface CrudActionsProps<T, FormType> {
  idField?: string;
  extraAction?: (t: T) => ReactElement | undefined | ReactElement[];
  onUpdate?: (t: FormType & IdProps) => Promise<any>;
  onClickUpdate?: (t: T) => void;
  onClickClone?: (t: T) => Promise<any>;
  onDelete?: (id: any) => Promise<any>;
  onHide?: (id: any) => Promise<any>;
  onExport?: (t: T) => Promise<any>;
  isHiding?: boolean;
  isDeleting?: boolean;
  confirmHiding?: boolean;
  confirmDeleting?: boolean;
  closeViewOnClickUpdate?: boolean;
  recentUpdateOrDeleteId?: string;
  setRecentUpdateOrDeleteId?: (id: string) => void;
  setOpenView?: (data: T | undefined) => void;

  inBuiltModalProps?: CrudModalProps<T, FormType>;
}

function CrudActions<T, FormType>({
  data,
  idField = "id",
  extraAction,
  onUpdate,
  onClickUpdate,
  onClickClone,
  onDelete,
  onHide,
  onExport,
  isHiding,
  isDeleting,
  confirmHiding,
  confirmDeleting,
  closeViewOnClickUpdate,
  recentUpdateOrDeleteId,
  setRecentUpdateOrDeleteId,
  setOpenView,
  inBuiltModalProps,
}: CrudActionsProps<T, FormType> & { data: T }) {
  const extra = extraAction?.(data);
  const modalRef = useRef<CrudModalRef<T>>(null);
  const onClickUpdate0 = useCallback(
    (e: T, shouldSetUpdatingField = true, isClone = false) => {
      setRecentUpdateOrDeleteId?.(e[idField]);
      if (inBuiltModalProps) {
        modalRef.current?.update(e, shouldSetUpdatingField, isClone);
      } else if (isClone) {
        onClickClone?.(e);
      } else {
        onClickUpdate?.(e);
      }
      if (closeViewOnClickUpdate) setOpenView?.(undefined);
    },
    [inBuiltModalProps, onClickUpdate]
  );

  return (Array.isArray(extra) ? extra?.filter(Boolean)?.length : extra) ||
    onUpdate ||
    onClickUpdate ||
    onClickClone ||
    onDelete ? (
    <>
      {inBuiltModalProps && <CrudModal ref={modalRef} {...inBuiltModalProps} />}
      {extra}
      {(onUpdate || onClickUpdate || inBuiltModalProps?.onUpdate) && (
        <UpdateButtonTable value={data} onClick={(e) => onClickUpdate0(e)} />
      )}
      {(onClickClone || inBuiltModalProps?.onCreate) && (
        <CloneButtonTable
          value={data}
          onClick={(e) => onClickUpdate0(e, false, true)}
        />
      )}
      {onExport && (
        <ExportButton
          value={data}
          onClick={async (data) => await onExport(data)}
        />
      )}
      {onHide && (
        <HideButtonTable
          value={data}
          disabled={isHiding}
          shouldConfirm={confirmHiding}
          loading={isHiding && data[idField] === recentUpdateOrDeleteId}
          onClick={async (e) => {
            setRecentUpdateOrDeleteId?.(e[idField]);
            await onHide({ [idField]: e[idField] });
          }}
        />
      )}
      {onDelete && (
        <DeleteButtonTable
          value={data}
          disabled={isDeleting}
          shouldConfirm={confirmDeleting}
          loading={isDeleting && data[idField] === recentUpdateOrDeleteId}
          onClick={async (e) => {
            setRecentUpdateOrDeleteId?.(e[idField]);
            await onDelete({ [idField]: e[idField] });
          }}
        ></DeleteButtonTable>
      )}
    </>
  ) : undefined;
}

export default CrudActions;
