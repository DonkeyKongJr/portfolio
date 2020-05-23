import React from 'react';
import Aux from './../../../hoc/Aux';
import NavigationItems from './../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Button from '../../UI/Button/Button';

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];

  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      <div className={attachedClasses.join(' ')}>
        <nav>
          <NavigationItems />
          <Button>RESUME</Button>
        </nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;
