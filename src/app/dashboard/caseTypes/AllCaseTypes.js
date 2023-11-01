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

export const AllCaseTypes = () => {
	// const { register, handleSubmit, formState: { errors }, reset } = useForm()

	const [caseTypes, setcaseType] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id: "",
		case_type: "",
		case_color: "",
		status: ""
	});
	const [rowToDelete, setSelectedRowToDelete] = useState('')
	// const [formData, setFormData] = useState({});

	useEffect(() => {
		getCaseTypesList()
	}, [])

	const getCaseTypesList = async () => {
		setLoading(true);
		await endpoint.get('/case-type/list')
			.then((res) => {
				console.log("case list response", res.data.data)
				setcaseType(res.data.data)
				setLoading(false)
			})
			.catch((err) => {
				setLoading(false)
				console.log(err)
			})
	}
	const openEditModal = async () => {
		SetEditModal(true)
	}

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}

	const updateCaseType = async (e) => {
		e.preventDefault()
		setLoading(true)
		console.log("data update", selectedRow)
		await endpoint.put(`/case-type/edit/${selectedRow.id}`, selectedRow)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getCaseTypesList()
				SetEditModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetEditModal(false)
				ErrorAlert(err.response.data.message)
			})
	}

	const deleteCaseType = async (e, id) => {
		e.preventDefault()
		setLoading(true)
		await endpoint.delete(`/case-type/delete/${id}`)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getCaseTypesList()
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
			<div className="page-header">
				<h3 className="page-title"> Case Types </h3>
				<nav aria-label="breadcrumb">
					<ol className="breadcrumb">
						<li className="breadcrumb-item">
							<a
								href="new-case-type"
							>
								Create Case Type
							</a>
						</li>
						<li
							className="breadcrumb-item active"
							aria-current="page">
							{" "}
							Case Types
						</li>
					</ol>
				</nav>
			</div>

			<div className="row">
				<div className="col-12 grid-margin">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title"> All CaseTypes</h4>
							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th> S/N</th>
											<th> Case Type </th>
											<th> Colour </th>
											<th> Action </th>
										</tr>
									</thead>
									<tbody>

										{isLoading && <Loader />}

										{!isLoading && <>
											{caseTypes.map((casetype, index) =>
												<tr key={casetype.id}>
													<td>
														{index + 1}
													</td>
													<td>{casetype.case_type}</td>
													<td> <span className="btn d-flex justify-content-center" style={{ backgroundColor: `${casetype.case_color}`, borderRadius: "10px", height: "30px", width: "30px", color: "white" }}> {casetype.case_color} </span> </td>
													<td>
														<Button
															onClick={() => {
																setSelectedRow({
																	id: casetype.id,
																	case_type: casetype.case_type,
																	case_color: casetype.case_color,
																	status: casetype.status
																});
																// setFormData(casetype);
																openEditModal();
															}}
															className="btn btn-primary btn-sm"
														>
															Edit
														</Button>
														<Button
															onClick={() => {
																setSelectedRowToDelete(casetype);
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
																		<h2 className="card-title text-center">Update Case Types</h2>
																		<p className="card-description text-center"> Input update details </p>
																		<form className="forms-sample" onSubmit={updateCaseType}>
																			<Form.Group>
																				<label htmlFor="exampleInputName1">Case Type Name</label>
																				<Form.Control type="text" className="form-control" value={selectedRow.case_type} onChange={(e) => setSelectedRow({ ...selectedRow, case_type: e.target.value })} id="exampleInputName1" />
																			</Form.Group>
																			<Form.Group>
																				<label htmlFor="exampleInputName1">Case Type Color</label>
																				{/* <Form.Control type="text" className="form-control" value={selectedRow.case_color} onChange={(e) => setSelectedRow({ ...selectedRow, case_color: e.target.value })} id="exampleInputName1" /> */}
																				<select
																					className="form-control"
																					value={selectedRow.case_color}
																					onChange={(e) => setSelectedRow({ ...selectedRow, case_color: e.target.value })}
																				>
																					<option value="">--Select--</option>
																					<option key={1} value={'green'} selected={"green" === selectedRow.case_color}> Green </option>
																					<option key={2} value={'red'} selected={"red" === selectedRow.case_color}> Red </option>
																					<option key={3} value={'blue'} selected={"blue" === selectedRow.case_color}> Blue </option>
																					<option key={4} value={'violet'} selected={"violet" === selectedRow.case_color}> Violet </option>
																				</select>
																			</Form.Group>
																			<Form.Group>
																				<label htmlFor="exampleSelectGender">Status</label>
																				<select className="form-control" id="exampleSelectGender" value={selectedRow.status} onChange={(e) => setSelectedRow({ ...selectedRow, status: e.target.value })}>
																					<option >--Select--</option>
																					<option value={1}>Active</option>
																					<option value={0}>Not Active</option>
																				</select>
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
																		<p className="card-description text-center"> Do you want to delete {rowToDelete.case_type} Case Type? </p>
																		<form className="forms-sample">
																			<Form.Group>
																				{/* <label htmlFor="exampleInputName1">{rowToDelete.case_type} </label> */}

																			</Form.Group>
																			<button type="button" onClick={(e) => deleteCaseType(e, rowToDelete.id)} className="btn btn-danger mr-2">Delete</button>
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


export default AllCaseTypes;
