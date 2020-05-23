import React from 'react';
import classes from './Layout.module.css';
import Aux from '../../hoc/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Introduction from '../../components/Introduction/Introduction';
import AboutMe from '../../components/AboutMe/AboutMe';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.aboutMeChild = React.createRef();
    this.state = { openMenu: false };
  }

  scrollToHandler = (index) => {
    this.setState({ openMenu: false });
    switch (index) {
      case 0:
        console.log('About me');
        this.aboutMeChild.current.scrollToMyRef();
        return;
      case 1:
        console.log('Experience');
        return;
      case 2:
        console.log('Work');
        return;
      case 3:
        console.log('Contact');
        return;
      default:
        return;
    }
  };

  openMenuHandler = () => {
    this.setState({ openMenu: true });
  };

  closeMenuHandler = () => {
    this.setState({ openMenu: false });
  };

  render() {
    return (
      <Aux>
        <Toolbar
          clicked={this.scrollToHandler}
          openMenu={this.openMenuHandler}
        />
        <SideDrawer
          open={this.state.openMenu}
          closed={this.closeMenuHandler}
          scrolledTo={this.scrollToHandler}
        />
        <main className={classes.Content}>
          <Introduction />
          <AboutMe ref={this.aboutMeChild} />
        </main>
      </Aux>
    );
  }
}

export default Layout;
