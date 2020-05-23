import React, { Component } from 'react';
import Detail from './Detail/Detail';
import classes from './MasterDetail.module.css';

class MasterDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedJob: 0 };
  }

  demoJob1 = {
    id: 0,
    jobTitle: 'Software Engineer',
    company: 'Company 1',
    from: '2018',
    till: 'present',
    description: 'I have done awesome stuff.',
  };

  demoJob2 = {
    id: 1,
    jobTitle: 'Software Engineer',
    company: 'Company 2',
    from: '2015',
    till: '2018',
    description: 'I have done amazing stuff.',
  };

  jobs = [this.demoJob1, this.demoJob2];

  selectJobHandler = (id) => {
    this.setState({ selectedJob: id });
  };

  render() {
    const companyList = this.jobs.map((job) => {
      const listClass = job.id === this.state.selectedJob ? classes.Active : '';
      return (
        <li className={listClass} onClick={() => this.selectJobHandler(job.id)}>
          {job.company}
        </li>
      );
    });

    return (
      <div>
        <ul className={classes.SelectList}>{companyList}</ul>

        <Detail job={this.jobs[this.state.selectedJob]} />
      </div>
    );
  }
}

export default MasterDetail;
