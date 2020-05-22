import React from 'react';
import classes from './Layout.module.css';
import Aux from '../../hoc/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Introduction from '../../components/UI/Introduction/Introduction';

const layout = () => {
  return (
    <Aux>
      <Toolbar></Toolbar>
      <main className={classes.Content}>
        <Introduction />
      </main>
    </Aux>
  );
};

export default layout;
