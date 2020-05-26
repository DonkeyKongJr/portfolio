import React from 'react';
import classes from './Layout.module.css';
import Aux from '../../hoc/Aux';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import Introduction from '../../components/Introduction/Introduction';
import AboutMe from '../../components/AboutMe/AboutMe';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';
import Experience from '../../components/Experience/Experience';
import Contact from '../../components/Contact/Contact';
import Work from '../../components/Work/Work';
import Footer from './../../components/Footer/Footer';
import ScrollToTop from '../../components/Navigation/ScrollToTop/ScrollToTop';
import SocialLinks from '../../components/SocialLinks/SocialLinks';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.aboutMeChild = React.createRef();
    this.experienceChild = React.createRef();
    this.contactChild = React.createRef();
    this.workChild = React.createRef();
    this.state = {
      openMenu: false,
      displayScrollToTop: false,
      toolbarStacked: false,
      toolbarHidden: false,
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.scrollHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  scrollToHandler = (index) => {
    this.setState({ openMenu: false });
    switch (index) {
      case 0:
        this.aboutMeChild.current.scrollToMyRef();
        return;
      case 1:
        this.experienceChild.current.scrollToMyRef();
        return;
      case 2:
        this.workChild.current.scrollToMyRef();
        return;
      case 3:
        this.contactChild.current.scrollToMyRef();
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

  scrollHandler = () => {
    console.log(window.scrollY);
    if (window.scrollY > 35) {
      this.setState({ toolbarStacked: true });
    } else {
      this.setState({ toolbarStacked: false });
    }

    if (window.scrollY >= 225) {
      this.setState({ toolbarHidden: true, displayScrollToTop: true });
    } else {
      this.setState({ toolbarHidden: false, displayScrollToTop: false });
    }
  };

  scrollToTopHandler = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <Aux>
        <Toolbar
          stacked={this.state.toolbarStacked}
          hidden={this.state.toolbarHidden}
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
          <Experience ref={this.experienceChild} />
          <Work ref={this.workChild} />
          <Contact ref={this.contactChild} />
        </main>

        <ScrollToTop
          display={this.state.displayScrollToTop}
          clicked={this.scrollToTopHandler}
        />
        <SocialLinks />
        <Footer />
      </Aux>
    );
  }
}

export default Layout;
