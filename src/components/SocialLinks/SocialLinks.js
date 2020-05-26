import React from 'react';
import classes from './SocialLinks.module.css';

const socialLinks = () => {
  return (
    <div className={classes.SocialLinks}>
      <ul>
        <li>
          <a
            href='mailto:patrick.schadler@gmail.com'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fas fa-paper-plane'></em>
          </a>
        </li>
        <li>
          <a
            href='https://github.com/DonkeyKongJr'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fab fa-github'></em>
          </a>
        </li>
        <li>
          <a
            href='https://www.linkedin.com/in/patrick-schadler-19104750/'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fab fa-linkedin'></em>
          </a>
        </li>
        <li>
          <a
            href='https://www.xing.com/profile/Patrick_Schadler2/cv'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fab fa-xing-square'></em>
          </a>
        </li>
        <li>
          <a
            href='https://patrickschadler.com'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fab fa-wordpress'></em>
          </a>
        </li>
        <li>
          <a
            href='https://www.instagram.com/patrick_visuals/'
            rel='noopener noreferrer'
            target='_blank'
          >
            <em className='fab fa-instagram'></em>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default socialLinks;
