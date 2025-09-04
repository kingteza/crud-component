import { setupI18n } from "./locale";
import { CrudComponent } from ".";
import { useState } from "react";
import BuildingAndFloorScreen from "./Play";

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
};

function App() {
  const [data, setData] = useState<Purchase[]>([
    {
      id: "1",
      status: PurchaseStatus.CANCELLED,
      test: TestEnum.TEST,
      value: "test",
      name: "test",
    },
  ]);

  return (
    <div className="">
      <BuildingAndFloorScreen />
      <CrudComponent<Purchase>
        data={data}
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
