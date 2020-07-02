import React from 'react';
import classes from './Work.module.css';
import Card from '../UI/Card/Card';
import projects from './../../data/projects.json';
import Button from './../UI/Button/Button';

class Work extends React.Component {
  workRef = null;

  constructor(props) {
    super(props);
    this.workRef = React.createRef();
    this.state = { showMore: false };
  }

  scrollToMyRef = () => {
    window.scroll({
      top: this.workRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  showMoreHandler = () => {
    this.setState((prevState) => {
      return { showMore: !prevState.showMore };
    });
  };

  render() {
    let cards = projects.map((p) => <Card key={p.name} project={p} />);

    if (!this.state.showMore) {
      cards = cards.slice(0, 3);
    }

    const buttonText = this.state.showMore ? 'Show Less' : 'Show More';

    return (
      <div className={classes.Work} ref={this.workRef}>
        <h2 className={classes.Heading}>Some Projects I have Worked On</h2>
        {cards}
        <Button clicked={this.showMoreHandler} className={classes.ShowMore}>
          {buttonText}
        </Button>
      </div>
    );
  }
}

export default Work;
