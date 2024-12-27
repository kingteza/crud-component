/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { FileExcelOutlined } from "@ant-design/icons";
import { Col, Form, Radio, Row, Space } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FormInstance } from "antd/lib";
import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { CrudFieldProps, CrudPaginateProps } from "./CrudComponent";
import CrudField from "./CrudField";
import CrudViewer from "./view/CrudViewer";
import {
  ReportSelectFieldItems,
  SelectFieldInReport,
} from "../common";
import { ButtonComponent, PrintButton } from "../common";
import { SelectComponent } from "../common";
import { getRendererValueCrudViewer } from "./view/CrudViewerUtil";

export type CrudReportSubmitForm<T> = {
  sortBy: {
    field: keyof T;
    sort: "ASC" | "DESC";
  }[];
  showFields: string[];
} & T;

export type SearchOnlyFields<F> = CrudFieldProps<F> & { hideInTable: true };

export type ReportCrudFields<T, F> = CrudFieldProps<T> | SearchOnlyFields<F>;
export interface CrudReportComponentProps<T_Data, F_Search> {
  summary?: React.ReactNode;
  fields: ReportCrudFields<T_Data, F_Search>[];
  onSubmit: (value: CrudReportSubmitForm<F_Search>) => void;
  data: T_Data[];
  idField?: string;
  loadingData?: boolean;
  size?: SizeType;
  paginateProps?: CrudPaginateProps;
  onClickPrint?: (props: {
    fields: CrudFieldProps<T_Data>[] &
      { render: (value: any, obj: T_Data, index: number) => any }[];
    data: T_Data[];
    tableId: string;
  }) => void;
  onClickExcelExport?: (props: {
    fields: CrudFieldProps<T_Data>[] &
      { render: (value: any, obj: T_Data, index: number) => any }[];
    data: T_Data[];
    tableId: string;
  }) => void;
  minusHeight?: string;
  extraSearchFields?: (form: FormInstance<any>) => ReactElement;
  searchOnMount?: boolean;
}

const props = { lg: 6, md: 8, sm: 12, xs: 24 };

const props2 = { lg: 12, md: 16, sm: 24, xs: 24 };

function CrudReportComponent<T, F = T>({
  fields,
  data,
  idField,
  loadingData,
  onSubmit,
  paginateProps,
  size,
  onClickPrint,
  onClickExcelExport,
  minusHeight,
  extraSearchFields,
  searchOnMount,
  summary,
}: CrudReportComponentProps<T, F>) {
  const { searchable, selectable, sortable, defaultSort } = useMemo(() => {
    const searchable: ReportCrudFields<T, F>[] = [];
    const sortable: ReportCrudFields<T, F>[] = [];
    const selectable: ReportSelectFieldItems[] = [];
    let defaultSort: ReportCrudFields<T, F> | undefined = undefined;
    for (const field of fields.filter((e) => !e.hidden)) {
      if (field.type === "image" || !field.report) continue;
      if (field.report?.searchable) searchable.push(field);
      if (field.report?.sortable) {
        sortable.push(field);
        if (!defaultSort && field.report?.defaultSort) defaultSort = field;
      }
      if (!field.hideInTable)
        selectable.push({
          id: field.name,
          label: field.label,
          lock: field.report?.lock,
          alreadySelected: field.report?.alreadySelected,
        });
    }
    return {
      defaultSort,
      searchable,
      sortable,
      selectable,
    };
  }, [fields]);

  const [showingFields, setShowingFields] = useState<ReportCrudFields<T, F>[]>(
    []
  );

  const _onSubmit = useCallback(
    async ({
      sortBy: sortByField,
      sortByType,
      showFields = [] as string[],
      ...e
    }: any) => {
      const sortBy: CrudReportSubmitForm<F>["sortBy"] =
        [] as CrudReportSubmitForm<F>["sortBy"];
      if (sortByField) {
        sortBy.push({
          field: sortByField,
          sort: sortByType ?? "DESC",
        });
      }
      setShowingFields(
        fields
          .filter((e) => showFields.includes(e.name))
          .map((e) => ({ ...e, hideInTable: false as any }))
      );
      onSubmit({ showFields, sortBy, ...e });
    },
    [fields, onSubmit]
  );

  const [form] = Form.useForm<CrudReportSubmitForm<F> & F & T>();
  const [first, setFirst] = useState(false);

  const [one, setOne] = useState(true);
  useEffect(() => {
    if (searchOnMount && one) {
      const timeout = setTimeout(() => {
        form.validateFields().then((e) => {
          _onSubmit(e as any);
        });
        setOne(false);
      }, 200);

      return () => clearTimeout(timeout);
    }
  }, [_onSubmit, form, one, searchOnMount]);

  useEffect(() => {
    const inSortBy = form.getFieldValue("sortBy" as any);
    if (!inSortBy && defaultSort) {
      console.log(defaultSort.report?.defaultSort);
      form.setFieldsValue({
        sortBy: defaultSort.name as any,
        sortByType:
          typeof defaultSort.report?.defaultSort === "string"
            ? defaultSort.report?.defaultSort
            : "ASC",
      } as any);
    }
  }, [defaultSort, form]);

  useEffect(() => {
    if (first) {
      const already = selectable
        .filter((e) => e.alreadySelected)
        .map((e) => e.id);
      setShowingFields(
        fields
          .filter((e) => already.includes(e.name))
          .map((e) => ({ ...e, hideInTable: false as any }))
      );
      setFirst(false);
    }
  }, [fields, first, selectable]);

  return (
    <>
      <Space className="w-100" direction="vertical">
        <Form form={form} layout="vertical" onFinish={_onSubmit}>
          <Row gutter={[8, 8]}>
            {searchable.map((e) => {
              return (
                <Col
                  key={e.name as any}
                  {...(e.grid ?? props)}
                  style={{ alignSelf: "end" }}
                >
                  {e.report?.customRender ? (
                    e.report.customRender(form)
                  ) : e.type === "date" ? (
                    <CrudField<any>
                      {...e}
                      type="date"
                      range={e.report?.range}
                      required={Boolean(e.report?.required)}
                      readonly={false}
                      fieldClassName="mb-0"
                    />
                  ) : e.type === "select" ? (
                    <CrudField<any>
                      {...e}
                      type="select"
                      multiple
                      required={false}
                      readonly={false}
                      fieldClassName="mb-0"
                    />
                  ) : (
                    <CrudField<any>
                      {...e}
                      readonly={false}
                      required={false}
                      fieldClassName="mb-0"
                    />
                  )}
                </Col>
              );
            })}
            {Boolean(selectable?.length) && (
              <Col {...props2}>
                <SelectFieldInReport
                  items={selectable}
                  name="showFields"
                  mode="multiple"
                  label="Show Fields"
                  className="mb-0"
                />
              </Col>
            )}
            {Boolean(sortable.length) && (
              <Col {...props}>
                <SelectComponent
                  label="Sort By"
                  name={"sortBy"}
                  items={sortable.map((e) => ({ id: e.name, label: e.label }))}
                  nameFieldInArray="label"
                  fieldId="id"
                  className="mb-0"
                  dropdownRender={(menu) => {
                    return (
                      <>
                        {menu}
                        <Form.Item name={"sortByType"} noStyle className="mt-3">
                          <Radio.Group
                            className="w-100"
                            defaultValue={"DESC"}
                            optionType="button"
                          >
                            <Row>
                              <Col xs={12}>
                                <Radio
                                  className="w-100"
                                  style={{
                                    borderTopRightRadius: 0,
                                    borderBottomRightRadius: 0,
                                  }}
                                  value={"ASC"}
                                >
                                  {"Ascending"}
                                </Radio>
                              </Col>
                              <Col xs={12}>
                                <Radio
                                  className="w-100"
                                  style={{
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0,
                                  }}
                                  value={"DESC"}
                                >
                                  {"Descending"}
                                </Radio>
                              </Col>
                            </Row>
                          </Radio.Group>
                        </Form.Item>
                      </>
                    );
                  }}
                />
              </Col>
            )}

            {extraSearchFields ? extraSearchFields(form) : null}
          </Row>
          <ButtonComponent
            className="mt-3"
            type="primary"
            block
            htmlType="submit"
            disabled={loadingData}
          >
            Submit
          </ButtonComponent>
        </Form>
        <Space>
          {Boolean(onClickPrint) && (
            <PrintButton
              disabled={loadingData || !data.length}
              onClick={() =>
                onClickPrint?.({
                  tableId: "#crud-table table",
                  data,
                  fields: showingFields.map((e) => ({
                    ...e,
                    render: getRendererValueCrudViewer<any>(e),
                  })) as any,
                })
              }
            />
          )}
          {Boolean(onClickExcelExport) && (
            <ButtonComponent
              disabled={loadingData || !data.length}
              onClick={() =>
                onClickExcelExport?.({
                  tableId: "#crud-table table",
                  data,
                  fields: showingFields.map((e) => ({
                    ...e,
                    render: getRendererValueCrudViewer<any>(e),
                  })) as any,
                })
              }
              icon={<FileExcelOutlined />}
              className={`group
                ${
                  loadingData || !data.length
                    ? ""
                    : "!bg-green-700 hover:!bg-green-600 !text-white !border-green-700 hover:!border-green-600"
                }
                
              `}
            >
              Excel
            </ButtonComponent>
          )}
        </Space>
        {summary}
        <CrudViewer<any>
          minusHeight={minusHeight}
          data={data as any}
          size={size}
          fields={showingFields}
          idField={idField}
          loadingData={loadingData}
          paginateProps={paginateProps}
          viewable={false}
        />
      </Space>
    </>
  );
}

export default CrudReportComponent;
