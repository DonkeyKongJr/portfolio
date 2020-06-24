import React from 'react';
import pslogo from './../../assets/images/ps-logo.png';
import classes from './Logo.module.css';

const logo = () => (
  <div className={classes.Logo}>
    <img src={pslogo} alt='My Resume' />
  </div>
);

export default logo;
