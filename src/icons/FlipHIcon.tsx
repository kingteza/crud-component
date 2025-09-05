import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import KIcon from "src/common/icon/KIcon";

import type { SVGProps } from "react";

function GgEditFlipH(props: Readonly<SVGProps<SVGSVGElement>>) {
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
          d="M18 7a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-3v2h3a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3h-3v2z"
        ></path>
        <path d="M13 3h-2v18h2zM5 8a1 1 0 0 1 1-1h3V5H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h3v-2H6a1 1 0 0 1-1-1z"></path>
      </g>
    </svg>
  );
}
const Icon = GgEditFlipH;

export default (props: Partial<CustomIconComponentProps>) => {
  return <KIcon component={Icon} {...props} />;
};
