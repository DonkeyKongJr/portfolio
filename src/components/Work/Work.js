import React from 'react';
import classes from './Work.module.css';
import Card from '../UI/Card/Card';
import projects from './../../data/projects.json';

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
    const cards = projects.map((p) => <Card project={p} />);

    return (
      <div className={classes.Work} ref={this.workRef}>
        <h2 className={classes.Heading}>Some Projects I have Worked On</h2>
        {cards}
      </div>
    );
  }
}

export default Work;
