/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import { RcFile } from 'antd/lib/upload';
import imageCompression from 'browser-image-compression';

export type ImageDataReturn = { data: string; type: 'png' | 'jpeg' | 'jpg', width: number, height: number } | null;
class ImageUtl {
  async resizeImage(file: RcFile) {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
    const uid = file.uid;
    return Object.assign(compressedFile, {
      uid,
      lastModifiedDate: new Date(),
    }) as RcFile;
  }

  async getImageData(uriOrBase64: string): Promise<ImageDataReturn> {
    const data = await this.getImageData0(uriOrBase64);
    if (data) {
      const img = new Image();
      img.src = data.data;
      const rst = await new Promise<{ width: number; height: number }>(
        (resolve) => {
          img.onload = function () {
            resolve({
              height: img.height,
              width: img.width,
            });
          };
        },
      );
      Object.assign(data, rst);
      return data;
    } else {
      return null;
    }
  }
  async getImageData0(uriOrBase64: string): Promise<ImageDataReturn> {
    try {
      if (uriOrBase64.startsWith('data:image/')) {
        // It's already in base64 format
        const matches = uriOrBase64.match(/^data:image\/(png|jpeg|jpg);base64,(.*)$/);
        if (!matches) {
          throw new Error('Invalid base64 image data');
        }
        return { data: uriOrBase64, type: matches[1] as 'png' | 'jpeg' | 'jpg' } as any;
      } else {
        // It's a URL, fetch the image data
        const response = await fetch(uriOrBase64);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = function () {
            const base64data = reader.result as string;
            const typeMatch = base64data.match(/^data:image\/(png|jpeg|jpg);base64,/);
            if (typeMatch) {
              resolve({
                data: base64data,
                type: typeMatch[1] as 'png' | 'jpeg' | 'jpg',
              } as any);
            } else {
              reject(new Error('Could not determine image type'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    } catch (e) {
      console.warn(e);
      return null;
    }
  }
}

export default new ImageUtl();
