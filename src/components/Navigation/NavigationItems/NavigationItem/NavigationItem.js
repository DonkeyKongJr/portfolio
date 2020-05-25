import React from 'react';
import classes from './NavigationItem.module.css';

const navigationItem = (props) => {
  const stacked = props.stacked;

  return (
    <li className={classes.NavigationItem}>
      <a
        style={{
          padding: stacked ? '18px 4px' : '28px 4px',
          transition: '0.5s ease-in',
        }}
        href={props.link}
        className={props.active ? classes.active : null}
        onClick={props.clicked}
      >
        {props.children}
      </a>
    </li>
  );
};

export default navigationItem;
