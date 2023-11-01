import  { Component } from 'react';
import React, { useContext, useRef, useState } from "react";
import { Form } from 'react-bootstrap';
import { Context } from '../../auth/Context';
import endpoint from "../../auth/endpoint"
import {SuccessAlert, ErrorAlert } from "../../toasst/toast"
import { useForm } from 'react-hook-form';
import { Link, useHistory, useParams } from "react-router-dom";


 const ForgotPassword = ()=> {
    const history = useHistory();
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const { dispatch } = useContext(Context);
    const [value, setEmail]=useState({
        email:""}
    );
  
  
    const handleSbmit = async (data) =>{
        console.log("data", data);
        setLoading(true);
		await endpoint
			.post("/auth/forgot-password", data)
			.then((res) => {
                SuccessAlert(res.data.data.message)
				history.push(`/reset-password`);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
                ErrorAlert(error.response.data.message)
				console.log(error);
			});
    }
  
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                <div className="brand-logo text-center">
                  <img src={require("../../assets/images/njc-logo.jpg")} alt="logo" />
                </div>
                <h4 className='text-center'>Input Your Email Address</h4>
                {/* <h6 className="font-weight-light text-center">Input email to continue.</h6> */}
                <Form className="pt-3" onSubmit={handleSubmit(handleSbmit)} >
                  <Form.Group className="d-flex search-field">
                    <Form.Control type="email" placeholder="email" size="lg" className="h-auto"  {...register("email")} name='email'/>
                  </Form.Group>
                 
                  <div className="mt-3">
                    <button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" id='login-btn' >Submit</button>
                  </div>
                
                
                 
                </Form>
              </div>
            </div>
          </div>
        </div>  
      </div>
    )
  }


export default ForgotPassword
