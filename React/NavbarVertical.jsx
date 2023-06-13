import React, {Fragment, useContext} from "react";
import {Link, useLocation} from "react-router-dom";
import {useMediaQuery} from "react-responsive";
import {ListGroup, Accordion, Card, Image, Badge, useAccordionButton, AccordionContext} from "react-bootstrap";
import SimpleBar from "simplebar-react";
import "simplebar/dist/simplebar.min.css";
import {DashboardMenu} from "./DashboardRoutes";
import PropTypes from "prop-types";
import debug from "sabio-debug";
import monefilgo from "../../assets/images/brand/logo/monefilogo.png";

const NavbarVertical = props => {
  const location = useLocation();
  const _logger = debug.extend("NavbarVertical");

  _logger(props, "this is props");

  const CustomToggle = ({children, eventKey, icon}) => {
    const {activeEventKey} = useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(eventKey);
    const isCurrentEventKey = activeEventKey === eventKey;
    return (
      <li className="nav-item">
        <Link className="nav-link " onClick={decoratedOnClick} to="#!" data-bs-toggle="collapse" data-bs-target="#navDashboard" aria-expanded={isCurrentEventKey ? true : false} aria-controls="navDashboard">
          {icon ? <i className={`nav-icon fe fe-${icon} me-2`}></i> : ""} {children}
        </Link>
      </li>
    );
  };

  const generateLink = item => {
    return (
      <Link className={`nav-link ${location.pathname === item.link ? "active" : ""}`} to={item.link} onClick={() => (isMobile ? props.onClick(!props.isMenuOpened) : props.isMenuOpened)}>
        {item.name}
        {""}
        {item.badge ? (
          <Badge className="ms-1" bg={item.badgecolor ? item.badgecolor : "primary"}>
            {item.badge}
          </Badge>
        ) : (
          ""
        )}
      </Link>
    );
  };

  const isMobile = useMediaQuery({maxWidth: 767});

  return (
    <Fragment>
      <SimpleBar style={{maxHeight: "100vh"}}>
        <div className="nav-scroller">
          <Link className="navbar-brand" to="/">
            <Image src={monefilgo} className="h-50" alt="" />
          </Link>
        </div>
        {/* Dashboard Menu */}
        <Accordion defaultActiveKey="0" as="ul" className="navbar-nav flex-column">
          {DashboardMenu.filter(menu => menu.roles.some(role => props.currentUser.roles.includes(role))).map(function (menu, index) {
            if (menu.grouptitle) {
              return (
                <Card bsPrefix="nav-item" key={index}>
                  {/* group title item */}
                  <div className="navbar-heading">{menu.title}</div>
                  {/* end of group title item */}
                </Card>
              );
            } else {
              if (menu.children) {
                let children = menu.children.filter(child => child.roles.some(role => props.currentUser.roles.includes(role)));
                return (
                  <Fragment key={index}>
                    {/* main menu / menu level 1 / root items */}
                    <CustomToggle eventKey={menu.id} icon={menu.icon}>
                      {menu.title}
                      {menu.badge ? (
                        <Badge className="ms-1" bg={menu.badgecolor ? menu.badgecolor : "primary"}>
                          {menu.badge}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </CustomToggle>
                    <Accordion.Collapse eventKey={menu.id} as="li" bsPrefix="nav-item">
                      <Accordion className="navbar-nav flex-column" as="ul">
                        <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                          {children.map(function (menuItem, menuItemIndex) {
                            if (menuItem.children) {
                              return (
                                <Fragment key={menuItemIndex}>
                                  {/* second level with children */}
                                  <CustomToggle eventKey={menuItem.id}>
                                    {menuItem.title}
                                    {menuItem.badge ? (
                                      <Badge className="ms-1" bg={menuItem.badgecolor ? menuItem.badgecolor : "primary"}>
                                        {menuItem.badge}
                                      </Badge>
                                    ) : (
                                      ""
                                    )}
                                  </CustomToggle>
                                  <Accordion.Collapse eventKey={menuItem.id} bsPrefix="nav-item" as="li">
                                    <Accordion className="navbar-nav flex-column" as="ul">
                                      <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                                        {/* third level menu started  */}
                                        {menuItem.children.map(function (subMenuItem, subMenuItemIndex) {
                                          return subMenuItem.children ? (
                                            <Fragment key={subMenuItemIndex}>
                                              <CustomToggle eventKey={subMenuItem.id}>
                                                {subMenuItem.title}
                                                {subMenuItem.badge ? (
                                                  <Badge className="ms-1" bg={subMenuItem.badgecolor ? subMenuItem.badgecolor : "primary"}>
                                                    {subMenuItem.badge}
                                                  </Badge>
                                                ) : (
                                                  ""
                                                )}
                                              </CustomToggle>
                                              <Accordion.Collapse eventKey={subMenuItem.id} bsPrefix="nav-item" as="li">
                                                <ListGroup as="ul" bsPrefix="" className="nav flex-column">
                                                  {subMenuItem.children.map(function (thirdLevelItem, thirdLevelItemIndex) {
                                                    return (
                                                      <ListGroup.Item key={thirdLevelItemIndex} as="li" bsPrefix="nav-item">
                                                        {/* third level with children */}
                                                        {generateLink(thirdLevelItem)}
                                                      </ListGroup.Item>
                                                    );
                                                  })}
                                                </ListGroup>
                                              </Accordion.Collapse>
                                            </Fragment>
                                          ) : (
                                            <ListGroup.Item key={subMenuItemIndex} as="li" bsPrefix="nav-item">
                                              {/* third level without children */}
                                              {generateLink(subMenuItem)}
                                            </ListGroup.Item>
                                          );
                                        })}
                                        {/* end of third level menu  */}
                                      </ListGroup>
                                    </Accordion>
                                  </Accordion.Collapse>
                                  {/* end of second level with children */}
                                </Fragment>
                              );
                            } else {
                              return (
                                <ListGroup.Item as="li" bsPrefix="nav-item" key={menuItemIndex}>
                                  {/* second level without children */}
                                  {generateLink(menuItem)}
                                  {/* end of second level without children  */}
                                </ListGroup.Item>
                              );
                            }
                          })}
                        </ListGroup>
                      </Accordion>
                    </Accordion.Collapse>
                    {/* end of main menu / menu level 1 / root items */}
                  </Fragment>
                );
              } else {
                return (
                  <Card bsPrefix="nav-item" key={index}>
                    {/* menu item without any childern items like Help Center, Documentation and Changelog items*/}
                    <Link to={menu.link} className={`nav-link ${location.pathname === menu.link ? "active" : ""}`}>
                      {typeof menu.icon === "string" ? <i className={`nav-icon fe fe-${menu.icon} me-2`}></i> : menu.icon}
                      {menu.title}
                      {menu.badge ? (
                        <Badge className="ms-1" bg={menu.badgecolor ? menu.badgecolor : "primary"}>
                          {menu.badge}
                        </Badge>
                      ) : (
                        ""
                      )}
                    </Link>
                    {/* end of menu item without any childern items */}
                  </Card>
                );
              }
            }
          })}
        </Accordion>
        {/* end of Dashboard Menu */}
      </SimpleBar>
    </Fragment>
  );
};

NavbarVertical.propTypes = {
  children: PropTypes.string,
  eventKey: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  isMenuOpened: PropTypes.bool,
  currentUser: PropTypes.shape({
    roles: PropTypes.arrayOf(PropTypes.string),
  }),
};

export default NavbarVertical;
