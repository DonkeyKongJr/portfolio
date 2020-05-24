import React from 'react';
import classes from './Work.module.css';

class Work extends React.Component {
  workRef = null;

  constructor(props) {
    super(props);
    this.workRef = React.createRef();
  }

  scrollToMyRef = () => {
    window.scroll({
      top: this.workRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <div className={classes.Contact} ref={this.workRef}>
        <h2 className={classes.Heading}>Some Projects I have Worked On</h2>
        <p className={classes.Description}>
          Stay stuned for a full list of awesome projects.
        </p>
      </div>
    );
  }
}

export default Work;
