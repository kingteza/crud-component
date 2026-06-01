import { setupI18n } from "./locale";
import {
  CrudComponent,
  CrudDecListView,
  CrudField,
  CrudReportComponent,
  CrudViewer,
  FileUploadProvider,
  ReportCrudFields,
} from ".";
import { useCallback, useEffect, useState } from "react";
import { UploadFile } from "antd/lib";
import { Button, Form } from "antd";

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
const overviewFields: any[] = [
  { type: "text", name: "title", label: "Property Title", grid: { xs: 24 } },
  {
    type: "enum",
    name: "purpose",
    label: "Listing Mode",
    enum: { SALE: "For Sale", RENT: "For Rent" },
    translation: { SALE: "For Sale", RENT: "For Rent" },
  },
  { type: "number", name: "price", label: "Price (LKR)", min: 0 },
  { type: "checkbox", name: "priceNegotiable", label: "Price Negotiable" },
  {
    type: "enum",
    name: "status",
    label: "Status",
    enum: {
      ACTIVE: "Active",
      PENDING: "Pending",
      DRAFT: "Draft",
      REJECTED: "Rejected",
      SOLD: "Sold",
    },
    translation: {
      ACTIVE: "Active",
      PENDING: "Pending",
      DRAFT: "Draft",
      REJECTED: "Rejected",
      SOLD: "Sold",
    },
  },
  {
    type: "enum",
    name: "listingPlan",
    label: "Listing Plan",
    enum: {
      BASIC: "Basic",
      FEATURED: "Featured",
      SUPERCHARGED: "Supercharged",
    },
    translation: {
      BASIC: "Basic",
      FEATURED: "Featured",
      SUPERCHARGED: "Supercharged",
    },
  },
];

class TestUploadProvider extends FileUploadProvider {
  public getInitialPath(): Promise<string> {
    return Promise.resolve("/");
  }
  public async upload(
    file: UploadFile<any>,
    filePath: string
  ): Promise<string> {
    console.log("Uploading file", file, filePath);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Uploaded file", file, filePath);
    // Return a placeholder URL for the component
    return Promise.resolve(
      `https://picsum.photos/id${Math.floor(Math.random() * 1000)}/400/300`
    );
  }

  public delete(filePath: string): Promise<boolean> {
    return Promise.resolve(true);
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

  const [form] = Form.useForm();

  const save = useCallback((value) => {
    console.log(value);
    localStorage.setItem("data", JSON.stringify(value));
  }, []);
  useEffect(() => {
    const value = localStorage.getItem("data");
    console.log("Setting value", value);
    if (value) {
      form.setFieldsValue(JSON.parse(value));
    }
  }, [form]);
  const imageProps = {
    label: "Image",
    fieldClassName: "mb-0",
    provider: new TestUploadProvider(),
    name: "image",
    type: "image",
    updatable: true,
    showSkipCropButton: true,
    asyncUpload: true,
  } as const;

  const fields: ReportCrudFields<Purchase, Purchase>[] = [
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "id",
      name: "id",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "helloId",
      name: "helloId",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "status",
      name: "status",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "test",
      name: "test",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "value",
      name: "value",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "name",
      name: "name",
    },
    {
      report: { searchable: true, alreadySelected: true },
      type: "text",
      label: "name2",
      name: "name2",
    },
    {
      report: { searchable: false, alreadySelected: true },
      type: "text",
      label: "name3",
      name: "name3",
    },
    {
      report: { searchable: false, alreadySelected: true },
      type: "text",
      label: "name4",
      name: "name4",
    },
    {
      report: { searchable: false, alreadySelected: true },
      type: "text",
      label: "name5",
      name: "name5",
    },
    {
      report: { searchable: false },
      type: "text",
      label: "name6",
      name: "name6",
    },
  ];
  return (
    <div className="mx-2">
      <Form layout="vertical" form={form} onFinish={save}>
        <CrudDecListView
          fields={overviewFields}
          data={{
            id: "cmpv685j40001rn1xzfj6de6x",
            userId: "4hjOdvhYWwdS3CfVlg093lOiBGmmthtv",
            orgId: null,
            agentId: null,
            propertyTypeId: "cmpgnfbcx0000gi1xcw2fmv9z",
            propertyType: {
              id: "cmpgnfbcx0000gi1xcw2fmv9z",
              name: "House",
              baseType: "HOUSE",
              category: "RESIDENTIAL",
              hasBeds: true,
              hasBaths: true,
              hasArea: true,
              enabled: true,
              createdAt: "2026-05-22T08:19:33.056Z",
              updatedAt: "2026-05-22T08:19:33.056Z",
            },
            title: "Luxury 4 Bedroom House for Sale in Malabe – Modern",
            images: [
              "https://content.srilankarealestate.lk/public/properties/1780316043359-km7m3m7o2ms.png",
              "https://content.srilankarealestate.lk/public/properties/1780316056464-tqyubgva43.png",
              "https://content.srilankarealestate.lk/public/properties/1780316056464-g3q0qlyrn6v.png",
              "https://content.srilankarealestate.lk/public/properties/1780316056464-ilytihivyq.png",
              "https://content.srilankarealestate.lk/public/properties/1780316056464-klhkr5039og.png",
            ],
            description:
              "<div><strong>Beautiful&nbsp;Family&nbsp;Home&nbsp;in&nbsp;a&nbsp;Prime&nbsp;Residential&nbsp;Area</strong></div><div>Own&nbsp;this&nbsp;stunning&nbsp;<strong>4-bedroom&nbsp;luxury&nbsp;house</strong>&nbsp;located&nbsp;in&nbsp;the&nbsp;highly&nbsp;sought-after&nbsp;area&nbsp;of&nbsp;<strong>Malabe,&nbsp;Sri&nbsp;Lanka</strong>.&nbsp;Designed&nbsp;for&nbsp;modern&nbsp;family&nbsp;living,&nbsp;this&nbsp;property&nbsp;offers&nbsp;spacious&nbsp;interiors,&nbsp;premium&nbsp;finishes,&nbsp;and&nbsp;a&nbsp;peaceful&nbsp;environment&nbsp;while&nbsp;being&nbsp;just&nbsp;minutes&nbsp;away&nbsp;from&nbsp;schools,&nbsp;supermarkets,&nbsp;hospitals,&nbsp;and&nbsp;the&nbsp;Colombo&nbsp;Expressway.</div><div>Property&nbsp;Highlights</div><ul><li><strong>Land&nbsp;Extent:</strong>&nbsp;12&nbsp;Perches</li><li><strong>Floor&nbsp;Area:</strong>&nbsp;3,200&nbsp;Sq.ft</li><li><strong>Bedrooms:</strong>&nbsp;4&nbsp;Spacious&nbsp;Bedrooms</li><li><strong>Bathrooms:</strong>&nbsp;3&nbsp;Modern&nbsp;Bathrooms</li><li><strong>Parking:</strong>&nbsp;Covered&nbsp;parking&nbsp;for&nbsp;3&nbsp;vehicles</li><li><strong>Ownership:</strong>&nbsp;Clear&nbsp;deeds&nbsp;and&nbsp;approved&nbsp;plans</li></ul><div>Features&nbsp;&amp;&nbsp;Amenities</div><ul><li>Elegant&nbsp;living&nbsp;and&nbsp;dining&nbsp;areas&nbsp;with&nbsp;natural&nbsp;lighting</li><li>Modern&nbsp;pantry&nbsp;kitchen&nbsp;with&nbsp;granite&nbsp;countertops</li><li>Master&nbsp;bedroom&nbsp;with&nbsp;attached&nbsp;bathroom&nbsp;and&nbsp;walk-in&nbsp;closet</li><li>Large&nbsp;landscaped&nbsp;garden&nbsp;ideal&nbsp;for&nbsp;family&nbsp;gatherings</li><li>Hot&nbsp;water&nbsp;system&nbsp;and&nbsp;air-conditioned&nbsp;bedrooms</li><li>CCTV&nbsp;security&nbsp;system&nbsp;and&nbsp;automated&nbsp;gate</li><li>Servant&nbsp;room&nbsp;and&nbsp;separate&nbsp;washroom</li><li>Rooftop&nbsp;terrace&nbsp;with&nbsp;scenic&nbsp;views</li></ul><div>Excellent&nbsp;Location</div><div>Conveniently&nbsp;situated&nbsp;within:</div><ul><li>5&nbsp;minutes&nbsp;to&nbsp;Malabe&nbsp;Town</li><li>10&nbsp;minutes&nbsp;to&nbsp;IT&nbsp;Parks&nbsp;and&nbsp;International&nbsp;Schools</li><li>15&nbsp;minutes&nbsp;to&nbsp;Kaduwela&nbsp;Expressway&nbsp;Entrance</li><li>Nearby&nbsp;supermarkets,&nbsp;banks,&nbsp;restaurants,&nbsp;and&nbsp;healthcare&nbsp;facilities</li></ul><div>Investment&nbsp;Opportunity</div><div>Whether&nbsp;you&nbsp;are&nbsp;looking&nbsp;for&nbsp;your&nbsp;dream&nbsp;family&nbsp;residence&nbsp;or&nbsp;a&nbsp;valuable&nbsp;real&nbsp;estate&nbsp;investment,&nbsp;this&nbsp;property&nbsp;offers&nbsp;exceptional&nbsp;value&nbsp;in&nbsp;one&nbsp;of&nbsp;Sri&nbsp;Lanka&#39;s&nbsp;fastest-growing&nbsp;residential&nbsp;areas.</div><div><strong>Price:</strong>&nbsp;LKR&nbsp;58,000,000&nbsp;(Negotiable)</div><div>📞&nbsp;Contact&nbsp;today&nbsp;to&nbsp;arrange&nbsp;a&nbsp;viewing&nbsp;and&nbsp;experience&nbsp;this&nbsp;beautiful&nbsp;property&nbsp;firsthand.</div>",
            purpose: "SALE",
            address: "Malambe",
            district: "Colombo",
            city: "Malambe",
            latitude: 6.907557240383485,
            longitude: 79.9695643229036,
            price: 40000000,
            priceNegotiable: true,
            bedrooms: 4,
            bathrooms: 2,
            landPerches: 2000,
            floorAreaSqft: 2000,
            videoUrl: null,
            status: "ACTIVE",
            listingPlan: "BASIC",
            planExpiresAt: null,
            viewsCount: 0,
            leadsCount: 0,
            slug: "luxury-4-bedroom-house-for-sale-in-malabe-modern-mpv685g0",
            createdAt: "2026-06-01T12:14:38.072Z",
            updatedAt: "2026-06-01T12:14:38.072Z",
            propertyFeatures: [
              {
                id: "cmpv685j60003rn1xb6dh5vk7",
                featureId: "cmpgngznp0001gi1xf457gkrs",
                propertyId: "cmpv685j40001rn1xzfj6de6x",
                value: null,
                values: [],
                feature: {
                  id: "cmpgngznp0001gi1xf457gkrs",
                  name: "AC",
                  label: "AC",
                  label_si: "AC",
                  svg: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjQgMjQiPgoJPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIgLz4KCTxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS41Ij4KCQk8cGF0aCBkPSJNMTguMzQ2IDQuNUg1LjY1NGMtLjYyOSAwLTEuMTU0LjUyNS0xLjE1NCAxLjE1NHY1Ljc3YzAgLjYyOC41MjUgMS4xNTMgMS4xNTQgMS4xNTNoMTIuNjkyYy42MjkgMCAxLjE1NC0uNTI1IDEuMTU0LTEuMTU0di01Ljc3YzAtLjYyOC0uNTI1LTEuMTUzLTEuMTU0LTEuMTUzIiAvPgoJCTxwYXRoIGQ9Ik0xNi42MTUgMTIuNTc3di0yLjMwOGMwLS42MjgtLjUyNS0xLjE1NC0xLjE1My0xLjE1NEg4LjUzN2MtLjYyOCAwLTEuMTUzLjUyNi0xLjE1MyAxLjE1NHYyLjMwOG0tLjU3NyA1Ljc3YzEuNjQgMCAxLjczLTEuNjA0IDEuNzMtMi44ODZtOC42NTQgMi44ODVjLTEuNjQgMC0xLjczLTEuNjAzLTEuNzMtMi44ODVNMTIgMTkuNXYtNC4wMzkiIC8+Cgk8L2c+Cjwvc3ZnPgo=",
                  baseTypes: ["HOUSE"],
                  inputType: "CHECKBOX",
                  options: [],
                  createdAt: "2026-05-22T08:20:51.203Z",
                  updatedAt: "2026-05-22T08:20:51.203Z",
                },
              },
            ],
            owner: {
              id: "4hjOdvhYWwdS3CfVlg093lOiBGmmthtv",
              name: "Panduka Nandara",
              email: "pandukanandara@gmail.com",
              image:
                "https://lh3.googleusercontent.com/a/ACg8ocIV3Ww0Ijj4QcmNgBUrMVXb81f7dH0ccmKzOhGgxXGvC509QabLZA=s96-c",
              role: "user",
              saleCount: 1,
              rentCount: 0,
              activeProperties: 1,
            },
          }}
          descListColumn={{ xs: 1, sm: 2 }}
          layout="horizontal"
        />
        <CrudField {...imageProps} />
        <CrudField
          type="enum"
          name="test"
          label="Test"
          enum={TestEnum}
          multiple
          checkbox
          checkboxGrid={{ xs: 24 }}
        />
        <CrudField
          type="textarea"
          rich
          name="appendix2"
          label="Appendix 2"
          rows={5}
        />
        <CrudField type="color" name="color" label="Color" />
        <CrudField
          type="select"
          name="select"
          label="Select"
          loading
          items={[
            { key: "1", value: "1" },
            { key: "2", value: "2" },
          ]}
        />
        <Button htmlType="submit">Save</Button>
      </Form>
      <CrudReportComponent
        viewable
        fields={fields}
        data={data}
        onDelete={async (e: any) => {
          console.log(e);
        }}
        deletable={(e: any) => {
          return e.id !== "1";
        }}
        updatable={(e: any) => {
          return e.id !== "2";
        }}
        onClickUpdate={(e: any) => {
          console.log(e);
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
