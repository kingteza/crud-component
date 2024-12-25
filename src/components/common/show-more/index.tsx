/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import './style.css';

import React, { FC, PropsWithChildren } from 'react';
import ReactShowMoreText from 'react-show-more-text';

const ShowMore: FC<PropsWithChildren & {lines?: number}> = ({ children, lines = 3 }) => {
  return (
    <ReactShowMoreText
      /* Default options */
      lines={lines}
      more="Show more"
      less="Show less"
      className="content-css"
      anchorClass="show-more-less-clickable"
      width={280}
      truncatedEndingComponent={'... '}
    >
      {children}
    </ReactShowMoreText>
  );
};

export default ShowMore;
