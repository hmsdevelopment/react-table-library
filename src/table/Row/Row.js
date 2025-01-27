import * as React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import { RowContainer } from '@table-library/react-table-library/common/components/Row';
import { isRowClick } from '@table-library/react-table-library/common/util/isRowClick';
import { ThemeContext } from '@table-library/react-table-library/common/context/Theme';
import { SelectContext } from '@table-library/react-table-library/common/context/Select';
import { TreeContext } from '@table-library/react-table-library/common/context/Tree';

import { useConsumeRowLayout } from '@table-library/react-table-library/resize/useConsumeRowLayout';

import { useDoubleClick } from './useDoubleClick';

const getRowProps = (features, props) =>
  Object.values(features)
    .filter(Boolean)
    .filter((feature) => feature._getRowProps)
    .map((feature) => feature._getRowProps(props, features));

const evaluateProps = (rowPropsByFeature, onSingleClick) => {
  const {
    themeByFeature,
    classNamesByFeature,
    onClickByFeature,
  } = rowPropsByFeature.reduce(
    (acc, value) => {
      const { theme, className, onClick } = value;

      const mergedTheme = `
        ${acc.themeByFeature}
        ${theme}
      `;

      const mergedClassName = cs(acc.classNamesByFeature, className);

      const mergedOnClick = (node, event) => {
        onClick(node, event);
        acc.onClickByFeature(node, event);
      };

      return {
        ...acc,
        themeByFeature: mergedTheme,
        classNamesByFeature: mergedClassName,
        onClickByFeature: mergedOnClick,
      };
    },
    {
      themeByFeature: '',
      classNamesByFeature: '',
      onClickByFeature: (node, event) => {
        if (onSingleClick && isRowClick(event)) {
          onSingleClick(node, event);
        }
      },
    }
  );

  return {
    themeByFeature,
    classNamesByFeature,
    onClickByFeature,
  };
};

const Row = (props) => {
  const {
    item,
    className,
    disabled,
    onClick,
    onDoubleClick,
    children,
    ...rest
  } = props;

  const select = React.useContext(SelectContext);
  const tree = React.useContext(TreeContext);

  const features = {
    select,
    tree,
    // others
  };

  const rowPropsByFeature = getRowProps(features, props);

  const theme = React.useContext(ThemeContext);

  const {
    themeByFeature,
    classNamesByFeature,
    onClickByFeature,
  } = evaluateProps(rowPropsByFeature, onClick);

  const ref = React.useRef();

  useDoubleClick(ref, onClickByFeature, onDoubleClick, item);

  useConsumeRowLayout(ref, '.td');

  return (
    <RowContainer
      {...rest}
      role="row"
      className={cs('tr', 'tr-body', classNamesByFeature, className, {
        disabled,
        clickable: onClickByFeature || onDoubleClick,
      })}
      css={`
        ${themeByFeature}
        ${theme?.BaseRow}
        ${theme?.Row}
      `}
      ref={ref}
    >
      {children}
    </RowContainer>
  );
};

Row.propTypes = {
  item: PropTypes.objectOf(PropTypes.any),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  onDoubleClick: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

export { Row };
