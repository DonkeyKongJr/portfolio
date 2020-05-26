import React from 'react';
import classes from './Button.module.css';

const button = (props) => {
  let size = 0.9;

  let cssClasses = [classes.Button];

  if (props.size) {
    size = props.size;
  }

  if (props.center) {
    cssClasses.push(classes.Center);
  }

  return (
    <button
      className={cssClasses.join(' ')}
      style={{ fontSize: size + 'rem' }}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default button;
