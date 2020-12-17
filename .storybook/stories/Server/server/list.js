import { TIMEOUT } from './timeout';

const LIST = [
  { id: '1', name: 'Hello', stars: 24, count: 42, light: true },
  { id: '2', name: 'There', stars: 42, count: 24, light: false },
  { id: '3', name: 'Nice', stars: 111, count: 111, light: true },
  { id: '4', name: 'To', stars: 122, count: 133, light: false },
  { id: '5', name: 'Meet', stars: 133, count: 122, light: true },
  { id: '6', name: 'You', stars: 155, count: 155, light: true },
  {
    id: '7',
    name: 'And Welcome To This Table Folks',
    stars: 155,
    count: 155,
    light: true
  }
];

const SORTS = {
  none: array => array,
  name: array => array.sort((a, b) => a.name.localeCompare(b.name)),
  stars: array => array.sort((a, b) => a.stars - b.stars),
  light: array => array.sort((a, b) => a.light - b.light),
  count: array => array.sort((a, b) => a.count - b.count)
};

export const get = ({
  offset = 0,
  limit = 0,
  search = '',
  sortKey = 'none',
  sortReverse = false
}) =>
  new Promise(resolve => {
    let modifiedList = [...LIST];

    // search
    modifiedList = modifiedList.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );

    // sort
    modifiedList = sortReverse
      ? SORTS[sortKey](modifiedList).reverse()
      : SORTS[sortKey](modifiedList);

    // paginated list
    if (offset || limit) {
      setTimeout(
        () =>
          resolve({
            nodes: modifiedList.slice(offset, offset + limit),
            pageInfo: {
              total: modifiedList.length,
              nextOffset: offset + limit
            }
          }),
        TIMEOUT
      );
    } else {
      setTimeout(() => resolve(modifiedList), TIMEOUT);
    }
  });