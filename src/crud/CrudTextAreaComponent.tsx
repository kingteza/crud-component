import { RichTextEditor, TextAreaComponent } from "src/common";

import { Form } from "antd";
import { InitialCrudField } from "./CrudComponent";
import { FormInstance } from "antd/lib";

interface InitialTextAreaProps<T> extends InitialCrudField<T> {
  type: "textarea";
  onChange?: (value: string, form: FormInstance<T>) => void;
  /**
   * number of lines to show. If false will not show truncated
   * @default 2
   */
  truncated?: boolean | number;
}

interface TextAreaProps<T> extends InitialTextAreaProps<T> {
  placeholder?: string;
  rows?: number;
  cols?: number;
}

interface RichTextAreaProps<T> extends InitialTextAreaProps<T> {
  rich?: true;
}

export type TextAreaBasedFieldProps<T> = TextAreaProps<T> &
  RichTextAreaProps<T>;

const CrudTextAreaComponent = <T,>({
  onChange,
  label,
  required,
  rules,
  name,
  updatable = true,
  ...props
}: TextAreaBasedFieldProps<T>) => {
  const form = Form.useFormInstance();
  if (props.rich) {
    return (
      <RichTextEditor
        name={name as any}
        label={label}
        required={required}
        rules={rules}
        disabled={!updatable}
      />
    );
  } else {
    const { placeholder, rows, cols, fieldClassName, fieldTooltip } =
      props as TextAreaProps<T>;
    return (
      <TextAreaComponent
        rules={rules}
        placeholder={placeholder}
        onChange={
          onChange ? (val) => onChange(val?.target?.value, form) : undefined
        }
        tooltip={fieldTooltip}
        required={required}
        disabled={!updatable}
        name={name as any}
        label={label}
        className={fieldClassName}
        rows={rows}
        cols={cols}
      />
    );
  }
};
export default CrudTextAreaComponent;
