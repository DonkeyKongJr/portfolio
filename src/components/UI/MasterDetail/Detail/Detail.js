import React from 'react';
import classes from './Detail.module.css';

const Detail = (props) => {
  const job = props.job;

  return (
    <div className={classes.Detail}>
      <div>
        {job.jobTitle} @ {job.company}
      </div>
      <div>
        {job.from} - {job.till}
      </div>
      <div>{job.description}</div>
    </div>
  );
};

export default Detail;
