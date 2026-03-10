// apps/admin/components/sidebar.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { SidebarData } from "@/data/sidebar_data";
import { ChevronsLeft } from "react-feather";

export default function Sidebar() {
  const pathname = usePathname();
  const [subOpen, setSubOpen] = useState("");
  const [subSidebar, setSubSidebar] = useState("");
  const [toggle, setToggle] = useState(false);
  const [expandMenus, setExpandMenus] = useState(false);

  const toggleSidebar = (title: string) => {
    setSubOpen(subOpen === title ? "" : title);
  };

  const toggleSubSidebar = (title: string) => {
    setSubSidebar(subSidebar === title ? "" : title);
  };

  const handleSidebar = () => {
    document.body.classList.toggle("mini-sidebar");
    setToggle(!toggle);
  };

  const expandMenuOpen = () => {
    setExpandMenus(true);
    document.body.classList.add("expand-menu");
  };

  const expandMenuClose = () => {
    setExpandMenus(false);
    document.body.classList.remove("expand-menu");
  };

  useEffect(() => {
    document.body.classList.toggle("expand-menu", expandMenus);
  }, [expandMenus]);

  return (
    <div
      className={`sidebar ${toggle ? "" : "active"} ${expandMenus ? "expand-menu" : ""}`}
      onMouseOver={expandMenuOpen}
      onMouseLeave={expandMenuClose}
    >
      <div className="sidebar-logo p-3">
        <Link href="/" className="logo">
          <img src="assets/img/logo.svg" alt="Logo" />
        </Link>
        <button id="toggle_btn" onClick={handleSidebar}>
          <ChevronsLeft />
        </button>
      </div>
      <PerfectScrollbar>
        <div className="sidebar-inner slimscroll">
          <div id="sidebar-menu" className="sidebar-menu">
            <ul>
              {SidebarData.map((mainItem, idx) => (
                <li key={idx} className="submenu-open">
                  <h6 className="submenu-hdr">{mainItem.submenuHdr}</h6>
                  <ul>
                    {mainItem.submenuItems?.map((item, i) => (
                      <li key={i} className={item.submenu ? "submenu" : ""}>
                        <Link
                          href={item.link || "#"}
                          className={`${pathname === item.link ? "active" : ""}`}
                          onClick={() => toggleSidebar(item.label)}
                        >
                          <i className={`ti ti-${item.icon} me-2`} />
                          <span>{item.label}</span>
                          {item.submenu && <span className="menu-arrow" />}
                        </Link>
                        {item.submenu && (
                          <ul style={{ display: subOpen === item.label ? "block" : "none" }}>
                            {item?.submenuItems?.map((sub, j) => (
                              <li key={j}>
                                <Link
                                  href={sub.link || "#"}
                                  className={`${pathname === sub.link ? "active" : ""}`}
                                  onClick={() => toggleSubSidebar(sub.label)}
                                >
                                  {sub.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PerfectScrollbar>
    </div>
  );
}

/* export default function Sidebar() {
  const route = all_routes;
  const pathname = usePathname();
  // const { t } = useTranslation();

  const [subOpen, setSubopen] = useState("");
  const [subsidebar, setSubsidebar] = useState("");
  const [toggle, SetToggle] = useState(false);
  const [expandMenus, setExpandMenus] = useState(false); // Local state for expandMenus
  const [dataLayout, setDataLayout] = useState("default"); // Local state for dataLayout

  const toggleSidebar = (title: string): void => {
    if (title === subOpen) {
      setSubopen("");
    } else {
      setSubopen(title);
    }
  };

  const toggleSubsidebar = (subitem: string): void => {
    if (subitem === subsidebar) {
      setSubsidebar("");
    } else {
      setSubsidebar(subitem);
    }
  };

  const handlesidebar = (): void => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current: boolean) => !current);
  };

  const expandMenu = (): void => {
    setExpandMenus(false);
    document.body.classList.remove("expand-menu");
  };

  const expandMenuOpen = (): void => {
    setExpandMenus(true);
    document.body.classList.add("expand-menu");
  };

  useEffect(() => {
    // Update the DOM based on `dataLayout` and `expandMenus`
    document.body.classList.toggle(
      "expand-menu",
      expandMenus || dataLayout === "layout-hovered"
    );
  }, [expandMenus, dataLayout]);

  return (
    <>
      <div
        className={`sidebar ${toggle ? "" : "active"} ${
          expandMenus || dataLayout === "layout-hovered" ? "expand-menu" : ""
        }`}
        id="sidebar"
        onMouseLeave={expandMenu}
        onMouseOver={expandMenuOpen}
      >
        <>
        
          <div className="sidebar-logo">
            <Link href={route.dashboard} className="logo logo-normal">
              <img src="assets/img/logo.svg" alt="Img" />
            </Link>
            <Link href={route.dashboard} className="logo logo-white">
              <img src="assets/img/logo.svg" alt="Img" />
            </Link>
            <Link href={route.dashboard} className="logo-small">
              <img src="assets/img/logo.svg" alt="Img" />
            </Link>
            <Link id="toggle_btn" href="#" onClick={handlesidebar}>
              <i data-feather="chevrons-left" />
              <ChevronsLeft className="feather-16" />
            </Link>
          </div>
         
          <div className="modern-profile p-3 pb-0">
            <div className="text-center rounded bg-light p-3 mb-4 border">
              <div className="avatar avatar-lg online mb-3">
                <img
                  src="assets/img/customer/customer15.jpg"
                  alt="Img"
                  className="img-fluid rounded-circle"
                />
              </div>
              <h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
              <p className="fs-12 mb-0">System Admin</p>
            </div>
            <div className="sidebar-nav mb-3">
              <ul
                className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
                role="tablist"
              >
                <li className="nav-item">
                  <Link className="nav-link active border-0" href="#">
                    Menu
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link border-0" href={route.chat}>
                    Chats
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link border-0" href={route.email}>
                    Inbox
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </>
        <PerfectScrollbar>
          <div className="sidebar-inner slimscroll">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {SidebarData?.map((mainLabel: any, index: any) => (
                  <li className="submenu-open" key={index}>
                    <h6 className="submenu-hdr">{mainLabel?.label}</h6>
                    <ul>
                      {mainLabel?.submenuItems?.map((title: any, i: any) => {
                        let link_array: any[] = [];
                        title?.submenuItems?.map((link: any) => {
                          link_array.push(link?.link);
                          if (link?.submenu) {
                            link?.submenuItems?.map((item: any) => {
                              link_array.push(item?.link);
                            });
                          }
                          return link_array;
                        });
                        title.links = link_array;
                        return (
                          <React.Fragment key={i}>
                            <li
                              className={`submenu ${
                                !title?.submenu && pathname === title?.link
                                  ? "custom-active-hassubroute-false"
                                  : ""
                              }`}
                            >
                              <Link
                                href={title?.link || "#"}
                                onClick={() => toggleSidebar(title?.label)}
                                className={`${
                                  subOpen === title?.label ? "subdrop" : ""
                                } ${
                                  title?.links?.includes(pathname)
                                    ? "subdrop active"
                                    : ""
                                }`}
                              >
                                <i className={`ti ti-${title.icon} me-2`}></i>
                                <span className="custom-active-span">
                                  {title?.label}
                                </span>
                                {title?.submenu && (
                                  <span className="menu-arrow" />
                                )}
                              </Link>
                              <ul
                                style={{
                                  display:
                                    subOpen === title?.label ? "block" : "none",
                                }}
                              >
                                {title?.submenuItems?.map(
                                  (item: any, titleIndex: any) => (
                                    <li
                                      className="submenu submenu-two"
                                      key={titleIndex}
                                    >
                                      <Link
                                        href={item?.link || "#"}
                                        className={`${
                                          item?.submenuItems
                                            ?.map((link: any) => link.link)
                                            .includes(pathname) ||
                                          item?.link === pathname
                                            ? "active"
                                            : ""
                                        } ${
                                          subsidebar === item?.label
                                            ? "subdrop"
                                            : ""
                                        }`}
                                        onClick={() =>
                                          toggleSubsidebar(item?.label)
                                        }
                                      >
                                        {item?.label}
                                        {item?.submenu && (
                                          <span className="menu-arrow inside-submenu" />
                                        )}
                                      </Link>
                                      <ul
                                        style={{
                                          display:
                                            subsidebar === item?.label
                                              ? "block"
                                              : "none",
                                        }}
                                      >
                                        {item?.submenuItems?.map(
                                          (items: any, subIndex: any) => (
                                            <li key={subIndex}>
                                              <Link
                                                href={items?.link || "#"}
                                                className={`${
                                                  subsidebar === items?.label
                                                    ? "submenu-two subdrop"
                                                    : "submenu-two"
                                                } ${
                                                  items?.submenuItems
                                                    ?.map(
                                                      (link: any) => link.link
                                                    )
                                                    .includes(pathname) ||
                                                  items?.link === pathname
                                                    ? "active"
                                                    : ""
                                                }`}
                                              >
                                                {items?.label}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </li>
                                  )
                                )}
                              </ul>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </PerfectScrollbar>
      </div>
    </>
  );
} */
