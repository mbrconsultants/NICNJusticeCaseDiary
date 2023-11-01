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

export const ModuleList = ({moduleList, getModuleList}) => {
	// const { register, handleSubmit, formState: { errors }, reset } = useForm()

	
	const [isLoading, setLoading] = useState(false);
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id: "",
		module_name: "",
		rank: "",
		icon: ""
	});
	const [rowToDelete, setSelectedRowToDelete] = useState('')
	// const [formData, setFormData] = useState({});

	


	const openEditModal = async () => {
		SetEditModal(true)
	}

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}

	const updatemodule = async (e) => {
		e.preventDefault()
		setLoading(true)
		console.log("data update", selectedRow)
		await endpoint.put(`/modules/updateModule/${selectedRow.id}`, selectedRow)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getModuleList()
				SetEditModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetEditModal(false)
				ErrorAlert(err.response.data.message)
			})
	}

	const deletemodule = async (e, id) => {
		e.preventDefault()
		setLoading(true)
		await endpoint.delete(`/modules/deleteModule/${id}`)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getModuleList()
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
							<h4 className="card-title text-center"> module</h4>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th> S/N</th>
											<th> Name</th>
											<th> Rank </th>
											<th> Icon </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody>

										{isLoading && <Loader />}

										{!isLoading && <>
											{moduleList.map((module, index) =>
												<tr key={module.id}>
													<td>
														{index + 1}
													</td>
													<td>{module.module_name}</td>
													<td>  {module.rank}  </td>
													<td>  {module.icon}  </td>

													<td>
														<Button
															onClick={() => {
																setSelectedRow({
																	id: module.id,
																	module_name: module.module_name,
																	rank: module.rank,
																	icon: module.icon,

																
																});
																// setFormData(module);
																openEditModal();
															}}
															className="btn btn-primary btn-sm"
														>
															Edit
														</Button>
														<Button
															onClick={() => {
																setSelectedRowToDelete(module);
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
																		<h2 className="card-title text-center">Update module</h2>
																		<p className="card-description text-center"> Input updated details </p>
																		<form className="forms-sample" onSubmit={updatemodule}>
																			<Form.Group>
																				<label htmlFor="exampleInputName1">module Name</label>
																				<Form.Control type="text" className="form-control" defaultValue={selectedRow.module_name} onChange={(e) => setSelectedRow({ ...selectedRow, module_name: e.target.value })} id="exampleInputName1" />
																			</Form.Group>
                                                                            <Form.Group>
                                                                                    <label htmlFor="exampleInputName1">module Rank </label>
                                                                                    <Form.Control as="textarea" rows={3} className="form-control" id="exampleInputName1"
                                                                                                    placeholder="module Description" value={selectedRow.rank}
                                                                                                    onChange={(e)=> setSelectedRow({ ...selectedRow, rank: e.target.value })}
                                                                                                    />
                                                                              </Form.Group>
                                                                              <Form.Group>
                                                                                    <label htmlFor="exampleInputName1">module Icon </label>
                                                                                    <Form.Control as="textarea" rows={3} className="form-control" id="exampleInputName1"
                                                                                                    placeholder="module Description" value={selectedRow.icon}
                                                                                                    onChange={(e)=> setSelectedRow({ ...selectedRow, icon: e.target.value })}
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
																		<p className="card-description text-center"> Do you want to delete {rowToDelete.module_name} module? </p>
																		<form className="forms-sample">
																			<Form.Group>
																				{/* <label htmlFor="exampleInputName1">{rowToDelete.name} </label> */}

																			</Form.Group>
																			<button type="button" onClick={(e) => deletemodule(e, rowToDelete.id)} className="btn btn-danger mr-2">Delete</button>
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



