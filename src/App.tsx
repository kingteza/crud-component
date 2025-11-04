import { setupI18n } from "./locale";
import { CrudComponent, CrudDecListView, FileUploadProvider } from ".";
import { useState } from "react";
import { UploadFile } from "antd/lib";

// Initialize with your custom translations
setupI18n();

export enum PurchaseStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum TestEnum {
  TEST = "TEST",
  TEST2 = "TEST2",
  TEST3 = "TEST3",
}

export type Purchase = {
  status: PurchaseStatus;
  test: TestEnum;
  value: string;
  id: string | number;
  name: string;
  image: string;
  helloId: string;
  hello?: {
    id: string;
    name: string;
  };
};

class TestUploadProvider extends FileUploadProvider {
  public getInitialPath(): Promise<string> {
    return Promise.resolve("/");
  }
  public async upload(
    file: UploadFile<any>,
    filePath: string
  ): Promise<string> {
    // Create a download link for the blob
    if (file.originFileObj) {
      const url = URL.createObjectURL(file.originFileObj);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name || "cropped-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Return a placeholder URL for the component
    return Promise.resolve(
      `https://picsum.photos/id${Math.floor(Math.random() * 1000)}/400/300`
    );
  }

  public delete(filePath: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public clone(filePath: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  public getRealUrl(filePath: string): Promise<string> {
    return Promise.resolve("https://picsum.photos/id" + filePath);
  }
}
function App() {
  const [data, setData] = useState<Purchase[]>([
    {
      id: "1",
      helloId: "1",
      status: PurchaseStatus.CANCELLED,
      test: TestEnum.TEST,
      value: "test",
      name: "test",
      image: "/237/200/300",
    },
    {
      id: "2",
      status: PurchaseStatus.PENDING,
      test: TestEnum.TEST,
      value: "sample data",
      name: "John Doe",
      image: "/400/300/200",
      helloId: "1",
    },
    {
      id: "3",
      status: PurchaseStatus.COMPLETED,
      test: TestEnum.TEST,
      value: "another record",
      name: "Jane Smith",
      image: "/500/400/300",
      helloId: "1",
    },
    {
      id: "4",
      status: PurchaseStatus.PENDING,
      test: TestEnum.TEST,
      value: "demo content",
      name: "Bob Johnson",
      image: "/300/250/150",
      helloId: "2",
    },
    {
      id: "5",
      status: PurchaseStatus.COMPLETED,
      test: TestEnum.TEST,
      value: "final example",
      name: "Alice Brown",
      image: "/600/500/400",
      helloId: "3",
    },
  ]);
  const props = useWorkShiftCrudComponentProps();
  return (
    <div className="">
      <ShowMoreTest />
      <CrudComponent<Purchase>
        data={data}
        size="small"
        draggable={{
          onDragEnd: (e) => {
            console.log(e);
          },
          columnLabel: "Drag",
        }}
        onDelete={async (e) => {
          console.log(e);
          setData(data.filter((e) => e.id !== (e as any)));
        }}
        onCreate={async (e) => {
          console.log(e);
          setData((data) => [...data, { ...e, id: String(Math.random()) }]);
        }}
        onUpdate={async (x) => {
          console.log(x);
          setData(data.map((e) => (e.id === x.id ? x : e)));
        }}
        fields={[
          {
            type: "enum",
            name: "status",
            label: "Name",
            fieldHelper: "This is a field helper",
            enum: PurchaseStatus,
            tagRender: {
              PENDING: { color: "red" },
              COMPLETED: { color: "blue" },
              // CANCELLED: { color: "green" },
              CANCELLED: { color: "green" },
            },
            radio: true,
            translation: {
              PENDING: "Pending",
              COMPLETED: "Completed",
              CANCELLED: "Cancelled",
            },
            /*             tagRender: {
              [PurchaseStatus.PENDING]: { color: "red" },
              [PurchaseStatus.COMPLETED]: { color: "blue" },
              [PurchaseStatus.CANCELLED]: { color: "green" },
            }, */
          },
          {
            type: "enum",
            name: "test",
            fieldHelper: "This is a field helper",
            label: "Name",
            enum: TestEnum,
            required: true,
            tagRender: {
              TEST: { color: "red" },
              TEST2: { color: "blue" },
              TEST3: { color: "green" },
            },
          },
          {
            type: "image",
            name: "image",
            label: "Name",
            aspectRatio: 1,
            provider: new TestUploadProvider("237", "200"),
          },
          {
            type: "select",
            name: ["s", "hello"],
            label: "Hello Field",
            required: true,
            fieldHelper: "This is a field helper",
            items: [
              { value: "Hello", key: "1" },
              { value: "World", key: "2" },
              { value: "Nice", key: "3" },
            ],
          },
          {
            type: "textarea",
            name: "name",
            fieldHelper: "This is a field helper",
            label: "Rich Text Area",
            rich: true,
            truncated: 4,
          },
        ]}
      />
      <CrudDecListView
        data={{
          id: "7cf42fbc-89a0-4e25-acdd-ab4ac2a0bd20",
          name: "Main Shift",
          description: "test",
          startTime: "2025-10-23T02:30:52.025Z",
          endTime: "2025-10-23T10:30:52.025Z",
          gracePeriodForEndTimeMin: 15,
          gracePeriodForStartTimeMin: 30,
          shiftDurationHour: 8,
          shiftDurationMin: 0,
          orgId: "SG94436",
          createdBy: "J0cMi0kA1jcBzJDv3eIvYWPOxKA2",
          updatedBy: "J0cMi0kA1jcBzJDv3eIvYWPOxKA2",
          createdAt: "2025-10-23T14:42:24.922Z",
          updatedAt: "2025-10-23T14:42:24.922Z",
        }}
        fields={props.fields}
        inBuiltModalProps={{
          ...props,
        }}
      />
    </div>
  );
}

export default App;

/* *****************************************************************************
 Copyright (c) 2020-2025 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

const grid = {
  md: 6,
  xs: 24,
};

export const useWorkShiftCrudComponentProps = () => {
  return {
    onCreate: async (e: any) => {
      console.log(e);
    },
    onUpdate: async (e: any) => {
      console.log(e);
    },
    onDelete: async (e: any) => {
      console.log(e);
    },
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    fields: [
      {
        grid: grid,
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "description",
        label: "Description",
        type: "textarea",
        hideInTable: true,
        truncated: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "startTime",
        label: "Shift Start Time",
        type: "time",
        format: "h:mm A",
        use12Hours: true,
        required: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "endTime",
        label: "Shift End Time",
        type: "time",
        format: "h:mm A",
        use12Hours: true,
        readonly: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "shiftDurationHour",
        label: "Shift Duration Hour",
        type: "number",
        int: true,
        required: true,
        hideInTable: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "shiftDurationMin",
        label: "Shift Duration Min",
        type: "number",
        int: true,
        required: true,
        hideInTable: true,
        max: 59,
        copyable: true,
      },
      {
        name: "gracePeriodForStartTimeMin",
        label: "Grace Period For Start Time Min",
        type: "number",
        int: true,
        required: true,
        copyable: true,
      },
      {
        grid: grid,
        name: "gracePeriodForEndTimeMin",
        label: "Grace Period For End Time Min",
        type: "number",
        int: true,
        required: true,
        copyable: true,
      },
    ],
  };
};

// ShowMore Test Component
const ShowMoreTest = () => {
  const longText = `This is a very long text that should be truncated after a few lines. 
  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  return (
    <div style={{ padding: "20px", maxWidth: "600px" }}>
      <h3>ShowMore Component Test</h3>
    </div>
  );
};
