import React, { useState, useContext, useEffect } from "react";
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input'
import { useForm } from 'react-hook-form';
import endpoint from "../../../auth/endpoint"
import { Context } from "../../../auth/Context";
import { CForm, CCol, CFormLabel, CFormFeedback, CFormInput, CInputGroup, CInputGroupText, CButton, CFormCheck, } from "@coreui/react";
import {SuccessAlert, ErrorAlert } from "../../../toasst/toast"
import { Link, useHistory  } from "react-router-dom";
// import { Link, useNavigate  } from "react-router-dom";


  export const NewUser = () => {

    const { user, dispatch } = useContext(Context);
	const currentUser = user?.user;
		console.log("user id",currentUser.id);
		const userID=currentUser.id;
   const history =useHistory();
   const [roles, setUsersRoles]=useState([]);
 
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
    const [isLoading, setLoading] = useState(false);

 

    const handleCreateUser = async (data) => {
      console.log("form data", data);
      setLoading(true);
      try {
        await endpoint.post('/user/create', data)
          .then((res) => {
            SuccessAlert(res.data.data.message);
            history.push(`/users`);
          })
          .catch((err) => {
            ErrorAlert(err.response.data.message);
            console.log(err);
          });
      } catch (error) {
        console.log(error);
      }
    
      console.log(data)
    };
    const getUsersRoles = async () => {
      setLoading(true);
      await endpoint.get('/role/list')
        .then((res) => {
        console.log("role list response", res.data.data)
        setUsersRoles(res.data.data)
        setLoading(false)
        })
        .catch((err) => {
        setLoading(false)
        console.log(err)
        })
      }
  
      useEffect(() => {
        getUsersRoles()
      }, [])


    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> User </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="!#" onClick={event => event.preventDefault()}>Forms</a></li>
              <li className="breadcrumb-item active" aria-current="page">New User</li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Registration Form</h2>
                <p className="card-description text-center"> Input details Create User </p>
                <form className="forms-sample"  onSubmit={handleSubmit(handleCreateUser)}>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">First Name</label>
                    <Form.Control type="text"
                    {...register("first_name")} name="first_name" className="form-control" id="exampleInputName1" placeholder="First Name" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Last Name</label>
                    <Form.Control type="text" name="last_name" className="form-control" {...register("last_name")} id="exampleInputName1" placeholder="Last Name" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Others Name</label>
                    <Form.Control type="text" name="other_name" className="form-control" {...register("other_name")} id="exampleInputName1" placeholder="Others Name" />
                  </Form.Group>
                
                  <Form.Group>
                    <label htmlFor="exampleInputEmail3">Email address</label>
                    <Form.Control type="email" name="email" {...register("email")} className="form-control" id="exampleInputEmail3" placeholder="Email" />
                  </Form.Group>
                    <Form.Group>
                    <label htmlFor="exampleSelectGender">Role</label>
                    <select className="form-control" id="exampleSelectGender" {...register("role_id")}>
                      <option value=''>--select--</option>
                      {roles.map((role)=>
                      <option key={role.id} value={role.id}>{role.role_name}</option>
                      )}
                    </select>
                  </Form.Group>
                  {/* <Form.Group>
                    <label>File upload</label>
                    <div className="custom-file">
                      <Form.Control type="file" className="form-control visibility-hidden" id="customFileLang" lang="es"/>
                      <label className="custom-file-label" htmlFor="customFileLang">Upload image</label>
                    </div>
                  </Form.Group> */}
                 
                  
                  <CButton color="primary" type="submit">
                                        <span className='fe fe-plus'></span>{isLoading ? "Saving data..." : "Save"} 
                                    </CButton>
                
                </form>
              </div>
            </div>
          </div>
        
          </div>
        </div>
      
    )
  }


export default NewUser
