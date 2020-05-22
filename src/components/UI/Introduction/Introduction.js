import React from 'react';
import classes from './Introduction.module.css';
import Aux from '../../../hoc/Aux';
import BigText from '../BigText/BigText';

const contentSection = (props) => (
  <div className={classes.Introduction}>
    <div className={classes.Heading}>Hi, my name is</div>
    <BigText>Patrick Schadler</BigText>
    <BigText color='Dark'>and this is my story.</BigText>
    <div className={classes.Description}>
      I am a senior software engineer based in Leibnitz, Austria specialized in
      building exceptional software products, applications, services and
      everything in between.
    </div>
  </div>
);

export default contentSection;
