import React, { useContext, useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { Context } from "../../auth/Context";
import endpoint from "../../auth/Context";

const Navbar = () => {
	const { user, dispatch } = useContext(Context);
	const currentUser = user?.user;
	const [isLoading, setLoading] = useState(false);
	
	const fullname = currentUser.first_name ? currentUser.first_name:"" +' '+ currentUser.last_name ? currentUser.last_name:"";
	const email = currentUser.email;
	console.log("user", fullname);
	const handleSignout = async () => {
		try {
			dispatch({ type: "LOGOUT" });
			setLoading(true)
			localStorage.removeItem("token");
			localStorage.removeItem("user");
			window.location.replace("/login");
			// Redirect the user to the login page
		} catch (error) {
			console.log(error);
		}
	};

	const toggleOffcanvas = () => {
		document.querySelector(".sidebar-offcanvas").classList.toggle("active");
	};

	const toggleRightSidebar = () => {
		document.querySelector(".right-sidebar").classList.toggle("open");
	};

	return (
		<nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
			<div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
			<Link className="navbar-brand brand-logo" to="/dashboard">
  <img
    src={require("../../assets/images/njc-logo.jpg")}
    alt="logo"
    style={{ width: "100px", height: "90px", marginTop:"5px" }}
  />
</Link>

			
			</div>
			<div className="navbar-menu-wrapper d-flex align-items-stretch">
				<button
					className="navbar-toggler navbar-toggler align-self-center"
					type="button"
					onClick={() => document.body.classList.toggle("sidebar-icon-only")}>
					<span className="mdi mdi-menu"></span>
				</button>
				<div className="search-field d-none d-md-block">
					
				</div>
				<ul className="navbar-nav navbar-nav-right">
					<li className="nav-item nav-profile">
						<Dropdown alignRight>
							<Dropdown.Toggle className="nav-link">
			
								<div className="nav-profile-text">
									<p className="mb-1 text-black">
										<Trans>{fullname}</Trans>
									</p>
								</div>
							</Dropdown.Toggle>
							<Dropdown.Menu className="navbar-dropdown">
								<Dropdown.Item
									href="!#"
									onClick={(evt) => evt.preventDefault()}>
									<i className="mdi mdi-cached mr-2 text-success"></i>
									<Trans>Activity Log</Trans>
								</Dropdown.Item>
								<Dropdown.Item
									href="!#"
									onClick={(evt) => evt.preventDefault()}>
									<i className="mdi mdi-logout mr-2 text-primary"></i>
									<button
										className="btn btn-flat"
										onClick={handleSignout}>
										Signout
									</button>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					</li>
			
			
					<li className="nav-item nav-logout d-none d-lg-block">
						<a
							className="nav-link"
							href="!#"
              onClick={handleSignout}>
							<i className="mdi mdi-power"></i>
						</a>
					</li>
				
				</ul>
		
			</div>
		</nav>
	);
};
export default Navbar;
