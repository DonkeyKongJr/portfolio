import React from 'react';
import classes from './ScrollToTop.module.css';

const scrollToTop = (props) => {
  const display = props.display;
  let cssClasses = [classes.ScrollToTop];

  if (!display) {
    cssClasses.push(classes.Hidden);
  }

  return (
    <div role='button' className={cssClasses.join(' ')} onClick={props.clicked}>
      ^
    </div>
  );
};

export default scrollToTop;
