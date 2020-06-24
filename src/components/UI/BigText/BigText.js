import React from 'react';
import classes from './BigText.module.css';

const bigText = (props) => {
  let classNames = classes.BigText;

  if (props.color) {
    classNames += ' ' + classes[props.color];
  }

  return <div className={classNames}>{props.children}</div>;
};

export default bigText;
