import React from 'react';
import classes from './SocialLinks.module.css';
import { EmailAddress } from '../../environment';

const socialLinks = () => {
  const emailMailTo = `mailto:${EmailAddress}`;
  return (
    <div className={classes.SocialLinks}>
      <ul>
        <li>
          <a href={emailMailTo} rel="noopener noreferrer" target="_blank">
            <em className="fas fa-paper-plane"></em>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/DonkeyKongJr"
            rel="noopener noreferrer"
            target="_blank"
          >
            <em className="fab fa-github"></em>
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/%F0%9F%91%A8%F0%9F%8F%BC%E2%80%8D%F0%9F%92%BB-patrick-schadler-19104750/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <em className="fab fa-linkedin"></em>
          </a>
        </li>
        <li>
          <a
            href="https://www.xing.com/profile/Patrick_Schadler2/cv"
            rel="noopener noreferrer"
            target="_blank"
          >
            <em className="fab fa-xing-square"></em>
          </a>
        </li>
        <li>
          <a
            href="https://patrickschadler.com"
            rel="noopener noreferrer"
            target="_blank"
          >
            <em className="fab fa-wordpress"></em>
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/patrick_visuals/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <em className="fab fa-instagram"></em>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default socialLinks;
