import React, { FC, useEffect, useState, startTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { CrudComponent, InitialCrudField } from './crud';
import { Form, Input } from 'antd';
import { TextField } from './common';

const roomCount = Array(60).fill(0).map((_, index) => ({
  key: index + 1,
  value: index + 1,
}));

interface BuildingAndFloorFormFields {
  name: string;
  numberOfFloors: number;
  floors: {
    id: string;
    name: string;
  }[];
}

const BuildingAndFloorScreen = () => {
  const { t } = useTranslation();

  const [values, setvalues] = useState<BuildingAndFloorFormFields[]>([]);
  return (
    <>
      <CrudComponent
        onCreate={async (t) => {
          startTransition(() => {
            setvalues((e) => [...e, t]);
          });
        }}
        data={values}
        fields={[
          {
            name: 'name',
            label: t('name'),
            type: 'text',
            required: true,
          },
          {
            name: 'numberOfFloors',
            label: t('numberOfFloors'),
            type: 'select',
            required: false,
            items: roomCount,
          },
          {
            name: 'floors',
            label: t('floors'),
            type: 'object',
            hideInDescList: true,
            hideInTable: true,
            // render: (values) => <>{values.map((value) => value.name).join(', ')}</>,
            render: () => <></>,
            customFormFieldRender(form, props) {
              return <FloorForm props={props} />;
            },
          },
        ]}
        idField="id"
        grid={true}
      />
    </>
  );
};

export default BuildingAndFloorScreen;

const FloorForm: FC<{ props: InitialCrudField<any> }> = ({ props }) => {
  const { t } = useTranslation();

  const form = Form.useFormInstance<BuildingAndFloorFormFields>();
  const numberOfFloors = Form.useWatch('numberOfFloors', form);

  useEffect(() => {
    const floorCount = numberOfFloors ?? 1;
    const floorsExisting = form.getFieldValue('floors') ?? [];
    const newList = [...floorsExisting];
    for (let i = floorsExisting?.length ?? 0; i < floorCount; i++) {
      if (i === 0) {
        newList.push({ name: 'Ground Floor' });
      } else if (i > 0) {
        newList.push({ name: 'Floor ' + i });
      }
    }
    form.setFieldValue('floors', newList);
  }, [form, numberOfFloors]);

  return (
    <Form.List name="floors">
      {(fields) => (
        <div>
          {fields.map((field) => (
            <Form.Item layout='horizontal' {...field}>
              <Form.Item name={[field.name, 'id']} hidden>
                <Input />
              </Form.Item>
              <TextField
                layout="horizontal"
                name={[field.name, 'name']}
                label={[t('floor'), field.key + 1].join(' ')}
              />
            </Form.Item>
          ))}
        </div>
      )}
    </Form.List>
  );
};
