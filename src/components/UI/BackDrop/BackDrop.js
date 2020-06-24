import React from 'react';
import classes from './BackDrop.module.css';

const backDrop = (props) =>
  props.show ? (
    <div className={classes.Backdrop} onClick={props.clicked}></div>
  ) : null;

export default backDrop;
