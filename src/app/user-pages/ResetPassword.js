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
  
  
    const handleSbmit = async (data) =>{
        console.log("data", data);
        setLoading(true);
		await endpoint
			.post("/auth/reset-password", data)
			.then((res) => {
                SuccessAlert(res.data.data.message)
				history.push(`/login`);
				setLoading(false);
			})
			.catch((error) => {
                ErrorAlert(error.response.data.message)
				setLoading(false);
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
                <h4 className='text-center'>Input details to reset password</h4>
                {/* <h6 className="font-weight-light text-center">Input email to continue.</h6> */}
                <Form className="pt-3" onSubmit={handleSubmit(handleSbmit)} >
                <Form.Group>
									<label htmlFor="exampleInputName1">Token</label>
									<Form.Control
										type="text"
                                        {...register("token")} 
										className="form-control"
										id="exampleInputName1"
										placeholder="Token"
									/>
								</Form.Group>
                  <Form.Group>
									<label htmlFor="exampleInputName1"> Email</label>
									<Form.Control
										type="email"
										{...register("email")} 
										className="form-control"
										id="exampleInputName1"
										placeholder="Email Address"
									/>
								</Form.Group>
                                <Form.Group>
									<label htmlFor="exampleInputName1">New Password</label>
									<Form.Control
										type="text"
                                        {...register("password")} 
										className="form-control"
										id="exampleInputName1"
										placeholder="New Password"
									/>
								</Form.Group>
                                <Form.Group>
									<label htmlFor="exampleInputName1">Confirm Password</label>
									<Form.Control
										type="text"
                                        {...register("confirm_password")} 
										className="form-control"
										id="exampleInputName1"
										placeholder="Confirm Password"
									/>
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
