import React from 'react';
import classes from './AboutMe.module.css';

class AboutMe extends React.Component {
  aboutMeRef = null;

  constructor(props) {
    super(props);
    this.aboutMeRef = React.createRef();
  }

  mailtoHandler = () => {
    const email = 'patrick.schadler@gmail.com';
    const subject = 'subject=Hi Patrick';
    const body = 'body=Hi Patrick, I just saw your portfolio and ....';

    const mailToText = [subject, body].join('&');

    window.location = `mailto:${email}?${mailToText}`;
  };

  scrollToMyRef = () => {
    window.scroll({
      top: this.aboutMeRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <div className={classes.AboutMe} ref={this.aboutMeRef}>
        <h2 className={classes.Heading}>About Me</h2>
        <p className={classes.Description}>
          Hello, I am Patrick. A senior software engineer from Austria.
        </p>
        <p className={classes.Description}>
          As a highly-motivated and results orientated software engineer I have
          a proven track record of providing extraordinarily levels of software
          quality, service and consulting to a broad range of customers from
          small, medium and large sizes.
        </p>
        <p className={classes.Description}>
          I am always looking to secure and expand a responsible position in an
          IT organization, where I can bring immediate and strategic value and
          develop current skillset further and beyond the actual status quo. I
          love working with cutting-edge technology and playing with the latest
          gadgets.{' '}
        </p>
      </div>
    );
  }
}

export default AboutMe;
