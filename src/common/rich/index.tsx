/* *****************************************************************************
Copyright (c) 2020-2023 Kingteza and/or its affiliates. All rights reserved.
KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */
import { Form } from "antd";
import { Rule } from "antd/es/form";
import type { NamePath } from "antd/es/form/interface";
import { FormItemProps } from "antd/lib";
import {
  CSSProperties,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type ReactQuillType from "react-quill-new";
import { ValidationUtil } from "../../util";

export interface RichTextEditorProps {
  help?: ReactNode;
  label?: string;
  name: NamePath;
  required?: boolean;
  rules?: Rule[];
  disabled?: boolean;
  formLayoutProps?: Pick<FormItemProps, "layout" | "labelCol" | "wrapperCol">;
  rows?: number;
  cols?: number;
}

const configureQuillBlock = async () => {
  const { Quill } = await import("react-quill-new");
  const Block = Quill.import("blots/block") as any;
  Block.tagName = "div";
  Quill.register(Block);
};

/** Matches Ant Design TextArea line height (~22px at 14px font-size). */
const TEXTAREA_LINE_HEIGHT_PX = 22;
const TEXTAREA_VERTICAL_PADDING_PX = 8;

const getEditorSizeStyle = (
  rows?: number,
  cols?: number
): CSSProperties => {
  const style: CSSProperties = {};

  if (rows != null && rows > 0) {
    style["--rich-editor-min-height" as string] =
      `${rows * TEXTAREA_LINE_HEIGHT_PX + TEXTAREA_VERTICAL_PADDING_PX}px`;
  }

  if (cols != null && cols > 0) {
    style.width = `min(100%, ${cols}ch)`;
  }

  return style;
};

export const RichTextEditor: FC<RichTextEditorProps> = ({
  formLayoutProps,
  name,
  label,
  required,
  rules = [],
  disabled,
  help,
  rows,
  cols,
}) => {
  const form = Form.useFormInstance();
  const [editorValue, setEditorValue] = useState("");
  const [mounted, setMounted] = useState(false);
  const [ReactQuill, setReactQuill] = useState<typeof ReactQuillType | null>(
    null
  );
  const isUpdatingRef = useRef(false);

  const indentChar = "\u00A0\u00A0\u00A0\u00A0"; // 4 non-breaking spaces

  // Client-only mount: react-quill requires DOM (SSR/Next.js) and react-quill-new for React 19
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let cancelled = false;

    void (async () => {
      await configureQuillBlock();
      const { default: RQ } = await import("react-quill-new");
      if (!cancelled) {
        setReactQuill(() => RQ);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted]);

  // Helper to safely convert value to string
  const safeStringValue = (value: any): string => {
    if (!value) return "";
    if (typeof value === "string") return value;
    // If it's an object, try to stringify (but avoid circular refs)
    try {
      return String(value);
    } catch {
      return "";
    }
  };

  // Create handlers outside of useMemo to avoid circular references
  const createIndentHandler = () => {
    return function (this: any, value: number) {
      const quill = this.quill;
      const range = quill.getSelection(true);
      if (range) {
        const start = range.index;
        const end = range.index + range.length;

        // Get the text and find line breaks
        const text = quill.getText();
        const lines: number[] = [];

        // Find all line start positions in the selection
        for (let i = start; i <= end; i++) {
          if (i === 0 || text[i - 1] === "\n") {
            lines.push(i);
          }
        }

        if (lines.length === 0) lines.push(start);

        if (value > 0) {
          // Indent: Insert spaces at the beginning of each line
          let offset = 0;
          lines.forEach((lineStart) => {
            quill.insertText(lineStart + offset, indentChar);
            offset += indentChar.length;
          });
          quill.setSelection(
            start + indentChar.length,
            end + lines.length * indentChar.length
          );
        } else {
          // Outdent: Remove spaces from the beginning of each line
          let removedChars = 0;
          lines.forEach((lineStart) => {
            const checkPos = lineStart - removedChars;
            const lineText = quill.getText(checkPos, indentChar.length);
            if (lineText === indentChar) {
              quill.deleteText(checkPos, indentChar.length);
              removedChars += indentChar.length;
            }
          });
          const newStart = Math.max(0, start - indentChar.length);
          const newEnd = Math.max(newStart, end - removedChars);
          quill.setSelection(newStart, newEnd);
        }
      }
    };
  };

  const createTabHandler = () => {
    return function (this: any) {
      const quill = this.quill;
      const range = quill.getSelection(true);
      if (range) {
        quill.insertText(range.index, indentChar);
        quill.setSelection(range.index + indentChar.length);
        return false; // Prevent default behavior
      }
      return true;
    };
  };

  const createShiftTabHandler = () => {
    return function (this: any) {
      const quill = this.quill;
      const range = quill.getSelection(true);
      if (range && range.index >= indentChar.length) {
        const text = quill.getText(
          range.index - indentChar.length,
          indentChar.length
        );
        if (text === indentChar) {
          quill.deleteText(
            range.index - indentChar.length,
            indentChar.length
          );
          quill.setSelection(range.index - indentChar.length);
          return false; // Prevent default behavior
        }
      }
      return true;
    };
  };

  const modules = useMemo(() => {
    const indentHandler = createIndentHandler();
    const tabHandler = createTabHandler();
    const shiftTabHandler = createShiftTabHandler();

    return {
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link"],
          ["clean"],
        ],
        handlers: {
          indent: indentHandler,
        },
      },
      keyboard: {
        bindings: {
          tab: {
            key: "Tab",
            handler: tabHandler,
          },
          "shift-tab": {
            key: "Tab",
            shiftKey: true,
            handler: shiftTabHandler,
          },
        },
      },
    };
  }, []);

  const formats = useMemo(
    () => [
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "bullet",
      "link",
    ],
    []
  );

  // Sync editor value with form when component mounts
  useEffect(() => {
    const currentValue = form.getFieldValue(name);
    const stringValue = safeStringValue(currentValue);
    if (
      stringValue &&
      stringValue !== "<p></p>" &&
      stringValue !== "<p><br></p>" &&
      stringValue !== "<div></div>"
    ) {
      setEditorValue(stringValue);
    }
  }, [form, name]);

  // Watch for form value changes (external updates)
  const watchedValue = Form.useWatch(name, form);
  useEffect(() => {
    // Prevent circular updates
    if (isUpdatingRef.current) {
      return;
    }

    const stringWatchedValue = safeStringValue(watchedValue);
    const stringEditorValue = safeStringValue(editorValue);

    if (stringWatchedValue !== stringEditorValue) {
      if (
        !stringWatchedValue ||
        stringWatchedValue === "<p></p>" ||
        stringWatchedValue === "<p><br></p>" ||
        stringWatchedValue === "<div></div>"
      ) {
        setEditorValue("");
      } else {
        setEditorValue(stringWatchedValue);
      }
    }
  }, [watchedValue]);

  const handleChange = useCallback(
    (value: string) => {
      // Ensure value is a string
      const stringValue = safeStringValue(value);

      // Prevent circular updates
      isUpdatingRef.current = true;
      setEditorValue(stringValue);

      const cleanedValue =
        !stringValue ||
        stringValue === "<p></p>" ||
        stringValue.trim() === "<p><br></p>" ||
        stringValue === "<div></div>" ||
        stringValue.trim() === "<div></div>"
          ? undefined
          : stringValue;

      form.setFieldValue(name, cleanedValue);

      // Reset the flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);

      // Trigger validation for this field
      form.validateFields([name]).catch(() => {});
    },
    [form, name]
  );

  const rules0 = useMemo(
    () =>
      required ? [...rules, ...ValidationUtil.required(label ?? "")] : rules,
    [required, rules, label]
  );
  // Ensure editorValue is always a clean string and not undefined/null
  const cleanEditorValue = useMemo(() => {
    const value = safeStringValue(editorValue);
    // ReactQuill doesn't like undefined or null, always use empty string
    return value || "";
  }, [editorValue]);

  const editorSizeStyle = useMemo(
    () => getEditorSizeStyle(rows, cols),
    [rows, cols]
  );

  // Create a stable props object to prevent circular reference warnings
  const quillProps = useMemo(
    () => ({
      readOnly: Boolean(disabled),
      value: String(cleanEditorValue || ""),
      onChange: handleChange,
      theme: "snow" as const,
      className: "rich-text-editor",
      style: editorSizeStyle,
      modules: modules as any,
      formats: formats as any,
    }),
    [disabled, cleanEditorValue, handleChange, modules, formats, editorSizeStyle]
  );

  return (
    <Form.Item
      help={help}
      name={name}
      label={label}
      rules={rules0}
      {...formLayoutProps}
    >
      {mounted && ReactQuill ? (
        <ReactQuill {...quillProps} />
      ) : (
        <div
          className="rich-text-editor rich-text-editor--loading"
          style={editorSizeStyle}
        >
          Loading editor...
        </div>
      )}
    </Form.Item>
  );
};
