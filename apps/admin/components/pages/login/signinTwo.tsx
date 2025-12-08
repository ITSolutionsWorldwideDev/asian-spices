// apps\admin\components\pages\login\signinTwo.tsx
"use client";
/* eslint-disable @next/next/no-img-element */

import { all_routes } from "@/data/all_routes";
import Link from "next/link";
import React, { useState } from "react";

export default function SigninTwoComponent() {
  const route = all_routes;
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };
  return (
    <>
      <div id="global-loader">
        <div className="whirly-loader"> </div>
      </div>
      {/* <!-- Main Wrapper --> */}
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper">
            <div className="grid grid-cols-1 lg:grid-cols-2 m-0">
              <div className="p-0">
                <div className="login-content">
                  <form action="index.html">
                    <div className="login-userset">
                      {/* <div className="login-logo logo-normal">
                        <img src="assets/img/logo.svg" alt="img" />
                      </div> */}
                      <a href="index.html" className="login-logo logo-white">
                        <img src="assets/img/logo.svg" alt="Img" />
                      </a>
                      <div className="login-userheading">
                        <h3>Sign In</h3>
                        <h4 className="text-[16px]">
                          Access the Asian Spices panel using your email and
                          passcode.
                        </h4>
                      </div>
                      <div className="mb-4">
                        {" "}
                        <label className="form-label block mb-2">
                          Email <span className="text-red-600"> *</span>
                        </label>
                        <div className="input-group w-auto input-group-flat">
                          <input type="text" className="form-control" name="username" />
                          <span className="input-group-text">
                            <i className="ti ti-mail"></i>
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label block mb-2">
                          Password<span className="text-red-600"> *</span>
                        </label>
                        <div className="relative pass-group">
                          <input
                            type="password"
                            className="form-control w-full pass-input"
                            value="12345678"
                            name="password"
                          />
                          <span className="absolute right-3 -translate-y-2/4 top-2/4 cursor-pointer text-gray-900 ti toggle-password ti-eye-off"></span>
                        </div>
                      </div>
                      <div className="form-login authentication-check">
                        <div className="flex flex-wrap">
                          <div className="w-full flex items-center justify-between">
                            <div className="form-check">
                              <input
                                className="text-primary rounded border-borderColor"
                                type="checkbox"
                                value=""
                                id="flexCheckDefault"
                              />
                              <label className="form-check-label">
                                Remember me
                              </label>
                            </div>
                            <div className="text-right">
                              <a
                                className="text-orange text-[16px] font-medium"
                                href="forgot-password-2.html"
                              >
                                Forgot Password?
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-login">
                        <button type="submit" className="btn btn-login">
                          Sign In
                        </button>{" "}
                      </div>
                      <div className="signinform">
                        <h4>
                          New on our platform?
                          <a href="register-2.html" className="hover-a">
                            {" "}
                            Create an account
                          </a>
                        </h4>
                      </div>
                      <div className="my-6 flex justify-center items-center copyright-text">
                        <p>Copyright &copy; 2025 Asian Spices</p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <div className="p-0">
                <div className="login-img w-full h-screen justify-items-center content-center">
                  <img
                    src="assets/img/Login Art.png"
                    alt="img"
                    width={400}
                    height={400}
                    className="align-middle justify-items-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

{
  /* Main Wrapper */
}
{
  /* <div className="main-wrapper">
        <div className="account-content">
          <div className="row login-wrapper m-0">
            <div className="col-lg-6 p-0">
              <div className="login-content">
                <form >
                  <div className="login-userset">
                    <div className="login-logo logo-normal">
                      <img src="assets/img/logo.svg" alt="img" />
                    </div>
                    <Link href={route.dashboard} className="login-logo logo-white">
                      <img src="assets/img/logo.svg" alt="Img" />
                    </Link>
                    <div className="login-userheading">
                      <h3>Sign In</h3>
                      <h4>
                        Access the Asian Spices panel using your email and passcode.
                      </h4>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Email Address</label>
                      <div className="input-group">
                        <input
                          type="text"
                          defaultValue=""
                          className="form-control border-end-0"
                        />
                        <span className="input-group-text border-start-0">
                          <i className="ti ti-mail" />
                        </span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <div className="pass-group">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          className="pass-input form-control"
                        />
                        <span
                          className={`ti toggle-password ${isPasswordVisible ? "ti-eye" : "ti-eye-off"
                            }`}
                          onClick={togglePasswordVisibility}
                        ></span>
                      </div>
                    </div>
                    <div className="form-login authentication-check">
                      <div className="row">
                        <div className="col-6">
                          <div className="custom-control custom-checkbox">
                            <label className="checkboxs ps-4 mb-0 pb-0 line-height-1">
                              <input type="checkbox" />
                              <span className="checkmarks" />
                              Remember me
                            </label>
                          </div>
                        </div>
                        <div className="col-6 text-end">
                          <Link className="forgot-link" href={route.forgotPasswordTwo}>
                            Forgot Password?
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="form-login">
                      <button type="submit" className="btn btn-login">
                        Sign In
                      </button>
                    </div>
                    <div className="signinform">
                      <h4>
                        New on our platform?
                        <Link href={route.registerTwo} className="hover-a">
                          {" "}
                          Create an account
                        </Link>
                      </h4>
                    </div>
                    <div className="form-setlogin or-text">
                      <h4>OR</h4>
                    </div>
                    <div className="form-sociallink">

                      <div className="my-4 d-flex justify-content-center align-items-center copyright-text">
                        <p>Copyright © 2025 Asian Spices</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6 p-0">
              <div className="login-img">
                <img
                  src="assets/img/authentication/authentication-01.svg"
                  alt="img"
                />
              </div>
            </div>
          </div>
        </div>
      </div> */
}
{
  /* /Main Wrapper */
}
