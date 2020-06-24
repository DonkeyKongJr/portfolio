import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem stacked={props.stacked} clicked={() => props.clicked(0)}>
      About
    </NavigationItem>
    <NavigationItem stacked={props.stacked} clicked={() => props.clicked(1)}>
      Experience
    </NavigationItem>
    <NavigationItem stacked={props.stacked} clicked={() => props.clicked(2)}>
      Work
    </NavigationItem>
    <NavigationItem stacked={props.stacked} clicked={() => props.clicked(3)}>
      Contact
    </NavigationItem>
  </ul>
);

export default navigationItems;
