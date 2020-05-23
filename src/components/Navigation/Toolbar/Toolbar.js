import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import Button from '../../UI/Button/Button';
import DrawerToggle from '../SideDrawer/DrawerToggle/DrawerToggle';

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <div className={classes.Logo}>
      <Logo />
    </div>
    <DrawerToggle clicked={props.openMenu} />
    <nav className={classes.DesktopOnly}>
      <NavigationItems clicked={props.clicked} />
      <Button>RESUME</Button>
    </nav>
  </header>
);

export default toolbar;
