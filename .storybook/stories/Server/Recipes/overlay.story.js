/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import * as React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import CircularProgress from '@material-ui/core/CircularProgress';

import {
  useCustom,
  Table,
  Header,
  HeaderRow,
  Body,
  Row,
  HeaderCell,
  Cell,
} from '@table-library/react-table-library/table';

import { getData } from '../../server';

export const Absolute = styled.div`
  position: absolute;

  z-index: 5;

  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const BlurryOverlay = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  background: #ffffff;
  filter: opacity(0.8);

  z-index: 10;
`;

const OverlayLoading = () => (
  <>
    <BlurryOverlay />
    <Absolute>
      <CircularProgress />
    </Absolute>
  </>
);

storiesOf('Server Recipes/Overlay', module)
  .addParameters({ component: Table })
  .add('base', () => {
    const [data, setData] = React.useState({
      nodes: [],
    });

    const [isLoading, setLoading] = React.useState(false);

    // initial fetching

    const doGet = React.useCallback(async (params) => {
      setLoading(true);
      setData(await getData(params));
      setLoading(false);
    }, []);

    React.useEffect(() => {
      doGet({});
    }, [doGet]);

    // features

    const [search, setSearch] = React.useState('');

    useCustom('search', data, {
      state: { search },
      onChange: onSearchChange,
    });

    function onSearchChange(action, state) {
      const params = {
        search: state.search,
      };

      doGet(params);
    }

    const handleSearch = (event) => {
      setSearch(event.target.value);
    };

    return (
      <>
        <label htmlFor="search">
          Search by Task:
          <input
            id="search"
            type="text"
            value={search}
            onChange={handleSearch}
          />
        </label>

        <div>
          {isLoading && <OverlayLoading />}

          <Table data={data}>
            {(tableList) => (
              <>
                <Header>
                  <HeaderRow>
                    <HeaderCell>Task</HeaderCell>
                    <HeaderCell>Deadline</HeaderCell>
                    <HeaderCell>Type</HeaderCell>
                    <HeaderCell>Complete</HeaderCell>
                    <HeaderCell>Tasks</HeaderCell>
                  </HeaderRow>
                </Header>

                <Body>
                  {tableList.map((item) => (
                    <Row key={item.id} item={item}>
                      <Cell>{item.name}</Cell>
                      <Cell>
                        {item.deadline.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })}
                      </Cell>
                      <Cell>{item.type}</Cell>
                      <Cell>{item.isComplete.toString()}</Cell>
                      <Cell>{item.nodes?.length}</Cell>
                    </Row>
                  ))}
                </Body>
              </>
            )}
          </Table>
        </div>
      </>
    );
  })
  .add('documentation', () => (
    <ul>
      <li>
        <a href="https://github.com/table-library/react-table-library/tree/master/.storybook/stories">
          Story Code
        </a>
      </li>
    </ul>
  ));
