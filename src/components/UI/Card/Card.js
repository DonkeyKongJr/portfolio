import React from 'react';
import classes from './Card.module.css';

const card = (props) => {
  const technologies = props.project.technologies.map((el) => <li>{el}</li>);

  const github = props.project.gitHub ? (
    <a href={props.project.gitHub} target='_blank' rel='noopener noreferrer'>
      <em className='fab fa-github'></em>
    </a>
  ) : (
    ''
  );

  const urlToPage = props.project.url ? (
    <a href={props.project.url} target='_blank' rel='noopener noreferrer'>
      <em className='fas fa-external-link-alt'></em>
    </a>
  ) : (
    ''
  );

  const backgroundLink = `./../../../assets/images/${props.project.backgroundImage}`;

  return (
    <div
      className={classes.Card}
      style={{ backgroundImage: `url(${backgroundLink})` }}
    >
      <div className={classes.Feature}>{props.project.type}</div>
      <div className={classes.ProjectName}>{props.project.name}</div>
      <div className={classes.Description}>
        <div>{props.project.description}</div>
        <ul>{technologies}</ul>
      </div>
      <div className={classes.Link}>
        {github}
        {urlToPage}
      </div>
    </div>
  );
};

export default card;
