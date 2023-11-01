import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { Trans } from "react-i18next";
import { Context } from "../../auth/Context";
import endpoint from "../../auth/Context";

const Sidebar = () => {
const location = useLocation();
const [state, setState] = useState({});

const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("role",currentUser.role_id);
const fullname =currentUser.first_name ? currentUser.first_name:"" +' '+currentUser.last_name ?
currentUser.last_name:"";
const email =currentUser.email;

const toggleMenuState = (menuState) => {
if (state[menuState]) {
setState((prevState) => ({ ...prevState, [menuState]: false }));
} else if (Object.keys(state).length === 0) {
setState((prevState) => ({ ...prevState, [menuState]: true }));
} else {
Object.keys(state).forEach((i) => {
setState((prevState) => ({ ...prevState, [i]: false }));
});
setState((prevState) => ({ ...prevState, [menuState]: true }));
}
};

const onRouteChanged = () => {
document.querySelector("#sidebar").classList.remove("active");
Object.keys(state).forEach((i) => {
setState((prevState) => ({ ...prevState, [i]: false }));
});

const dropdownPaths = [
{ path: "/apps", state: "appsMenuOpen" },
{ path: "/basic-ui", state: "basicUiMenuOpen" },
{ path: "/advanced-ui", state: "advancedUiMenuOpen" },
{ path: "/form-elements", state: "caseElementsMenuOpen" },
{ path: "/Case-types", state: "tablesMenuOpen" },
{ path: "/appellants", state: "CaseLimitOpen" },
{ path: "/Holidays", state: "holidayMenuOpen" },
{ path: "/Justices", state: "JusticesMenuOpen" },
{ path: "/maps", state: "mapsMenuOpen" },
{ path: "/icons", state: "iconsMenuOpen" },
{ path: "/charts", state: "chartsMenuOpen" },
{ path: "/user-pages", state: "userPagesMenuOpen" },
{ path: "/error-pages", state: "errorPagesMenuOpen" },
{ path: "/general-pages", state: "generalPagesMenuOpen" },
{ path: "/ecommerce", state: "ecommercePagesMenuOpen" },
{ path: "/appellants", state: "appellantPageOpen" },
{ path: "/role", state: "rolePageOpen" },


];

dropdownPaths.forEach((obj) => {
if (isPathActive(obj.path)) {
setState((prevState) => ({ ...prevState, [obj.state]: true }));
}
});
};

const isPathActive = (path) => {
return location.pathname.startsWith(path);
};

useEffect(() => {
onRouteChanged();
// add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
const body = document.querySelector("body");
document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
el.addEventListener("mouseover", function () {
if (body.classList.contains("sidebar-icon-only")) {
el.classList.add("hover-open");
}
});
el.addEventListener("mouseout", function () {
if (body.classList.contains("sidebar-icon-only")) {
el.classList.remove("hover-open");
}
});
});
}, [location]);

const handleSignout = async()=>{
try {
dispatch({type: "LOGOUT"});
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.replace('/login')
// Redirect the user to the login page

} catch (error) {
console.log(error)
}
}

return (
<nav className="sidebar sidebar-offcanvas" id="sidebar">
				<ul className="nav">
								<li className="nav-item nav-profile">
												<a href="!#" className="nav-link" onClick={(evt)=> evt.preventDefault()}
																>

																<div className="nav-profile-text">
																				<span className="font-weight-bold mb-2">
																								<Trans>{fullname}</Trans>
																				</span>
																				<span className="text-secondary text-small">
																								<Trans>{currentUser? currentUser.email:""}</Trans>
																				</span>
																</div>
																<i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
												</a>
								</li>
								<li className={isPathActive("/dashboard") ? "nav-item active" : "nav-item" }>
												<Link className="nav-link" to="/dashboard">
												<span className="menu-title">
																<Trans>Dashboard</Trans>
												</span>
												<i className="mdi mdi-home menu-icon"></i>
												</Link>
								</li>

								<li className={ isPathActive("/justices") ? "nav-item active" : "nav-item" }>
												<div className={ state.JusticesMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("JusticesMenuOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Justices</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.JusticesMenuOpen}>
																<ul className="nav flex-column sub-menu">

																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" } to="/justices">
																								<Trans>View Justices</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" }
																												to="/assign-justices">
																								<Trans>Assign Justices</Trans>
																								</Link>
																				</li>
																				{/* <li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" }
																												to="/assign-justices-list">
																								<Trans>Assigned Justices List</Trans>
																								</Link>
																				</li> */}
																				{/* <li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" }
																												to="/case-justice-list">
																								<Trans>Case Justices List</Trans>
																								</Link>
																				</li> */}
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices-disqualifications") ? "nav-link active" : "nav-link" }
																												to="/justices-disqualifications">
																								<Trans>Sitting Arrangement</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" }
																												to="/assigned-justices-date-list">
																								<Trans>Search Assigned Justices </Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/justices") ? "nav-link active" : "nav-link" }
																												to="/deactivate-justice">
																								<Trans>Deactivate Justice</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																				</li>
																</ul>
												</Collapse>
								</li>

								<li className={ isPathActive("/assign-justices") ? "nav-item active" : "nav-item" }>

												<div className={ state.caseElementsMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("caseElementsMenuOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Cases</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.caseElementsMenuOpen}>
																<ul className="nav flex-column sub-menu">
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/add-case") ? "nav-link active" : "nav-link" } to="/add-case">
																								<Trans>New Case</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/case-entry") ? "nav-link active" : "nav-link" } to="/case-entry">
																								<Trans>Case Entry</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/all-case") ? "nav-link active" : "nav-link" } to="/all-case">
																								<Trans>All Cases</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								{/*
																								<Link className={ isPathActive("/users-cases") ? "nav-link active" : "nav-link" }
																												to="/users-cases">
																								<Trans>Users Case</Trans>
																								</Link> */}
																				</li>
																</ul>
												</Collapse>
								</li>
								<li className={ isPathActive("/cause-list") ? "nav-item active" : "nav-item" }>
												<div className={ state.tablesMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("CauseListOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Cause List</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.CauseListOpen}>
																<ul className="nav flex-column sub-menu">
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/cause-list") ? "nav-link active" : "nav-link" }
																												to="/cause-list">
																								<Trans>All Cause List</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/cause-list-counsel") ? "nav-link active" : "nav-link" }
																												to="/cause-list-counsel">
																								<Trans>Counsels Cause List</Trans>
																								</Link>
																				</li>
																</ul>
												</Collapse>
								</li>
								{/* Users Menu */}
								<li className={isPathActive("/users") ? "nav-item active" : "nav-item" }>
												<div className={ state.usersMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("usersMenuOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Users</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-account menu-icon"></i>
												</div>
												<Collapse in={state.usersMenuOpen}>
																<ul className="nav flex-column sub-menu">
																				{/* New User Submenu */}
																				<li className="nav-item">
																								<Link className={ isPathActive("/new-user") ? "nav-link active" : "nav-link" } to="/new-user">
																								<Trans>New User</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								<Link className={ isPathActive("/users") ? "nav-link active" : "nav-link" } to="/users">
																								<Trans> Users</Trans>
																								</Link>
																				</li>
																				{/* Other user-related submenus */}
																				{/* ... */}
																</ul>
												</Collapse>
								</li>
								<li className={ isPathActive("/all-cases") ? "nav-item active" : "nav-item" }>
												<div className={ state.tablesMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("tablesMenuOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Case Type</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.tablesMenuOpen}>
																<ul className="nav flex-column sub-menu">
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/case-types") ? "nav-link active" : "nav-link" }
																												to="/case-types">
																								<Trans>All Case Type</Trans>
																								</Link>
																				</li>
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/new-case-type") ? "nav-link active" : "nav-link" }
																												to="/new-case-type">
																								<Trans>Add Case Type</Trans>
																								</Link>
																				</li>
																</ul>
												</Collapse>
								</li>

								<li className={ isPathActive("/tables") ? "nav-item active" : "nav-item" }>
												<div className={ state.tablesMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("CaseLimitOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Case Limit Setup</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.CaseLimitOpen}>
																<ul className="nav flex-column sub-menu">
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/case-limit") ? "nav-link active" : "nav-link" }
																												to="/case-limit">
																								<Trans>All Case limit</Trans>
																								</Link>
																				</li>
																</ul>
												</Collapse>
								</li>

								<li className={ isPathActive("/tables") ? "nav-item active" : "nav-item" }>
												<div className={ state.tablesMenuOpen ? "nav-link menu-expanded" : "nav-link" } onClick={()=>
																toggleMenuState("holidayMenuOpen")}
																data-toggle="collapse"
																>
																<span className="menu-title">
																				<Trans>Holidays</Trans>
																</span>
																<i className="menu-arrow"></i>
																<i className="mdi mdi-file-plus menu-icon"></i>
												</div>
												<Collapse in={state.holidayMenuOpen}>
																<ul className="nav flex-column sub-menu">
																				<li className="nav-item">
																								{" "}
																								<Link className={ isPathActive("/All Holidays") ? "nav-link active" : "nav-link" }
																												to="/holidays">
																								<Trans>View Holidays</Trans>
																								</Link>
																				</li>
																</ul>
												</Collapse>
								</li>
                <li className={isPathActive("/appellants") ? "nav-item active" : "nav-item"}>
  <div
    className={state.appellantPageOpen ? "nav-link menu-expanded" : "nav-link"}
    onClick={() => toggleMenuState("appellantPageOpen")}
    data-toggle="collapse"
  >
    <span className="menu-title">
      <Trans>Titles</Trans>
    </span>
    <i className="menu-arrow"></i>
    <i className="mdi mdi-file-plus menu-icon"></i>
  </div>
  <Collapse in={state.appellantPageOpen}>
    <ul className="nav flex-column sub-menu">
      <li className="nav-item">
        <Link
          className={isPathActive("/appellants") ? "nav-link active" : "nav-link"}
          to="/appellants"
        >
          <Trans>Appellant Title</Trans>
        </Link>
      </li>
    </ul>
  </Collapse>
</li>
<li className={isPathActive("/icons") ? "nav-item active" : "nav-item"}>
  <div
    className={state.iconsMenuOpen ? "nav-link menu-expanded" : "nav-link"}
    onClick={() => toggleMenuState("iconsMenuOpen")}
    data-toggle="collapse"
  >
    <span className="menu-title">
      <Trans>Settings</Trans>
    </span>
    <i className="menu-arrow"></i>
    <i className="mdi mdi-settings menu-icon"></i>
  </div>
  <Collapse in={state.iconsMenuOpen}>
    <ul className="nav flex-column sub-menu">
      <li className="nav-item">
        <button className="btn btn-flat" onClick={handleSignout}>
          <Trans>Logout</Trans>
        </button>
      </li>
    </ul>
  </Collapse>
</li>
{currentUser.role_id ===1 ?
<li className={"nav-item mt-5"}>
  <div
    className={state.rolePageOpen ? "nav-link menu-expanded" : "nav-link"}
    onClick={() => toggleMenuState("rolePageOpen")}
    data-toggle="collapse"
  >
    <span className="menu-title">
      <Trans>ROLE SETTINGS</Trans>
    </span>
    <i className="menu-arrow"></i>
    <i className="mdi mdi-settings menu-icon"></i>
  </div>
  <Collapse in={state.rolePageOpen}>
    <ul className="nav flex-column sub-menu">
      <li className="nav-item">
        <Link
          className={isPathActive("/role") ? "nav-link active" : "nav-link"}
          to="/role"
        >
          <Trans>Create Role</Trans>
        </Link>
      </li>
	  <li className="nav-item">
        <Link
          className={isPathActive("/role") ? "nav-link active" : "nav-link"}
          to="/module-list"
        >
          <Trans>Create Module</Trans>
        </Link>
      </li>
	  <li className="nav-item">
        <Link
          className={isPathActive("/role") ? "nav-link active" : "nav-link"}
          to="/submodule-list"
        >
          <Trans>Create Submodule</Trans>
        </Link>
      </li>
	  <li className="nav-item">
        <Link
          className={isPathActive("/role") ? "nav-link active" : "nav-link"}
          to="/assign-module-to-role"
        >
          <Trans>Assign Module to role</Trans>
        </Link>
      </li>
    </ul>
  </Collapse>
</li>
:""}

				</ul>
</nav>
);
}

export default Sidebar
