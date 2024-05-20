import { LiteralObject } from '@nestjs/common/cache';

export function returnPaging(
  data: LiteralObject[],
  totalItems: number,
  params: LiteralObject,
  metadata = {},
) {
  const totalPages = Math.ceil(totalItems / params.pageSize);
  return {
    paging: true,
    hasMore: params.pageIndex < totalPages,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.pageSize),
    totalItems,
    data,
    ...metadata,
  };
}

export function returnLoadMore(
  data: LiteralObject[],
  params: LiteralObject,
  metadata = {},
) {
  return {
    paging: true,
    hasMore: data.length === params.pageSize,
    data,
    pageSize: params.pageSize,
    ...metadata,
  };
}

export function assignLoadMore(params: LiteralObject) {
  params.pageSize = Number(params.pageSize) || 10;

  return params;
}

export function assignPaging(params: LiteralObject) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.pageSize = Number(params.pageSize) || 10;
  params.skip = (params.pageIndex - 1) * params.pageSize;

  return params;
}

/**
 * @param num Number want to check
 * @param min minimum value
 * @param max maximum value
 * @returns return is number between range from min to max value.
 *
 * @example
 * isBetween(10, 5, 20) // true;
 * isBetween(10, 15, 20) // false
 */
type numberOrStringNumber = string | number;
export const isBetween = (
  num: numberOrStringNumber,
  min: numberOrStringNumber,
  max: numberOrStringNumber,
) => {
  try {
    if (Number(min) > Number(max)) return false;

    if (Number(num) > Number(max)) return false;
    if (Number(num) < Number(min)) return false;

    return true;
  } catch (error) {
    return false;
  }
};

// "When i wrote this code, only me and God knew how it works. Now only God knows..." - Nguyen Duy Truong said.
// export function reformatFileLanguage(
//   data: Array<any>,
//   params: { code?: string; env: string },
// ) {
//   const groupByLanguageCode = convertToObject(data, 'code');

//
//   const languageObject = Object.keys(groupByLanguageCode).reduce(
//     (acc: any, cur) => {
//       acc[cur] = groupByLanguageCode[cur].reduce((ac, cu) => {
//         ac[cu.key] = cu.value;
//         return ac;
//       }, {});
//       return acc;
//     },
//     {},
//   );

//
//   const result: any = flatten.unflatten(languageObject);
//   if (params.code) {
//     return result[params.code];
//   }
//   return result;
// }

export function convertToObject(
  data: Array<Object>,
  key: string,
): { [key: string]: Array<any> } {
  const result: any = {};
  for (let i = 0; i < data.length; i++) {
    const element: any = data[i];
    const keyEl = element[key];
    if (!result[keyEl]) {
      result[keyEl] = [];
    }
    delete element[key];
    result[keyEl].push(element);
  }
  return result;
}

export function handleOutputPaging(
  data: any,
  totalItems: number,
  params: any,
  metadata = {},
) {
  return {
    data,
    totalItems,
    pageIndex: params.pageIndex,
    totalPages: Math.ceil(totalItems / params.take),
    hasMore: data ? (data.length < params.take ? false : true) : false,
    ...metadata,
  };
}

export function handleInputPaging(params: any) {
  params.pageIndex = Number(params.pageIndex) || 1;
  params.take = Number(params.take) || 10;
  params.skip = (params.pageIndex - 1) * params.take;
  return params;
}

export function substrContent(content: string, index: number) {
  return content.length > index ? content.substring(0, index) + '...' : content;
}
