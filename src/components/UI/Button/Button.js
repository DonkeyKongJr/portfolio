import React from 'react';
import classes from './Button.module.css';

const button = (props) => {
  let size = 0.9;

  if (props.size) {
    size = props.size;
  }

  return (
    <button
      className={classes.Button}
      style={{ fontSize: size + 'rem' }}
      onClick={props.clicked}
    >
      {props.children}
    </button>
  );
};

export default button;
