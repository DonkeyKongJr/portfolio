import React from 'react';
import classes from './Experience.module.css';
import Aux from '../../hoc/Aux';
import MasterDetail from '../UI/MasterDetail/MasterDetail';

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
      <Aux>
        <div className={classes.Experience} ref={this.experienceRef}>
          <h2 className={classes.Heading}>Places I have worked</h2>
          <MasterDetail />
        </div>
      </Aux>
    );
  }
}

export default Experience;
