/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import React from 'react';
import { storiesOf } from '@storybook/react';

import {
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell
} from '@table-library/react-table-library/lib/table';

import { get } from '../server/list';

storiesOf('07. Server Recipes/ 04. Debounce', module)
  .addParameters({ component: Table })
  .add('default', () => {
    const [search, setSearch] = React.useState('');

    const handleSearch = event => {
      setSearch(event.target.value);
    };

    const [list, setList] = React.useState([]);

    // initial fetching

    const doGet = React.useCallback(async params => {
      setList(await get(params));
    }, []);

    React.useEffect(() => {
      doGet({});
    }, [doGet]);

    // server-side search

    const timeout = React.useRef();

    const handleTableStateChange = React.useCallback(
      (type, tableState, action) => {
        console.log(type, tableState, action);
        const SERVER_SIDE_OPERATIONS = [];
        const SERVER_SIDE_OPERATIONS_DEBOUNCED = ['mySearch'];

        const params = {
          search: tableState.mySearch
        };

        if (SERVER_SIDE_OPERATIONS.includes(type)) {
          doGet(params);
        }

        if (SERVER_SIDE_OPERATIONS_DEBOUNCED.includes(type)) {
          if (timeout.current) clearTimeout(timeout.current);

          timeout.current = setTimeout(() => doGet(params), 1500);
        }
      },
      []
    );

    return (
      <>
        <label htmlFor="search">
          Search by name:
          <input id="search" type="text" onChange={handleSearch} />
        </label>

        <Table
          list={list}
          server={{
            search: true
          }}
          externalTableState={{
            mySearch: search
          }}
          onTableStateChange={handleTableStateChange}
        >
          {tableList => (
            <>
              <Header>
                <HeaderRow>
                  <HeaderCell>Name</HeaderCell>
                  <HeaderCell>Stars</HeaderCell>
                  <HeaderCell>Light</HeaderCell>
                  <HeaderCell>Count</HeaderCell>
                </HeaderRow>
              </Header>

              <Body>
                {tableList.map(item => (
                  <Row key={item.id} item={item}>
                    {tableItem => (
                      <React.Fragment key={tableItem.id}>
                        <Cell>{tableItem.name}</Cell>
                        <Cell>{tableItem.stars}</Cell>
                        <Cell>{tableItem.light.toString()}</Cell>
                        <Cell>{tableItem.count}</Cell>
                      </React.Fragment>
                    )}
                  </Row>
                ))}
              </Body>
            </>
          )}
        </Table>
      </>
    );
  });