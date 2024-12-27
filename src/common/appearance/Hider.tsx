/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { FC } from 'react';

const Hider: FC<{ children: any; hide: boolean }> = ({ children, hide }) => {
  return <div className={hide ? 'd-none' : ''}>{children}</div>;
};

export default Hider;
