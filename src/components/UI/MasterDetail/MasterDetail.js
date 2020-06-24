import React, { Component } from 'react';
import Detail from './Detail/Detail';
import classes from './MasterDetail.module.css';
import jobs from './../../../data/jobs.json';

class MasterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedJob: 0 };
  }

  selectJobHandler = (id) => {
    this.setState({ selectedJob: id });
  };

  render() {
    const companyList = jobs.map((job) => {
      const listClass = job.id === this.state.selectedJob ? classes.Active : '';
      return (
        <li
          className={listClass}
          key={job.id}
          onClick={() => this.selectJobHandler(job.id)}
        >
          {job.company}
        </li>
      );
    });

    return (
      <div>
        <div className={classes.List}>
          <ul className={classes.SelectList}>{companyList}</ul>
        </div>
        <Detail job={jobs[this.state.selectedJob]} />
      </div>
    );
  }
}

export default MasterDetail;
