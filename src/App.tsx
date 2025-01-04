import { setupI18n } from "./locale";
import { CrudComponent } from ".";

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
};

function App() {
  return (
    <div className="">
      <CrudComponent<Purchase>
        data={[{ status: PurchaseStatus.CANCELLED, test: TestEnum.TEST, value: "test" }]}
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
        ]}
      />
    </div>
  );
}

export default App;
