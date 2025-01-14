import * as React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';

import { HeaderCellContainer } from '@table-library/react-table-library/common/components/Cell';
import { ThemeContext } from '@table-library/react-table-library/common/context/Theme';
import {
  resizerStyle,
  useResize,
} from '@table-library/react-table-library/resize';

const HeaderCell = ({
  index,
  cellKey,
  className,
  hide,
  pin,
  stiff,
  resize,
  children,
  ...rest
}) => {
  const theme = React.useContext(ThemeContext);

  const cellRef = React.useRef();
  const { resizeRef } = useResize(cellRef, index);

  return (
    <HeaderCellContainer
      {...rest}
      role="columnheader"
      data-cell-key={cellKey || index}
      data-resize-min-width={resize?.minWidth || 75}
      className={cs('th', className, {
        stiff,
        resize,
        pin,
      })}
      css={`
        ${theme?.BaseCell}
        ${theme?.HeaderCell}
      `}
      ref={cellRef}
    >
      <div>{children}</div>
      {resize && <span ref={resizeRef} css={resizerStyle(resize)} />}
    </HeaderCellContainer>
  );
};

HeaderCell.propTypes = {
  index: PropTypes.number,
  cellKey: PropTypes.string,
  className: PropTypes.string,
  hide: PropTypes.bool,
  pin: PropTypes.bool,
  stiff: PropTypes.bool,
  resize: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      minWidth: PropTypes.number,
    }),
  ]),
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.func,
  ]),
};

export { HeaderCell };
