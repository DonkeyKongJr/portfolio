import React from 'react';
import classes from './Toolbar.module.css';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import Button from '../../UI/Button/Button';

const toolbar = (props) => (
  <header className={classes.Toolbar}>
    <div className={classes.Logo}>
      <Logo />
    </div>
    <nav className={classes.DesktopOnly}>
      <NavigationItems />
      <Button>RESUME</Button>
    </nav>
  </header>
);

export default toolbar;
