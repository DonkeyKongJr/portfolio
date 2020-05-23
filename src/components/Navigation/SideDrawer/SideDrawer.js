import React from 'react';
import Aux from './../../../hoc/Aux';
import NavigationItems from './../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Button from '../../UI/Button/Button';
import BackDrop from '../../UI/BackDrop/BackDrop';

const sideDrawer = (props) => {
  let attachedClasses = [classes.SideDrawer, classes.Close];

  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      <BackDrop show={props.open} clicked={props.closed} />
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
