import { EmailAddress } from '../environment';

const mailtoHandler = () => {
  const email = EmailAddress;
  const subject = 'subject=Hi Patrick';
  const body = 'body=Hi Patrick, I just saw your portfolio and ....';

  const mailToText = [subject, body].join('&');

  window.location = `mailto:${email}?${mailToText}`;
};

export default mailtoHandler;
