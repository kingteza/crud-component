/* *****************************************************************************
Copyright (c) 2020-2023 Kingteza and/or its affiliates. All rights reserved.
KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import 'react-quill/dist/quill.snow.css';
import './style.css';
import { Form } from "antd";
import { Rule } from "antd/es/form";
import React, { FC, ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import { ValidationUtil } from "src/util";

export interface RichTextEditorProps {
  help?: ReactNode;
  label?: string;
  name: string;
  required?: boolean;
  rules?: Rule[];
  disabled?: boolean;
}

// Dynamically import ReactQuill for Vite
const ReactQuill = React.lazy(async () => {
  const { default: RQ } = await import('react-quill');
  // eslint-disable-next-line react/display-name
  return { default: (props: any) => <RQ {...props} /> };
});


export const RichTextEditor: FC<RichTextEditorProps> = ({
  name,
  label,
  required,
  rules = [],
  disabled,
  help,
}) => {
  const form = Form.useFormInstance();
  const [editorValue, setEditorValue] = useState("");

  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
  ];

  // Sync editor value with form when component mounts
  useEffect(() => {
    const currentValue = form.getFieldValue(name);
    if (
      currentValue &&
      currentValue !== "<p></p>" &&
      currentValue !== "<p><br></p>"
    ) {
      setEditorValue(currentValue);
    }
  }, [form, name]);

  // Watch for form value changes (external updates)
  const watchedValue = Form.useWatch(name, form);
  useEffect(() => {
    if (watchedValue !== editorValue) {
      if (
        !watchedValue ||
        watchedValue === "<p></p>" ||
        watchedValue === "<p><br></p>"
      ) {
        setEditorValue("");
      } else {
        setEditorValue(watchedValue);
      }
    }
  }, [watchedValue, editorValue]);

  const handleChange = (value: string) => {
    setEditorValue(value);

    const cleanedValue =
      !value || value === "<p></p>" || value.trim() === "<p><br></p>"
        ? undefined
        : value;

    form.setFieldValue(name, cleanedValue);

    // Trigger validation for this field
    form.validateFields([name]).catch(() => {});
  };

  const rules0 = useMemo(
    () =>
      required ? [...rules, ...ValidationUtil.required(label ?? "")] : rules,
    [required, rules, label]
  );
  return (
    <Form.Item help={help} name={name} label={label} rules={rules0}>
      <Suspense fallback={<div>Loading editor...</div>}>
        <ReactQuill
          readOnly={disabled}
          value={editorValue}
          onChange={handleChange}
          theme="snow"
          className="bg-white dark:!bg-[#141414] dark:text-white dark:!fill-white"
          modules={modules}
          formats={formats}
        />
      </Suspense>
    </Form.Item>
  );
};
