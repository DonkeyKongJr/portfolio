import React from 'react';
import classes from './Layout.module.css';
import Aux from '../../hoc/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';

const layout = () => {
  return (
    <Aux>
      <Toolbar></Toolbar>
      <div className={classes.Layout}>Layout</div>;
    </Aux>
  );
};

export default layout;
