import React from 'react';
import Aux from './../../../hoc/Auxiliary';
import NavigationItems from './../NavigationItems/NavigationItems';
import classes from './SideDrawer.module.css';
import Button from '../../UI/Button/Button';
import BackDrop from '../../UI/BackDrop/BackDrop';

const sideDrawer = (props) => {
  const resumeHandler = () => {
    window.open(
      'https://firebasestorage.googleapis.com/v0/b/portfolio-bb87c.appspot.com/o/Resume%2FPatrick%20Schadler%20Resume.pdf?alt=media&token=5cb53eb7-285d-4ec9-b745-f23f3ddd8456',
      '_blank'
    );
  };

  let attachedClasses = [classes.SideDrawer, classes.Close];

  if (props.open) {
    attachedClasses = [classes.SideDrawer, classes.Open];
  }

  return (
    <Aux>
      <BackDrop show={props.open} clicked={props.closed} /> 
      <div className={attachedClasses.join(' ')}>
        <nav>
          <NavigationItems clicked={props.scrolledTo} />
          <Button clicked={resumeHandler}>RESUME</Button>
        </nav>
      </div>
    </Aux>
  );
};

export default sideDrawer;
