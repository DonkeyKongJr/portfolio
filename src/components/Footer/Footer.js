import React from 'react';
import classes from './Footer.module.css';

const footer = () => {
  return (
    <div className={classes.Footer}>
      <a
        href='https://github.com/DonkeyKongJr/portfolio'
        target='_blank'
        rel='noopener noreferrer'
      >
        <div>Designed & Built by Patrick Schadler</div>
        <span>schadler.dev v1 @ GitHub</span>
      </a>
    </div>
  );
};

export default footer;
