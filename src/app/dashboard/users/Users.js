import React, { Component } from "react";
import {useEffect, useState} from "react";
import { useForm } from 'react-hook-form';
import {Modal } from "react-bootstrap";
import endpoint from "../../../auth/endpoint"
import {SuccessAlert, ErrorAlert } from "../../../toasst/toast"

import { CForm, CCol, CFormLabel, CFormFeedback, CFormInput, CInputGroup, CInputGroupText, CButton, CFormCheck, } from "@coreui/react";
import {
	Col,
	Row,
	Card,
	Form,
	FormGroup,
	FormControl,
	ListGroup,
	Button,
	Breadcrumb,
  } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";

export const Users =() =>{
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [users, setUsersList] = useState([]);
	const [roles, setUsersRoles]=useState([]);

	const [isLoading, setLoading] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id: "",
		first_name: "",
		other_name: "",
		last_name: "",

		email: "",
		role_id: "",
		role_name:"",
		password: ""

	});
    const { register, handleSubmit, formState: { errors }, reset } = useForm()
	
	const openEditModal = async () => {
		SetEditModal(true)
		
	  }
	  const closeEditModal = async () => {
		reset()
		SetEditModal(false)
		
	  }

	  const openDeleteModal = async () => {
		
		SetDeleteModal(true)
		
	  }
	  const closeDeleteModal = async () => {
		SetDeleteModal(false)
		
	  }
	  const getUsersList = async () => {
		setLoading(true);
		await endpoint.get('/user/list')
		  .then((res) => {
			console.log("users list response", res.data.data)
			setUsersList(res.data.data)
			setLoading(false)
		  })
		  .catch((err) => {
			setLoading(false)
			console.log(err)
		  })
	  }


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
		  getUsersList()
		}, [])
	
	  const handleEditUser= async (data)=>{
		console.log('data', data);
		setLoading(true);
		try {
		  await endpoint.put(`/user/edit/${data.id}`, data)
			.then((res) => {
			  SuccessAlert(res.data.message);
			  getUsersList()
			  SetEditModal(false)
			})
			.catch((err) => {
			  ErrorAlert(err.response.data.message);
			  console.log(err);
			});
		} catch (error) {
		  console.log(error);
		}

	  }
	  const deleteUser= async(data)=>{
		console.log("delete", data.id);
		try {
			await endpoint.delete(`/user/delete/${data.id}`)
			  .then((res) => {
				SuccessAlert(res.data.message);
				getUsersList()
				SetDeleteModal(false)
			  })
			  .catch((err) => {
				ErrorAlert(err.response.data.message);
				console.log(err);
			  });
		  } catch (error) {
			console.log(error);
		  }

	  }
	 
	
		return (
			<div>
				<div className="page-header">
					<h3 className="page-title"> User </h3>
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">
								<a
									href="!#"
									onClick={(event) => event.preventDefault()}>
									All
								</a>
							</li>
							<li
								className="breadcrumb-item active"
								aria-current="page">
								{" "}
								User
							</li>
						</ol>
					</nav>
				</div>

				<div className="row">
					<div className="col-12 grid-margin">
						<div className="card">
							<div className="card-body">
								<h4 className="card-title">All Users</h4>
								<div className="table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th> S/N </th>
												<th> Names </th>
												<th> Emails </th>
												<th> Roles </th>
												<th> Actions </th>
											</tr>
										</thead>
										<tbody>
											
										{users.map((user, index)=>
											<tr key={user.id}>
												<td>{index+1}</td>
												<td>
													
													{user.first_name +" "+user.other_name +" "+ user.last_name}
												</td>
												<td>{user.email}</td>
												<td>
													
													{user.Role.role_name}
													
													
												</td>
												<td>
													<button
													onClick={() => {
														reset()
														setSelectedRow({ id: user.id, first_name: user.first_name, other_name: user.other_name, last_name: user.last_name,email: user.email, role_id:user.role_id, role_name:user.Role.role_name});
														openEditModal();
													}}
														className="btn btn-primary btn-sm"
														>
														Edit
													</button>
													<button
													onClick={() => {
														reset()
														setSelectedRow({ id: user.id, first_name: user.first_name, other_name: user.other_name, last_name: user.last_name,email: user.email, role_id:user.role_id, role_name:user.Role.role_name});
														openDeleteModal();
													}}

														className="btn btn-warning btn-sm"
														>
														Delete
													</button>
												</td>
											</tr>
											)}
											
										</tbody>
									</table>
				<Modal show={editModal} >
                    <Modal.Header >
                        <Button
                            onClick={() => SetEditModal(false)}
                            className="btn-close"
                            variant=""
                        >
                            x
                        </Button>
                    </Modal.Header>
					<div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Update User Details</h2>
                <p className="card-description text-center"> Input updated details </p>
                <form className="forms-sample" onSubmit={handleSubmit(handleEditUser)}>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">First Name</label>
                    <Form.Control type="text" defaultValue={selectedRow.first_name} {...register("first_name")} className="form-control" id="exampleInputName1" placeholder="First Name" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Last Name</label>
					<input type="hidden" defaultValue={selectedRow.id} {...register("id")} />
                    <Form.Control type="text" defaultValue={selectedRow.last_name} {...register("last_name")} className="form-control" id="exampleInputName1" placeholder="Last Name" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Others Name</label>
                    <Form.Control type="text" defaultValue={selectedRow.other_name} {...register("other_name")} className="form-control" id="exampleInputName1" placeholder="Others Name" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Email</label>
                    <Form.Control type="text" defaultValue={selectedRow.email}  {...register("email")} className="form-control" id="exampleInputName1" placeholder="Phone Number" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleSelectGender">Role</label>
                    <select {...register("role_id")} className="form-control" id="exampleSelectGender">
                    <option value={selectedRow.role_id}>{selectedRow.role_name}</option>
					{roles.map((role)=>
                      <option key={role.id} value={role.id}>{role.role_name}</option>
                      )}
                    </select>
                  </Form.Group>
				  {/* <Form.Group>
                    <label htmlFor="exampleInputName1">Password</label>
                    <Form.Control type="text"  className="form-control" id="exampleInputName1" placeholder="Others Name" />
                  </Form.Group> */}
                  <button type="submit" className="btn btn-gradient-primary mr-2">Submit</button>
                
                </form>
              </div>
            </div>
          </div>
        
          </div>
                </Modal>

				<Modal show={deleteModal} >
                    <Modal.Header >
                        <Button
                            onClick={() => SetDeleteModal(false)}
                            className="btn-close"
                            variant=""
                        >
                            x
                        </Button>
                    </Modal.Header>
					<div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <p className="card-description text-center"> Do you want to delete this user? </p>
                <form className="forms-sample" onSubmit={handleSubmit(deleteUser)}>
                  <Form.Group>
                    
                    <p> {selectedRow.first_name+ ' '+ selectedRow.last_name} </p>
                  </Form.Group>
                  
				  <Form.Group>
                   
                    <Form.Control type="hidden" defaultValue={selectedRow.id} {...register("id")} className="form-control" id="exampleInputName1"  />
                  </Form.Group>
                  
                  
                  <button type="submit" className="btn btn-gradient-primary mr-2">Submit</button>
                
                </form>
              </div>
            </div>
          </div>
        
          </div>
                </Modal>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
export default Users;


