/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { Form, Select } from 'antd';
import { CrudFieldGrid } from 'components/crud/CrudComponent';
import React, { FC, useEffect, useState } from 'react';

import SelectComponent from '../select/SelectComponent';

export interface ReportSelectFieldItems {
  id: any;
  label: string;
  lock?: boolean;
  alreadySelected?: boolean;
}

export const SelectFieldInReport: FC<{
  mode?: 'multiple' | 'tags' | undefined;
  name: string;
  label: string;
  className?: string;
  required?: boolean;
  onSelect?: (val: any) => void;
  items: ReportSelectFieldItems[];
}> = ({ className, onSelect, label, required, name, mode, items }) => {
  const form = Form.useFormInstance();
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (items && first) {
      const fields = items.filter((e) => e.alreadySelected).map((e) => e.id);
      form?.setFieldsValue({
        [name]: mode === 'multiple' ? fields : fields?.[0],
      });
      setFirst(false);
    }
  }, [first, form, items, mode, name]);

  return (
    <SelectComponent
      required={required}
      label={label}
      mode={mode}
      className={className}
      name={name}
      onSelect={onSelect}
      items={items}
      itemBuilder={(e) => (
        <Select.Option key={e.id} value={e.id} disabled={e.lock}>
          {e.label}
        </Select.Option>
      )}
    />
  );
};