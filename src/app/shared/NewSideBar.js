import React, { Fragment, useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSideBarContext } from "../../Context/SideBarContextProvider";
import { Context } from "../../auth/Context";
import { Collapse } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";


import { Trans } from "react-i18next";


const ScnSideMenu = () => {
    const { user } = useContext(Context)
   
const currentUser = user?.user;
console.log("user",currentUser.first_name);
const fullname =currentUser.first_name ? currentUser.first_name:"" +' '+currentUser.last_name ?
currentUser.last_name:"";
const email =currentUser.email;
    const { modules } = useSideBarContext()
    const [mainn, setMainn] = useState([]);
    const [mainmenu, setMainMenu] = useState([]);
const [state, setState] = useState({});

    const [activeItem, setActiveItem] = useState(null);

    useEffect(() => {
        getUserModule()
    }, [])
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

    const getUserModule = async () => {
        console.log("user modules", modules)
    
        let userModules = modules

        userModules && userModules?.map((mod) => {
            mod.active = false;
            mod.title = mod.module_name;
            delete mod.module_name;
            mod.icon = mod.icon;
            mod.type = "sub"
            // console.log("mymod", mod)

            mod?.SubModules?.map((sub) => {
                sub.active = false;
                sub.type = "link"
                sub.title = sub.submodule_name;
                delete sub.submodule_name;
                sub.path = sub.route;
                delete sub.route;
                return sub;
            })

            //assign submodules array as children in the mod array
            mod.children = mod.SubModules;
            delete mod.SubModules
            return mod;

        });

        var menu = {
            menutitle: "HOME",
            Items: [
                {
                    path: `dashboard`,
                    icon: "home",
                    type: "link",
                    active: true,
                    title: "Dashboard",
                },
            ],
        };

        var menu2 = {
            menutitle: "LINKS",
            Items: userModules
        };

        var menu3 = {
            menutitle: "ROLE SETTINGS",
            Items: [
                {
                    icon: "package",
                    type: "sub",
                    active: false,
                    title: "Role Management",
                    children: [
                        {
                            path: `${process.env.PUBLIC_URL}/role`,
                            title: "Create Role",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/module-list`,
                            title: "Create Module",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/submodule-list`,
                            title: "Create Submodule",
                            type: "link",
                        },
                        {
                            path: `${process.env.PUBLIC_URL}/assign-module-to-role`,
                            title: "Assign Module to role",
                            type: "link",
                        },

                    ],
                }
            ]

        };


        var MENUITEMS = [ menu2];
        var newMenu = [...MENUITEMS, menu3]
        // console.log("men", MENUITEMS);
        // console.log("men 2", newMenu);
        // return MENUITEMS;
        if(user.user.role_id === 1){
            setMainn(newMenu)
            setMainMenu(newMenu)
        }else{
            setMainn(MENUITEMS)
            setMainMenu(MENUITEMS)
        }

        const currentUrl = window.location.pathname.slice(0, -1);
        console.log("cur url", currentUrl)

        mainn.map((items) => {
            items.Items.filter((Items) => {
                if (Items.path === currentUrl) setNavActive(Items);
                if (!Items.children) return false;
                Items.children.filter((subItems) => {
                    if (subItems.path === currentUrl) setNavActive(subItems);
                    if (!subItems.children) return false;
                    subItems.children.filter((subSubItems) => {
                        if (subSubItems.path === currentUrl) {
                            setNavActive(subSubItems);
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return subItems;
                });
                return Items;
            });
            return items;
        });
    }

    const setNavActive = (item) => {
        console.log("menuItems", mainn)
        console.log("item", item)
        //toggle active, check if item received is in mainn array (true then active true else active false)
        mainn?.map((menuItems) => {
            menuItems.Items.filter((Items) => {
                if (Items !== item) {
                    Items.active = false;
                }

                if (Items.children && Items.children.includes(item)) {
                    Items.active = true;
                }
                // if (Items.children) {
                //     Items.children.filter((submenuItems) => {
                //         if (submenuItems.children && submenuItems.children.includes(item)) {
                //             Items.active = true;
                //             submenuItems.active = true;
                //             return true;
                //         } else {
                //             return false;
                //         }
                //     });
                // }
                return Items;
            });
            return menuItems;
        });
        item.active = !item.active;
        setMainMenu({ mainmenu: mainn });
    };

    const toggletNavActive = (item) => {
        let mainn = mainmenu;
        // console.log(mainn);
        if (window.innerWidth <= 991) {
            if (item.type === "sub") {


            }
        }
        if (!item.active) {

            mainn.map((a) => {
                a.Items.filter((Items) => {
                    if (a.Items.includes(item)) Items.active = false;
                    if (!Items.children) return false;
                    Items.children.forEach((b) => {
                        if (Items.children.includes(item)) {
                            b.active = false;
                        }
                        if (!b.children) return false;
                        b.children.forEach((c) => {
                            if (b.children.includes(item)) {
                                c.active = false;
                            }
                        });
                    });
                    return Items;
                });
                return a;
            });
        }
        item.active = !item.active;
        setMainMenu({ mainmenu: mainn });
    };

    return (
        <>
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
								<li className={"nav-item active" }>
												<Link className="nav-link" to="/dashboard">
												<span className="menu-title">
																<Trans>Dashboard</Trans>
												</span>
												<i className="mdi mdi-home menu-icon"></i>
												</Link>
								</li>
          <ul className="side-menu" id="sidebar-main">
  {mainn.map((Item, i) => (
    <li
      className={`${
        Item.Items.some((menuItem) => menuItem.active)
          ? "nav-item active"
          : "nav-item"
      }`}
      key={i}
    >
      <div
        className={`${
          Item.Items.some((menuItem) => menuItem.active)
            ? "nav-link menu-expanded"
            : "nav-link"
        }`}
        onClick={() => toggleMenuState(Item.menutitle + "MenuOpen")}
        data-toggle="collapse"
      >
        <span className="menu-title">
          <Trans>{Item.menutitle}</Trans>
        </span>
      
        <i className="mdi mdi-file-plus menu-icon"></i>
      </div>
      <Collapse in={state[`${Item.menutitle}MenuOpen`]}>
        <ul className="nav flex-column sub-menu">
          {Item.Items.map((menuItem, index) => (
            <li
              className={`nav-item ${
                menuItem.active ? "active" : ""
              }`}
              key={index}
            >
              {menuItem.type === "link" ? (
                <Link
                  className={`nav-link ${menuItem.active ? "active" : ""}`}
                  to={menuItem.path + "/"}
                >
                  <Trans>{menuItem.title}</Trans>
                </Link>
              ) : (
                ""
              )}
              {menuItem.type === "sub" ? (
                <Link
                  to={menuItem.path + "/"}
                  className={`nav-link ${menuItem.active ? "active" : ""}`}
                  onClick={(event) => {
                    event.preventDefault();
                    toggletNavActive(menuItem);
                  }}
                >
                  <Trans>{menuItem.title}</Trans>
                  <i className={`${menuItem.background} fa angle fa-angle-right`}></i>
                </Link>
              ) : (
                ""
              )}
              {menuItem.children ? (
                <ul
                  className="nav flex-column sub-menu"
                  style={
                    menuItem.active
                      ? {
                          opacity: 1,
                          transition: "opacity 500ms ease-in",
                          display: "block",
                        }
                      : { display: "none" }
                  }
                >
                  {menuItem.children.map((childrenItem, key) => (
                    <li
                      className={`nav-item ${
                        childrenItem.active ? "active" : ""
                      }`}
                      key={key}
                    >
                      {childrenItem.type === "link" ? (
                        <Link
                          className={`nav-link ${childrenItem.active ? "active" : ""}`}
                          to={childrenItem.path + "/"}
                        >
                          <Trans>{childrenItem.title}</Trans>
                        </Link>
                      ) : (
                        ""
                      )}
                      {childrenItem.type === "sub" ? (
                        <a
                          href="javascript"
                          className={`nav-link sub-side-menu__item ${
                            childrenItem.active ? "active" : ""
                          }`}
                          onClick={(event) => {
                            event.preventDefault();
                            toggletNavActive(childrenItem);
                          }}
                        >
                          <span className="sub-side-menu__label">
                            <Trans>{childrenItem.title}</Trans>
                          </span>
                          {childrenItem.active ? (
                            <i className="sub-angle fa fa-angle-down"></i>
                          ) : (
                            <i className="sub-angle fa fa-angle-right"></i>
                          )}
                        </a>
                      ) : (
                        ""
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                ""
              )}
            </li>
          ))}
        </ul>
      </Collapse>
    </li>
  ))}
</ul>

        </>
    )
}

export default ScnSideMenu;
