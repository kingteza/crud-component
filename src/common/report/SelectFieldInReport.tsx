/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Checkbox, Col, Form, List, Modal, Row, Select } from "antd";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import SelectComponent from "../select/SelectComponent";
import { ValidationUtil } from "../../util";

export interface ReportSelectFieldItems {
  id: any;
  label: string;
  lock?: boolean;
  alreadySelected?: boolean;
}

export type SelectFieldInReportSelectingMode = "checkbox" | "select";

export const SelectFieldInReport: FC<{
  mode?: "multiple" | "tags" | undefined;
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  onSelect?: (val: any) => void;
  items: ReportSelectFieldItems[];
  selectingMode?: SelectFieldInReportSelectingMode;
}> = ({
  className,
  onSelect,
  label,
  required,
  name,
  mode,
  items,
  selectingMode,
}) => {
  const form = Form.useFormInstance();
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (items && first) {
      const fields = items.filter((e) => e.alreadySelected).map((e) => e.id);
      form?.setFieldsValue({
        [name]: mode === "multiple" ? fields : fields?.[0],
      });
      setFirst(false);
    }
  }, [first, form, items, mode, name]);

  const [open, setOpen] = useState(false);

  const [beforeValue, setBeforeValue] = useState<any>(undefined);

  const onCancel = useCallback(() => {
    setOpen(false);
    form.setFieldsValue({
      [name]: beforeValue,
    });
  }, [beforeValue, form, name]);
  const onOk = useCallback(() => {
    setOpen(false);
    setBeforeValue(undefined);
  }, []);

  const onClickOpen = useCallback(() => {
    setBeforeValue(form.getFieldValue(name));
    setOpen(true);
  }, [form, name]);

  const isCheckboxMode = selectingMode === "checkbox";

  const onSelectOpenChange = useCallback(
    (visible: boolean) => {
      if (isCheckboxMode && visible) {
        onClickOpen();
      }
    },
    [isCheckboxMode, onClickOpen]
  );

  const itemSorted = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      return a.label.localeCompare(b.label);
    });
    return sorted;
  }, [items]);

  return (
    <>
      {isCheckboxMode && (
        <Modal
          open={open}
          onCancel={onCancel}
          onOk={onOk}
          destroyOnHidden
          title={label}
        >
          <Form.Item
            name={name}
            required={required}
            rules={[...(required ? ValidationUtil.required(label) : [])]}
            className={className}
          >
            <Checkbox.Group onChange={onSelect} style={{ width: "100%" }}>
              <List
                size="small"
                style={{ width: "100%" }}
                dataSource={itemSorted}
                renderItem={(e) => (
                  <List.Item key={e.id} style={{ width: "100%" }}>
                    <List.Item.Meta
                      avatar={<Checkbox value={e.id} disabled={e.lock} />}
                      title={e.label}
                    ></List.Item.Meta>
                  </List.Item>
                )}
              />
            </Checkbox.Group>
          </Form.Item>
        </Modal>
      )}
      <SelectComponent
        required={required}
        label={label}
        mode={mode}
        className={className}
        name={name}
        onSelect={onSelect}
        items={items}
        showSearch={false}
        {...(isCheckboxMode
          ? { open: false, onOpenChange: onSelectOpenChange }
          : {})}
        itemBuilder={(e) => (
          <Select.Option key={e.id} value={e.id} disabled={e.lock}>
            {e.label}
          </Select.Option>
        )}
      />
    </>
  );
};
