import React from 'react';
import classes from './NavigationItems.module.css';
import NavigationItem from './NavigationItem/NavigationItem';

const navigationItems = (props) => (
  <ul className={classes.NavigationItems}>
    <NavigationItem link='/'>About</NavigationItem>
    <NavigationItem link='/'>Experience</NavigationItem>
    <NavigationItem link='/'>Work</NavigationItem>
    <NavigationItem link='/'>Contact</NavigationItem>
  </ul>
);

export default navigationItems;
