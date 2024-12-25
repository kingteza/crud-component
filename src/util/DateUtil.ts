/* *****************************************************************************
 Copyright (c) 2020-2022 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import dayjs from 'dayjs';
import localeEn from 'dayjs/locale/en';
import localeSi from 'dayjs/locale/si';
import i18next from 'i18next';

// moment.locale('si', {
//   calendar: {
//     sameDay: '[අද] LTS [ට]',
//     nextDay: '[හෙට] LTS [ට]',
//     nextWeek: 'dddd LTS [ට]',
//     lastDay: '[ඊයේ] LTS [ට]',
//     lastWeek: '[පසුගිය] dddd LTS [ට]',
//     sameElse: 'LLLL',
//   },
//   longDateFormat: {
//     LTS: 'HH:mm:ss',
//     LLLL: 'YYYY MMMM D [වැනි] dddd, HH:mm:ss',
//   } as any,
// });

// moment.locale('en', {
//   calendar: {
//     sameDay: '[Today at] LTS',
//     nextDay: '[Tomorrow at] LTS',
//     nextWeek: 'dddd [at] LTS',
//     lastDay: '[Yesterday at] LTS',
//     lastWeek: '[Last] dddd [at] LTS',
//     sameElse: 'LLLL',
//   },
//   longDateFormat: {
//     LTS: 'HH:mm:ss',
//     LLLL: 'dddd, D MMMM YYYY LTS',
//   } as any,
// });

const formatDateTime = (d?: Date) => {
  return dayjs(d).locale(i18next.language).format('YYYY-MM-DD HH:mm');
};

const formatDateTimeWithSecond = (d?: Date) => {
  return dayjs(d).locale(i18next.language).format('YYYY-MM-DD HH:mm:ss');
};

const formatDate = (d?: Date) => {
  return dayjs(d).locale(i18next.language).format('YYYY-MM-DD');
};

const formatTime = (d?: Date, format = 'HH:mm:ss') => {
  return dayjs(d).locale(i18next.language).format(format);
};

export default { formatDateTime, formatDate, formatDateTimeWithSecond, formatTime };
