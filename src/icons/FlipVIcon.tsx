import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";

import type { SVGProps } from "react";
import KIcon from "src/common/icon/KIcon";

function GgEditFlipV(props: Readonly<SVGProps<SVGSVGElement>>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill={props.fill}>
        <path
          fillOpacity={0.5}
          d="M17 18a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-3H5v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3h-2z"
        ></path>
        <path d="M16 5a1 1 0 0 1 1 1v3h2V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v3h2V6a1 1 0 0 1 1-1zm5 8v-2H3v2z"></path>
      </g>
    </svg>
  );
}
const Icon = GgEditFlipV;

export default (props: Readonly<Partial<CustomIconComponentProps>>) => {
  return <KIcon component={Icon} {...props} />;
};
