import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { Trans } from "react-i18next";
import { Context } from "../../auth/Context";
import { useSideBarContext } from "../../Context/SideBarContextProvider";

const Sidebar = () => {
  const location = useLocation();
  const [state, setState] = useState({});
  const { user, dispatch } = useContext(Context);
  const currentUser = user?.user;
  console.log("role", currentUser.role_id);
  const fullname = currentUser.first_name
    ? currentUser.first_name
    : "" + " " + currentUser.last_name
    ? currentUser.last_name
    : "";
  const email = currentUser.email;
  const { modules } = useSideBarContext();

  const [activeSubMenu, setActiveSubMenu] = useState(null);

  const onRouteChanged = () => {
    if (modules && modules.length > 0) {
      modules.forEach((obj) => {
        if (isPathActive(obj.SubModules.route)) {
          setActiveSubMenu(obj.module_name);
        }
      });
    }
  };

  const isPathActive = (path) => {
    return location.pathname.startsWith(path);
  };

  useEffect(() => {
    onRouteChanged();
  }, [location]);

  const handleSubMenuClick = (menuName) => {
    if (activeSubMenu === menuName) {
      setActiveSubMenu(null);
    } else {
      setActiveSubMenu(menuName);
    }
  };

  const handleSignout = async () => {
    try {
      dispatch({ type: "LOGOUT" });
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.replace("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav
      className="sidebar sidebar-offcanvas"
      id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a
            href="!#"
            className="nav-link"
            onClick={(evt) => evt.preventDefault()}>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">
                <Trans>{fullname}</Trans>
              </span>
              <span className="text-secondary text-small">
                <Trans>{currentUser ? currentUser.email : ""}</Trans>
              </span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li
          className={
            isPathActive("/dashboard") ? "nav-item active" : "nav-item"
          }>
          <Link
            className="nav-link"
            to="/dashboard">
            <span className="menu-title">
              <Trans>Dashboard</Trans>
            </span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>

        {modules &&
          modules.length > 0 &&
          modules.map((sidebar) => (
            <li
              className="nav-item"
              key={sidebar.module_name}>
              <div
                className="nav-link"
                onClick={() => handleSubMenuClick(sidebar.module_name)}>
                <span className="menu-title">
                  <Trans>{sidebar.module_name}</Trans>
                </span>
                <i
                  className={`menu-arrow ${
                    activeSubMenu === sidebar.module_name
                      ? "mdi mdi-chevron-up"
                      : "mdi mdi-chevron-down"
                  }`}></i>
                <i className="mdi mdi-file-plus menu-icon"></i>
              </div>
              <Collapse in={activeSubMenu === sidebar.module_name}>
                <ul className="nav flex-column sub-menu">
                  {sidebar.SubModules &&
                    sidebar.SubModules.map((sub) => (
                      <li
                        className="nav-item"
                        key={sub.submodule_name}>
                        <Link
                          className={
                            isPathActive(sub.route)
                              ? "nav-link active"
                              : "nav-link"
                          }
                          to={sub.route}>
                          <Trans>{sub.submodule_name}</Trans>
                        </Link>
                      </li>
                    ))}
                </ul>
              </Collapse>
            </li>
          ))}

        {currentUser.role_id === 1 && (
          <li className="nav-item mt-5">
            <div
              className={
                activeSubMenu === "rolePageOpen"
                  ? "nav-link menu-expanded"
                  : "nav-link"
              }
              onClick={() => handleSubMenuClick("rolePageOpen")}
              data-toggle="collapse">
              <span className="menu-title">
                <Trans>ROLE SETTINGS</Trans>
              </span>
              <i
                className={`menu-arrow ${
                  activeSubMenu === "rolePageOpen"
                    ? "mdi mdi-chevron-up"
                    : "mdi mdi-chevron-down"
                }`}></i>
              <i className="mdi mdi-settings menu-icon"></i>
            </div>
            <Collapse in={activeSubMenu === "rolePageOpen"}>
              <ul className="nav flex-column sub-menu">
                <li className="nav-item">
                  <Link
                    className={
                      isPathActive("/role") ? "nav-link active" : "nav-link"
                    }
                    to="/role">
                    <Trans>Create Role</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      isPathActive("/role") ? "nav-link active" : "nav-link"
                    }
                    to="/module-list">
                    <Trans>Create Module</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      isPathActive("/role") ? "nav-link active" : "nav-link"
                    }
                    to="/submodule-list">
                    <Trans>Create Submodule</Trans>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      isPathActive("/role") ? "nav-link active" : "nav-link"
                    }
                    to="/assign-module-to-role">
                    <Trans>Assign Module to role</Trans>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
