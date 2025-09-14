import { setupI18n } from "./locale";
import { CrudComponent, FileUploadProvider } from ".";
import { useState } from "react";
import Play from "./Play";
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
  public async upload(file: UploadFile<any>, filePath: string): Promise<string> {
    // Create a download link for the blob
    if (file.originFileObj) {
      const url = URL.createObjectURL(file.originFileObj);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name || 'cropped-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    
    // Return a placeholder URL for the component
    return Promise.resolve(`https://picsum.photos/id${Math.floor(Math.random() * 1000)}/400/300`);
  }
  
  public delete(filePath: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  public clone(filePath: string): Promise<string> {
    throw new Error("Method not implemented.");
  }
  public getRealUrl(filePath: string): Promise<string> {
    return Promise.resolve('https://picsum.photos/id' + filePath);
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


  return (
    <div className="">
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
            label: "Name",
            enum: TestEnum,
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
            name: {
              upsertFieldName: 'helloId',
              name: 'hello',
            },
            label: "Hello Field",
            items: [
              { value: "Hello", key: "1" },
              { value: "World", key: "2" },
              { value: "Nice", key: "3" },
            ],
          },
          {
            type: "textarea",
            name: "name",
            label: "Rich Text Area",
            rich: true,
            truncated: 4,
          },
        ]}
      />
    </div>
  );
}

export default App;
