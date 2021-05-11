import { Pipe, PipeTransform } from '@angular/core';
import { filter, map, flattenDeep } from 'lodash';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(
    items: Array<any>,
    filters: Array<any>,
    searchText: string,
  ): Array<any> {
   
    if (!searchText) {
      return items;
    }
    const formattedSearchText = searchText.toLocaleLowerCase();

    const filteredItems = filter(items || [], (item) => {
      const valuesArray = flattenDeep(
        map(filters || [], (filter) => {
          return item[filter]?.value && item[filter]?.value?.toLocaleLowerCase()
            ? item[filter]?.value?.toLocaleLowerCase()
            : [];
        }),
      );
      const filteredValueArr = filter(valuesArray || [], (valueItem) => {
        if (valueItem?.indexOf(formattedSearchText) >= 0) {
          return valueItem;
        }
      });
      console.log({valuesArray, filteredValueArr})
    
      if (filteredValueArr?.length) {
        return item;
      }
    });
   

    return filteredItems;

    // return items.filter((item) => {
    //   const notMatchingField = Object.keys(filter).find(
    //     (key) => item[key] !== filter[key],
    //   );

    //   return !notMatchingField; // true if matches all fields
    // });
  }
}
