import React from 'react';
import classes from './Experience.module.css';

class Experience extends React.Component {
  experienceRef = null;

  constructor(props) {
    super(props);
    this.experienceRef = React.createRef();
  }

  scrollToMyRef = () => {
    window.scroll({
      top: this.experienceRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <div className={classes.Experience} ref={this.experienceRef}>
        <h2 className={classes.Heading}>Places I have worked</h2>
        <p className={classes.Description}>Places I have worked</p>
      </div>
    );
  }
}

export default Experience;
