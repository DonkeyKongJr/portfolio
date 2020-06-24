import React from 'react';
import classes from './Contact.module.css';
import BigText from '../UI/BigText/BigText';
import Button from './../UI/Button/Button';

class Contact extends React.Component {
  contactRef = null;

  constructor(props) {
    super(props);
    this.contactRef = React.createRef();
  }

  mailtoHandler = () => {
    const email = 'psch@hey.com';
    const subject = 'subject=Hi Patrick';
    const body = 'body=Hi Patrick, I just saw your portfolio and ....';

    const mailToText = [subject, body].join('&');

    window.location = `mailto:${email}?${mailToText}`;
  };

  scrollToMyRef = () => {
    window.scroll({
      top: this.contactRef.current.offsetTop,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <div className={classes.Contact} ref={this.contactRef}>
        <h2 className={classes.Heading}>Next Steps?</h2>
        <BigText>Get In Touch</BigText>
        <p className={classes.Description}>
          My inbox is always open for new connections, any tips on how to
          improve and for any new opportunities.
        </p>
        <p className={classes.Description}>Drop me a message or just say hi.</p>
        <Button clicked={() => this.mailtoHandler()} size={1.2}>
          Get In Touch
        </Button>
      </div>
    );
  }
}

export default Contact;
