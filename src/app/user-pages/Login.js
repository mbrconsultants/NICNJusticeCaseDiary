import  { Component } from 'react';
import React, { useContext, useRef, useState } from "react";
import { Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import { Context } from '../../auth/Context';
import endpoint from "../../auth/endpoint"
import {SuccessAlert, ErrorAlert } from "../../toasst/toast"

 const Login = ()=> {
  const emailRef = useRef()
  const passwordRef = useRef()
  const [loading, setLoading] = useState(false)
  const { dispatch } = useContext(Context);



  const handleSbmit = async (e) =>{
    e.preventDefault();
    dispatch({type: "LOGIN_START"});
    setLoading(true)
    try {
      const res = await endpoint.post("/auth/login", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      })
var me;
      const modules = await endpoint.get(`/assignsubmodule/list/permission/user/${res.data.data.user.id}`)
      console.log(modules.data.data)
      me = localStorage.setItem("modules", JSON.stringify(modules.data.data))

      delete res.data.data.user.password
      console.log("login response", res.data.data)
      console.log("login response", me)

      res.data.data && setLoading(false);
      res.data.data && dispatch({type: "LOGIN_SUCCESS", payload: res.data.data});
       SuccessAlert(res.data.data.message)
      res.data.data && window.location.replace('/dashboard')
    } catch (error) {
        dispatch({type: "LOGIN_FAILURE" });
        setLoading(false)
        console.log(error.data)
        ErrorAlert(error.response.data.message)

       }
    }
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo text-center">
                  <img src={require("../../assets/images/nicn-logo.png")} alt="logo" />
                </div>
                <h4 className='text-center'>Hello! let's get started</h4>
                <h6 className="font-weight-light text-center">Sign in to continue.</h6>
                <Form className="pt-3"  onSubmit={handleSbmit}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="email" placeholder="email" size="lg" className="h-auto"   ref={emailRef}/>
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="password" placeholder="Password" size="lg" className="h-auto" ref={passwordRef} />
                  </Form.Group>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input"/>
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>
                    <a href="/forgetpassword"  className="auth-link text-black">Forgot password?</a>
                  </div>
                  <div className="mt-3">
                    <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" id='login-btn' >SIGN IN</button>
                  </div>

                  <div className="text-center mt-4 font-weight-light">
                    No account? <Link to="/sign-up" className="text-primary">Sign Up</Link>
                  </div>
                 
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }


export default Login
