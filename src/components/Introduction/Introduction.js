import React from 'react';
import classes from './Introduction.module.css';
import BigText from '../UI/BigText/BigText';
import Button from '../UI/Button/Button';
import mailtoHandler from '../../services/mailToHandler';

class Introduction extends React.Component {
  render() {
    return (
      <div className={classes.Introduction}>
        <div className={classes.Heading}>Hi, my name is</div>
        <BigText>Patrick Schadler</BigText>
        <BigText color="Dark">and this is my story.</BigText>
        <div className={classes.Description}>
          I am a head of software development and a senior software engineer based in Leibnitz, Austria specialized
          in building exceptional software products, applications, services and
          everything in between.
        </div>
        <Button clicked={() => mailtoHandler()} size={1.2}>
          Get In Touch
        </Button>
      </div>
    );
  }
}

export default Introduction;
