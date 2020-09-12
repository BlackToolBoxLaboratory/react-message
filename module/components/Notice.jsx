import React from 'react';
import classnames from 'classnames';

const Notice = (props) => {
  const {children, className, type, context} = props;

  const classList = [`notice-type-${type}`];
  return (
    <div className={classnames("btb-react-notice", className, classList)}>
      {context}
      {children}
    </div>
  );
};

export default Notice;