import * as React from 'react';
import { css } from 'styled-components';
import cs from 'classnames';
import PropTypes from 'prop-types';

import * as COLORS from '@colors';
import { Row } from '@table';

import { SELECT_TYPES } from './config';

const useRowSelect = ({
  id,
  isSelected,
  onSelectById,
  selectType = SELECT_TYPES.RowSelectClick,
  className
}) => {
  const rowSelectTheme = css`
    &.selected-row {
      color: ${COLORS.FONT_PRIMARY};
      font-weight: bold;

      background-color: ${COLORS.ROW_SELECTED};
    }

    &.selectable-row {
      cursor: pointer;
    }
  `;

  const rowSelectClassName = cs('row-select', className, {
    'selectable-row': selectType === SELECT_TYPES.RowSelectClick,
    'selected-row': isSelected
  });

  const handleClick = event => {
    if (event.target.tagName !== 'DIV') return;

    if (selectType === SELECT_TYPES.RowSelectClick) {
      onSelectById(id);
    }
  };

  return {
    theme: rowSelectTheme,
    className: rowSelectClassName,
    handleClick
  };
};

const RowSelect = React.memo(
  ({
    id,
    item,
    isSelected,
    onSelectById,
    selectType,
    className,
    children,
    ...passThrough
  }) => {
    const {
      theme: rowSelectTheme,
      className: rowSelectClassName,
      handleClick
    } = useRowSelect({
      id,
      isSelected,
      onSelectById,
      selectType,
      className
    });

    return (
      <Row
        item={item}
        theme={rowSelectTheme}
        className={rowSelectClassName}
        onClick={handleClick}
        {...passThrough}
      >
        {children(item)}
      </Row>
    );
  }
);

RowSelect.SELECT_TYPES = SELECT_TYPES;

RowSelect.propTypes = {
  id: PropTypes.string,
  item: PropTypes.shape(PropTypes.any),
  isSelected: PropTypes.bool,
  onSelectById: PropTypes.func,
  selectType: PropTypes.oneOf(Object.values(SELECT_TYPES)),
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func
  ])
};

export { RowSelect, useRowSelect, SELECT_TYPES };
