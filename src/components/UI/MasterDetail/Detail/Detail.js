import React from 'react';
import classes from './Detail.module.css';

const Detail = (props) => {
  const job = props.job;

  return (
    <div className={classes.Detail}>
      <div className={classes.Heading}>
        {job.jobTitle} @{' '}
        <a href={job.link} target='_blank' className={classes.CompanyName}>
          {job.company}
        </a>
      </div>
      <div className={classes.Time}>
        {job.from} - {job.till}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: job.description }}
        className={classes.Description}
      ></div>
    </div>
  );
};

export default Detail;
