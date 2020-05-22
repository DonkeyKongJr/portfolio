import React from 'react';
import classes from './NavigationItem.module.css';

const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
    <a
      href={props.link}
      className={props.active ? classes.active : null}
      onClick={props.clicked}
    >
      {props.children}
    </a>
  </li>
);

export default navigationItem;
