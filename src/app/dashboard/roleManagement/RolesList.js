import React, { Component } from "react";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import { Modal } from "react-bootstrap";
import endpoint from "../../../auth/endpoint"
import {
	Col,
	Row,
	Card,
	Form,
	FormGroup,
	FormControl,
	ListGroup,
	Button,
	Breadcrumb, Badge
} from "react-bootstrap";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Loader from "react-loader-advanced";

export const RoleList = ({roleList, getroleListList}) => {
	// const { register, handleSubmit, formState: { errors }, reset } = useForm()

	
	const [isLoading, setLoading] = useState(false);
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id: "",
		name: "",
		description: "",
		status: ""
	});
	const [rowToDelete, setSelectedRowToDelete] = useState('')
	// const [formData, setFormData] = useState({});

	


	const openEditModal = async () => {
		SetEditModal(true)
	}

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}

	const updaterole = async (e) => {
		e.preventDefault()
		setLoading(true)
		console.log("data update", selectedRow)
		await endpoint.put(`/case-type/edit/${selectedRow.id}`, selectedRow)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getroleListList()
				SetEditModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetEditModal(false)
				ErrorAlert(err.response.data.message)
			})
	}

	const deleterole = async (e, id) => {
		e.preventDefault()
		setLoading(true)
		await endpoint.delete(`/case-type/delete/${id}`)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getroleListList()
				SetDeleteModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetDeleteModal(false)
				ErrorAlert(err.response.data.message)
			})
	}

	return (
		<div>
			
			<div className="row">
				<div className="col-12 grid-margin">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title text-center"> role</h4>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th> S/N</th>
											<th> Name</th>
											<th> Description </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody>

										{isLoading && <Loader />}

										{!isLoading && <>
											{roleList.map((role, index) =>
												<tr key={role.id}>
													<td>
														{index + 1}
													</td>
													<td>{role.role_name}</td>
													<td>  {role.role_description}  </td>
													<td>
														<Button
															onClick={() => {
																setSelectedRow({
																	id: role.id,
																	name: role.role_name,
																	description: role.role_description,
																
																});
																// setFormData(role);
																openEditModal();
															}}
															className="btn btn-primary btn-sm"
														>
															Edit
														</Button>
														<Button
															onClick={() => {
																setSelectedRowToDelete(role);
																openDeleteModal();
															}}

															className="btn btn-warning btn-sm"
														>
															Delete
														</Button>
													</td>

													<Modal show={editModal} >
														<Modal.Header >
															<Button
																onClick={() => { setSelectedRow(""); SetEditModal(false) }}
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
																		<h2 className="card-title text-center">Update Role</h2>
																		<p className="card-description text-center"> Input updated details </p>
																		<form className="forms-sample" onSubmit={updaterole}>
																			<Form.Group>
																				<label htmlFor="exampleInputName1">Role Name</label>
																				<Form.Control type="text" className="form-control" value={selectedRow.name} onChange={(e) => setSelectedRow({ ...selectedRow, role_name: e.target.value })} id="exampleInputName1" />
																			</Form.Group>
                                                                            <Form.Group>
																																<label htmlFor="exampleInputName1">Role Description </label>
																																<Form.Control as="textarea" rows={3} className="form-control" id="exampleInputName1"
																																				placeholder="Role Description" value={selectedRow.description}
																																				onChange={(e)=> setSelectedRow({ ...selectedRow, role_description: e.target.value })}
																																				/>
																												</Form.Group>
																		
																			

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
																		<p className="card-description text-center"> Do you want to delete {rowToDelete.role_name} Role? </p>
																		<form className="forms-sample">
																			<Form.Group>
																				{/* <label htmlFor="exampleInputName1">{rowToDelete.name} </label> */}

																			</Form.Group>
																			<button type="button" onClick={(e) => deleterole(e, rowToDelete.id)} className="btn btn-danger mr-2">Delete</button>
																		</form>
																	</div>
																</div>
															</div>

														</div>
													</Modal>
												</tr>
											)}
										</>
										}

									</tbody>
								</table>


							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}



