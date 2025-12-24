"use client";
{
  /* eslint-disable-next-line @next/next/no-img-element */
}

import { all_routes } from "@/data/all_routes";
import { ChevronsLeft, Search } from "react-feather";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Header() {
  const route = all_routes;
  const [toggle, SetToggle] = useState(false);
  const [flagImage, setFlagImage] = useState("assets/img/flags/us-flag.svg");
  const pathname = usePathname(); // Use Next.js hook for current route
  const [expandMenus, setExpandMenus] = useState(false); // Local state for expandMenus
  const [dataLayout, setDataLayout] = useState("default"); // Local state for dataLayout

  const handlesidebar = (): void => {
    document.body.classList.toggle("mini-sidebar");
    SetToggle((current: boolean) => !current);
  };

  const sidebarOverlay = (): void => {
    document?.querySelector(".main-wrapper")?.classList?.toggle("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.toggle("opened");
    document?.querySelector("html")?.classList?.toggle("menu-opened");
  };

  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-one",
  ];

  if (exclusionArray.includes(pathname)) {
    return null; // Return null if the pathname is in the exclusion array
  }

  const expandMenu = () => {
    setExpandMenus(false);
    document.body.classList.remove("expand-menu");
  };

  const expandMenuOpen = () => {
    setExpandMenus(true);
    document.body.classList.add("expand-menu");
  };

  const [isFullscreen, setIsFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {});
        setIsFullscreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch((err) => {});
        }
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    // Remove 'slide-nav' class from .main-wrapper on route change
    document?.querySelector(".main-wrapper")?.classList?.remove("slide-nav");
    document?.querySelector(".sidebar-overlay")?.classList?.remove("opened");
    document?.querySelector("html")?.classList?.remove("menu-opened");
  }, [pathname]);

  return (
    <>
      <div className="header">
        <div className="main-header h-[inherit]">
          {/* <!-- Logo --> */}
          <div className="header-left active">
            <a href="index.html" className="logo logo-normal">
              <img src="assets/img/logo.svg" alt="Img" />
            </a>
            <a href="index.html" className="logo logo-white">
              <img src="assets/img/logo.svg" alt="Img" />
            </a>
            <a href="index.html" className="logo-small">
              <img src="assets/img/logo.svg" alt="Img" />
            </a>
          </div>
          {/* <!-- /Logo --> */}
          <a id="mobile_btn" className="mobile_btn" href="#sidebar">
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>

          {/* <!-- Header Menu --> */}
          <ul className="nav user-menu items-center justify-center relative h-full transition-all duration-[0.5s] ease-[ease] m-0 pr-6">
            {/* <!-- Search --> */}
            <li className="nav-item nav-searchinputs">
              {/* <div className="top-nav-search">
							<a href="javascript:void(0);" className="responsive-search hidden text-white text-xl h-[60px] leading-[60px] px-[15px]">
								<i className="fa fa-search"></i>
							</a>
							<form action="#" className="dropdown relative">
								<div className="searchinputs input-group dropdown-toggle" id="dropdownMenuClickable" data-dropdown-toggle="search-dropdown">
									<input type="text" placeholder="Search" className="focus:border-border-color focus:ring-0" />
									<div className="search-addon">
										<span className="flex items-center justify-center cursor-pointer text-[#A6AAAF] rounded-[5px] absolute -translate-y-2/4 z-[9] start-2 top-1/2"><i className="ti ti-search"></i></span>
									</div>
									<span className="input-group-text">
										<kbd className="flex items-center bg-secondary-transparent text-[10px] font-medium text-text-title py-0.5 p-1 rounded-[5px]"><img src="assets/img/icons/command.svg" alt="img" className="me-1" />K</kbd>
									</span>
								</div>
								<div id="search-dropdown" className="dropdown-menu hidden search-dropdown w-[300px] h-[315px] shadow overflow-y-auto mt-0 p-5 rounded-[10px]">
									<div className="text-sm text-text-default mt-0 mb-[15px] mx-0 pt-0 pb-[15px] px-0 border-b-border-color border-b">
										<h6 className="flex items-center text-sm font-bold mb-[15px]"><span><i data-feather="search" className="feather-16 w-3.5 text-secondary me-1.5"></i></span>Recent Searches
										</h6>
										<ul className="search-tags flex items-center gap-[10px]">
											<li><a href="javascript:void(0);" className="block text-text-default bg-secondary-transparent px-2.5 py-[5px] rounded-[50px] hover:bg-primary hover:text-white">Products</a></li>
											<li><a href="javascript:void(0);" className="block text-text-default bg-secondary-transparent px-2.5 py-[5px] rounded-[50px] hover:bg-primary hover:text-white">Sales</a></li>
											<li><a href="javascript:void(0);" className="block text-text-default bg-secondary-transparent px-2.5 py-[5px] rounded-[50px] hover:bg-primary hover:text-white">Applications</a></li>
										</ul>
									</div>
									<div className="text-sm text-text-default mt-0 mb-[15px] mx-0 pt-0 pb-[15px] px-0 border-b-border-color border-b">
										<h6 className="flex items-center text-sm font-bold mb-[15px]"><span><i data-feather="help-circle" className="feather-16 w-3.5 text-secondary me-1.5"></i></span>Help</h6>
										<p className="mb-[10px]">How to Change Product Volume from 0 to 200 on Inventory management</p>
										<p>Change Product Name</p>
									</div>
									<div className="text-sm text-text-default mt-0 mx-0 pt-0 px-0">
										<h6 className="flex items-center text-sm font-bold mb-[15px]"><span><i data-feather="user" className="feather-16 w-3.5 text-secondary me-1.5"></i></span>Customers</h6>
										<ul className="customers">
											<li className="mb-[15px]"><a href="javascript:void(0);" className="text-text-default text-[15px] flex items-center justify-between hover:text-primary">Aron Varu<img src="assets/img/profiles/avator1.jpg" alt="Img" className="w-[30px] h-[30px] border rounded-[100%] border-border-color" /></a></li>
											<li className="mb-[15px]"><a href="javascript:void(0);" className="text-text-default text-[15px] flex items-center justify-between hover:text-primary">Jonita<img src="assets/img/profiles/avatar-01.jpg" alt="Img" className="w-[30px] h-[30px] border rounded-[100%] border-border-color" /></a></li> 
											<li><a href="javascript:void(0);" className="text-text-default text-[15px] flex items-center justify-between hover:text-primary">Aaron<img src="assets/img/profiles/avatar-10.jpg" alt="Img" className="w-[30px] h-[30px] border rounded-[100%] border-border-color" /></a></li>
										</ul>
									</div>
								</div>
							</form>
						</div> */}
            </li>

            <li className="nav-item dropdown relative select-store-dropdown">
              {/* <a href="javascript:void(0);" className="px-[8px] py-[6px] border border-[#E6EAED] rounded-[8px] nav-link select-store"
							data-dropdown-toggle="store-dropdown">
							<span className="user-info flex items-center justify-center relative ">
								<span className="w-4 h-4 me-2">
									<img src="assets/img/store/store-01.png" alt="Store Logo" className="rounded" />
								</span>
								<span className="user-detail">
									<span className="text-sm font-normal text-gray-900">Freshmart</span>
								</span>
							</span>
						</a>
						<div id="store-dropdown" className="dropdown-menu p-2 hidden">
							<a href="javascript:void(0);" className="flex items-center text-text-default text-[0.8125rem] px-[0.9375rem] py-2 whitespace-nowrap hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/store/store-01.png" alt="Store Logo" className="w-5 h-5 rounded me-2" />Freshmart
							</a>
							<a href="javascript:void(0);" className="flex items-center text-text-default text-[0.8125rem] px-[0.9375rem] py-2 whitespace-nowrap hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/store/store-02.png" alt="Store Logo" className="w-5 h-5 rounded me-2" />Grocery Apex
							</a>
							<a href="javascript:void(0);" className="flex items-center text-text-default text-[0.8125rem] px-[0.9375rem] py-2 whitespace-nowrap hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/store/store-03.png" alt="Store Logo" className="w-5 h-5 rounded me-2" />Grocery Bevy
							</a>
							<a href="javascript:void(0);" className="flex items-center text-text-default text-[0.8125rem] px-[0.9375rem] py-2 whitespace-nowrap hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/store/store-04.png" alt="Store Logo" className="w-5 h-5 rounded me-2" />Grocery Eden
							</a>
						</div> */}
            </li>

            <li className="nav-item dropdown relative link-nav">
              {/* <a href="javascript:void(0);" className="btn bg-primary border border-primary text-white text-center hover:bg-primary-hover hover:text-white btn-md inline-flex items-center" data-dropdown-toggle="new-dropdown">
							<i className="ti ti-circle-plus me-1"></i>Add New
						</a>
						<div id="new-dropdown" className="hidden dropdown-menu p-5 w-[600px]">
							<div className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-6 gap-[8px]">
								<div>
									<a href="category-list.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-brand-codepen"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Category</p>
									</a>
								</div>
								<div>
									<a href="add-product.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-square-plus"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Product</p>
									</a>
								</div>
								<div>
									<a href="category-list.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-shopping-bag"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Purchase</p>
									</a>
								</div>
								<div>
									<a href="online-orders.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-shopping-cart"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Sale</p>
									</a>
								</div>
								<div>
									<a href="expense-list.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-file-text"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Expense</p>
									</a>
								</div>
								<div>
									<a href="quotation-list.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-device-floppy"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Quotation</p>
									</a>
								</div>
								<div>
									<a href="sales-returns.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-copy"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Return</p>
									</a>
								</div>
								<div>
									<a href="users.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-user"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">User</p>
									</a>
								</div>
								<div>
									<a href="customers.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-users"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Customer</p>
									</a>
								</div>
								<div>
									<a href="sales-report.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-shield"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Biller</p>
									</a>
								</div>
								<div>
									<a href="suppliers.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-user-check"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Supplier</p>
									</a>
								</div>
								<div>
									<a href="stock-transfer.html" className="group block text-center border border-border-color rounded-[8px] p-[10px] hover:bg-primary-100 hover:border-primary-100 transition-all">
										<span className="w-[36px] h-[36px] rounded-[8px] mx-auto mb-2 inline-flex items-center justify-center text-secondary bg-secondary-transparent group-hover:bg-primary group-hover:text-white transition-all">
											<i className="ti ti-truck"></i>
										</span>
										<p className="text-[13px] text-text-default group-hover:text-primary">Transfer</p>
									</a>
								</div>
							</div>
						</div> */}
            </li>

            <li className="nav-item pos-nav">
              {/* <a href="pos.html" className="btn bg-dark border border-dark text-white text-center hover:bg-black hover:text-white btn-md inline-flex items-center">
							<i className="ti ti-device-laptop me-1"></i>POS
						</a> */}
            </li>

            {/* <!-- Flag --> */}
            <li className="nav-item dropdown relative flag-nav nav-item-box">
              {/* <a className="nav-link dropdown-toggle"  data-dropdown-toggle="flag-dropdown" href="javascript:void(0);"
							role="button">
							<img src="assets/img/flags/us-flag.svg" alt="Language" className="img-fluid">
						</a>
						<div id="flag-dropdown" className="dropdown-menu hidden dropdown-menu hidden-right">
							<a href="javascript:void(0);" className="text-gray-500 rounded-[5px] font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/flags/english.svg" alt="Img" height="16">English
							</a>
							<a href="javascript:void(0);" className="text-gray-500 rounded-[5px] font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary">
								<img src="assets/img/flags/arabic.svg" alt="Img" height="16">Arabic
							</a>
						</div> */}
            </li>
            {/* <!-- /Flag --> */}
            <li className="nav-item nav-item-box">
              <Link
                href="#"
                id="btnFullscreen"
                onClick={toggleFullscreen}
                className={isFullscreen ? "Exit Fullscreen" : "Go Fullscreen"}
              >
                <i className="ti ti-maximize"></i>
              </Link>
            </li>
            <li className="nav-item nav-item-box">
              {/* <a href="email.html">
							<i className="ti ti-mail"></i>
							<span className="text-[11px] capitalize font-medium tracking-[0.5px] px-[0.45rem] py-[0.35rem] rounded-full leading-none rounded-pill">1</span>
						</a> */}
            </li>
            {/* <!-- Notifications --> */}
            <li className="nav-item dropdown relative nav-item-box">
              {/* <a href="javascript:void(0);" className="dropdown-toggle nav-link"  data-dropdown-toggle="notification-dropdown">
							<i className="ti ti-bell"></i>
						</a>
						<div id="notification-dropdown" className="dropdown-menu hidden notifications w-[350px] right-0">
							<div className="border-b border-border-color text-center text-[12px] px-[20px] py-[15px] flex items-center justify-between">
								<h5 className="notification-title">Notifications</h5>
								<a href="javascript:void(0)" className="text-primary font-medium">Mark all as read</a>
							</div>
							<div className="noti-content">
								<ul className="notification-list">
									<li className="border-b border-border-color">
										<a href="activities.html" className="block relative p-5">
											<div className="media flex">
												<span className="w-12 h-12 me-2 shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-13.jpg" className="rounded-[50%]">
												</span>
												<div className="flex-grow-1">
													<p className="text-text-default font-medium mb-1"><span className="text-gray-900">James Kirwin</span> confirmed his order.  Order No: #78901.Estimated delivery: 2 days</p>
													<p className="text-text-default">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="border-b border-border-color">
										<a href="activities.html" className="block relative p-5">
											<div className="media flex">
												<span className="w-12 h-12 me-2 shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-03.jpg" className="rounded-[50%]">
												</span>
												<div className="flex-grow-1">
													<p className="text-text-default font-medium mb-1"><span className="text-gray-900">Leo Kelly</span> cancelled his order scheduled for  17 Jan 2025</p>
													<p className="text-text-default">10 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="border-b border-border-color">
										<a href="activities.html" className="block relative p-5 recent-msg">
											<div className="media flex">
												<span className="w-12 h-12 me-2 shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-17.jpg" className="rounded-[50%]">
												</span>
												<div className="flex-grow-1">
													<p className="text-text-default font-medium mb-1">Payment of $50 received for Order #67890 from <span className="text-gray-900">Antonio Engle</span></p>
													<p className="text-text-default">05 mins ago</p>
												</div>
											</div>
										</a>
									</li>
									<li className="notification-message">
										<a href="activities.html" className="block relative p-5 recent-msg">
											<div className="media flex">
												<span className="w-12 h-12 me-2 shrink-0">
													<img alt="Img" src="assets/img/profiles/avatar-02.jpg" className="rounded-[50%]">
												</span>
												<div className="flex-grow-1">
													<p className="text-text-default font-medium mb-1"><span className="text-gray-900">Andrea</span> confirmed his order.  Order No: #73401.Estimated delivery: 3 days</p>
													<p className="text-text-default">4 mins ago</p>
												</div>
											</div>
										</a>
									</li>
								</ul>
							</div>
							<div className="border-t border-border-color text-center px-[20px] py-[15px] flex items-center gap-3">
								<a href="#" className="btn bg-secondary border border-secondary text-white text-center hover:bg-secondary-hover hover:text-white btn-md w-100">Cancel</a>
								<a href="activities.html" className="btn bg-primary border border-primary text-white text-center hover:bg-primary-hover hover:text-white btn-md w-100">View all</a>
							</div>
						</div> */}
            </li>
            {/* <!-- /Notifications --> */}

            <li className="nav-item nav-item-box">
              {/* <a href="general-settings.html"><i className="ti ti-settings"></i></a> */}
            </li>
            <li className="nav-item dropdown relative profile-nav">
              <a
                href="javascript:void(0);"
                className="nav-link userset"
                data-dropdown-toggle="profile-dropdown"
              >
                <span className="user-info p-0">
                  <span className="user-letter flex items-center justify-center text-white w-8 h-8 font-semibold text-[15px] rounded-[10px]">
                    <img
                      src="assets/img/profiles/avator1.jpg"
                      alt="Img"
                      className="img-fluid"
                    />
                  </span>
                </span>
              </a>
              <div
                id="profile-dropdown"
                className="dropdown-menu menu-drop-user hidden"
              >
                <div className="bg-light mb-2 p-4 rounded-[5px] flex items-center">
                  <span className="user-img me-2">
                    <img
                      src="assets/img/profiles/avator1.jpg"
                      alt="Img"
                      className="w-10 h-10 shrink-0 rounded-[50%]"
                    />
                  </span>
                  <div>
                    <h6 className="font-medium">John Smilga</h6>
                    <p>Admin</p>
                  </div>
                </div>
                <a
                  className="dropdown-item flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                  href="profile.html"
                >
                  <i className="ti ti-user-circle me-2"></i>My Profile
                </a>
                <a
                  className="dropdown-item flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                  href="sales-report.html"
                >
                  <i className="ti ti-file-text me-2"></i>Reports
                </a>
                <a
                  className="dropdown-item flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                  href="general-settings.html"
                >
                  <i className="ti ti-settings-2 me-2"></i>Settings
                </a>
                <hr className="my-2" />
                <a
                  className="dropdown-item flex items-center font-medium text-danger px-4 py-2 hover:text-danger-hover hover:bg-primary/5 focus:bg-primary/5 focus:text-danger-hover active:bg-primary/5 active:text-danger-hover"
                  href="signin.html"
                >
                  <i className="ti ti-logout me-2"></i>Logout
                </a>
              </div>
            </li>
          </ul>
          <div className="dropdown mobile-user-menu">
            <a
              href="javascript:void(0);"
              className="nav-link dropdown-toggle"
              data-dropdown-toggle="mobile-dropdown"
            >
              <i className="fa fa-ellipsis-v"></i>
            </a>
            <div
              className="dropdown-menu hidden dropdown-menu hidden-right"
              id="mobile-dropdown"
            >
              <a
                className="flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                href="profile.html"
              >
                My Profile
              </a>
              <a
                className="flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                href="general-settings.html"
              >
                Settings
              </a>
              <a
                className="flex items-center font-medium px-4 py-2 hover:text-primary hover:bg-primary/5 focus:bg-primary/5 focus:text-primary active:bg-primary/5 active:text-primary"
                href="signin.html"
              >
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
