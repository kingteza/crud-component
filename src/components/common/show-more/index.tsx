/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import ReactShowMoreText, { ReactShowMoreTextProps } from 'react-show-more-text';
import "./style.css";

// Create a wrapper component that fixes the type issues
export const ShowMore: React.FC<ReactShowMoreTextProps> = (props) => {
  // @ts-expect-error - Known issue with react-show-more-text types
  return <ReactShowMoreText {...props} />;
};

// Export the props type for consumers
export type { ReactShowMoreTextProps };

export default ShowMore;
