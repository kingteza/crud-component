/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

/**
 * This is the common type for dialog props
 */
 export interface DialogProps<U = {}, CLOSE = boolean | undefined, OPEN = CLOSE> {
    open: OPEN | undefined;
    // Return null if is close using close button
    onCloseMethod: (val: CLOSE) => void;
    updatingItem?: U;
  }
  