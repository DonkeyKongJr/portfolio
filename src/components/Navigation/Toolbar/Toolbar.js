import React from "react";
import classes from "./Toolbar.module.css";
import NavigationItems from "../NavigationItems/NavigationItems";
import Logo from "../../Logo/Logo";
import Button from "../../UI/Button/Button";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const toolbar = (props) => {
  const resumeHandler = () => {
    window.open(
      "https://firebasestorage.googleapis.com/v0/b/portfolio-bb87c.appspot.com/o/Resume%2FPatrick%20Schadler%20Resume.pdf?alt=media&token=916c64b3-ddd9-4180-b373-24f5cf416284",
      "_blank"
    );
  };

  const cssClasses = [classes.Toolbar];

  if (props.stacked) {
    cssClasses.push(classes.Stacked);
  }

  if (props.hidden) {
    cssClasses.push(classes.Hidden);
  }

  return (
    <header className={cssClasses.join(" ")}>
      <div className={classes.Logo}>
        <Logo />
      </div>
      <DrawerToggle clicked={props.openMenu} />
      <nav className={classes.DesktopOnly}>
        <NavigationItems stacked={props.stacked} clicked={props.clicked} />
        <Button clicked={resumeHandler}>RESUME</Button>
      </nav>
    </header>
  );
};

export default toolbar;
