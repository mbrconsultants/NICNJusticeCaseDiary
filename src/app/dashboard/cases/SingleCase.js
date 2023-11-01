import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useEffect, useState, useContext } from "react";
import endpoint from "../../../auth/endpoint";
import { useParams } from "react-router-dom";
import { Context } from "../../../auth/Context";

import { Modal } from "react-bootstrap";
import {
	Col,
	Row,
	Card,
	FormGroup,
	FormControl,
	ListGroup,
	Button,
	Breadcrumb,
} from "react-bootstrap";
import SisterCase from "./SisterCases";
import SittingJustices from "./SittingJustices"
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";

export const SingleCase = () => {
	const { user, dispatch } = useContext(Context);
	const currentUser = user?.user;
	console.log("user id", currentUser.id);
	const userID = currentUser.id;
	const [sistercaseList, setSisterList] = useState();

	const history = useHistory();
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
	const [sisterModal, SetEditModal] = useState(false);
	const [remarkModal, SetremarkModal] = useState(false);
	const [adjoinModal, SetAdjournModal] = useState(false);

	const [cas, setSingleCase] = useState({});
	const [SisterCaseList, setAttachedCaseList] = useState([]);
	const [justicesList, setJusticesList] = useState([]);
	const [unAttached, setunAttached] = useState([]);
	const [remarks, setRemark] = useState([]);
	const [Dairies, setCaseDiary] = useState([]);
	const [DateDairies, setDateDiary] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [selected, setSelected] = useState();
  const [caseID, SetcaseID] = useState('');
  const [remarkID, SetRemarkID] = useState('');
  const [caseSuiteName, SetcaseSuiteName] = useState('');
  const [deleteRemakModal, SetdeleteRemakModal] = useState(false);
  const [deactivateModal, SetDeactivateModal] = useState(false);
  const [justicesModal, SetJusticesModal] = useState(false);

  
	const params = useParams();
	let formattedDate='';

	const [remarkDetails, setremarkDetails] = useState({user_id:userID, case_diary_id: params.id, remark:"", platform:"web" });


	const getSingleCase = async () => {
		setLoading(true);
		await endpoint
			.get(`/case/show/${params.id}`)
			.then((res) => {
				console.log("case response", res.data.data);
				setSingleCase(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	//get sister Case
	const sisUsersList = async () => {
		setLoading(true);
		await endpoint
			.get(`/case-diary/show/${params.id}`)
			.then((res) => {
				console.log("sister case response", res.data.data.date_held);
				setSisterList(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	const getUnattachedCases = async () => {
		setLoading(true);
		await endpoint
			.get(`/case/list/search/${params.id}`)
			.then((res) => {
				console.log("unattached cases", res.data.data);
				setunAttached(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};


	const openEditModal = async () => {
		SetEditModal(true);
	};

	const openRemarkModal = async () => {
		SetremarkModal(true);
	};
	const openJusticesModal = async () => {
		SetJusticesModal(true);
	};
	
  
	const openAdjournModal = async () => {
		SetAdjournModal(true);
	};
	const openDeactivateModal = async () => {
		SetDeactivateModal(true);
	};

	const getAttachedCaseList = async () => {
		setLoading(true);
		await endpoint
			.get("/case-diary/list")
			.then((res) => {
				// console.log("case Diary", res.data.data)
				setAttachedCaseList(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};



	const getJusticesList = async () => {
		setLoading(true);
		await endpoint
			.get("/justice/list")
			.then((res) => {
				console.log("justices list", res.data.data)
				setJusticesList(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	const getRemark = async () => {
		setLoading(true);
		await endpoint
			.get(`/remark/list/${params.id}`)
			.then((res) => {
				console.log("remarks", res.data.data);
				setRemark(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	useEffect(() => {
		getAttachedCaseList();
		getUnattachedCases();
		getRemark();
		sisUsersList();
		getJusticesList()
		getSingleCase();
	}, []);
	

	//add a sister case
	const handleCreateSisterCase = async (data) => {
		console.log("form data", data);
		setLoading(true);

		try {
			await endpoint
				.post("/case-diary/sister-case-create", data)
				.then((res) => {
					SuccessAlert(res.data.message);
				});
			window.location.reload(); // Reload the page after creating the record
		} catch (error) {
			SetEditModal(false);
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};
  
	//add remark
	const handleCreateRemark = async () => {
		console.log("Remark", remarkDetails);
		setLoading(true);

		try {
			await endpoint.post("/remark/create", remarkDetails).then((res) => {
				SuccessAlert(res.data.message);
				window.location.reload();
			});
		} catch (error) {
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};
  const Adjourn = async (data) => {
		console.log("adjourn", data);
		// setLoading(true);

		try {
			await endpoint.put(`/case-diary/adjourn/${params.id}`, data)
      .then((res) => {
				SuccessAlert(res.data.message);
				window.location.reload();
			});
		} catch (error) {
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};

	const HandleCloseDiary = async (data) => {
		console.log("closeDiary", data);
		// setLoading(true);

		try {
			await endpoint.put(`/case-diary/close-diary/${params.id}`, data)
      .then((res) => {
				SuccessAlert(res.data.message);
				window.location.reload();
			});
		} catch (error) {
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};

	const handleAttachedJustice = async (data) => {
		console.log("Diary Justice", data);
		// setLoading(true);

		try {
			await endpoint.post(`/diary-justice/create`, data)
      .then((res) => {
				SuccessAlert(res.data.message);
				window.location.reload();
			});
		} catch (error) {
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};


	

  const handleRemoveRemark = async () => {
    console.log("Remark Delete ID", remarkID);
    setLoading(true);
    try {
      await endpoint.delete(`/remark/delete/${remarkID}`)
        .then((res) => {
          SuccessAlert(res.data.message);
          window.location.reload()
        })
        .catch((err) => console.log(err));
    } catch (error) {
      ErrorAlert(error.response.data.message)
      console.log(error);
    }
    // console.log(data)
  };
	function formatDate(dateString) {
		const date = new Date(dateString);
		const day = date.getDate();
		const monthIndex = date.getMonth();
		const year = date.getFullYear();

		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		 formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;
		return formattedDate;
	}

  const openDeleteModal = async (id, suiteNumber) => {
    reset()
    SetRemarkID(id)
    SetcaseSuiteName(suiteNumber)
    console.log("sister id", id, suiteNumber);
    SetdeleteRemakModal(true)
  
  }
  

	return (
		<>
			<div className="col-lg-12 grid-margin stretch-card">
				<div className="card">
					<div className="card-body">
						<h4 className="card-title text-center ">
							Case Description: {cas.case_desc} <br />
							<span className="mt-5"> Suit Number: {cas.suite_no}</span> <br />
							<span className="mt-5">
								{" "}
								Case Type: {cas.CaseType ? cas.CaseType.case_type : ""}
							</span>{" "}
							<br />
							<span className="mt-5">
								{" "}
								Case Category:{" "}
								{cas.CaseTypeCategory ? cas.CaseTypeCategory.case_type_cat : ""}
							</span>
						</h4>
						<div className="d-flex justify-content-end">
  <button className="btn btn-info btn-sm" onClick={openDeactivateModal}>Close diary</button>
  <button className="btn btn-primary btn-sm" onClick={openAdjournModal}>Adjourn</button>
</div>


						<div className="d-flex">
							<div className="d-flex align-items-center mr-4 text-muted font-weight-light">
								<i className="mdi mdi-account-outline icon-sm mr-2"></i>
							</div>
							<div className="d-flex align-items-center text-muted font-weight-light">
								<i className="mdi mdi-clock icon-sm mr-2"></i>
								<span>{sistercaseList &&  formatDate(sistercaseList.date_held)}</span>
							</div>
						</div>
						<SisterCase sistercaseList={sistercaseList} />
						
						<div className="d-flex mt-5 align-items-start">
							<div className="mb-0 flex-grow">
								{cas.remark ? <p className="mb-0 font-weight-light"></p> : ""}
							</div>
							<div className="ml-auto">
								{/* <i className="mdi mdi-heart-outline text-muted"  color={data.CaseType.case_color}></i> */}
							</div>
						</div>
					</div>
					<div className="card-footer d-flex justify-content-between">
  <button
    className="btn btn-primary"
    style={{ fontSize: '10px', padding: '5px 8px' }}
    value="Attach Case"
    onClick={openEditModal}
  >
    Attach Case
  </button>
  <button
    className="btn btn-primary"
    style={{ fontSize: '10px', padding: '5px 8px' }}
    value="Add Remark"
    onClick={openRemarkModal}
  >
    Add Remark
  </button>
  <button
    className="btn btn-primary"
    style={{ fontSize: '10px', padding: '5px 8px' ,marginLeft: 'auto'}}
    value="Attach Justices"
    onClick={openJusticesModal}

  >
    Attach Justices
  </button>
</div>


					<Modal show={justicesModal}>
						<Modal.Header>
							<Button
								onClick={() => SetJusticesModal(false)}
								className="btn-close"
								variant="">
								x
							</Button>
						</Modal.Header>
						<div className="row">
							<div className="col-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h2 className="card-title text-center">Attach Justices to a diary</h2>
										{/* <p className="card-description text-center"  > Input updated details </p> */}
										<form
											className="forms-sample"
											onSubmit={handleSubmit(handleAttachedJustice)}>
											<Form.Group>
												<input
													type="hidden"
													name="case_diary_id"
													{...register("case_diary_id")}
													defaultValue={cas.id ? cas.id : ""}
												/>
												<label htmlFor="exampleInputname">Justices Name</label>
												<select
													type="text"
													name="justice_id"
													className="form-control"
													{...register("justice_id")}
												>
													<option value="">--select--</option>
													{justicesList.map((s) => (
														<option
															key={s.id}
															value={s.id}>
															{s.name}
														</option>
													))}
												</select>
											</Form.Group>

											<button
												type="submit"
												className="btn btn-gradient-primary mr-2">
												Attach Case
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</Modal>
					<Modal show={sisterModal}>
						<Modal.Header>
							<Button
								onClick={() => SetEditModal(false)}
								className="btn-close"
								variant="">
								x
							</Button>
						</Modal.Header>
						<div className="row">
							<div className="col-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h2 className="card-title text-center">Attach a Case</h2>
										{/* <p className="card-description text-center"  > Input updated details </p> */}
										<form
											className="forms-sample"
											onSubmit={handleSubmit(handleCreateSisterCase)}>
											<Form.Group>
												<input
													type="hidden"
													name="user_id"
													{...register("user_id")}
													defaultValue={userID ? userID : ""}
												/>
												<input
													type="hidden"
													name="case_diary_id"
													{...register("case_diary_id")}
													defaultValue={cas.id ? cas.id : ""}
												/>
												<label htmlFor="exampleInputname">Sue Number</label>
												<select
													type="text"
													name="case_id"
													className="form-control"
													{...register("case_id")}
													// onChange={(event) => setDetails({...details, case_id:event.target.value})}
												>
													<option value="">--select--</option>
													{unAttached.map((s) => (
														<option
															key={s.id}
															value={s.id}>
															{s.suite_no} {s.parties}
														</option>
													))}
												</select>
											</Form.Group>

											<button
												type="submit"
												className="btn btn-gradient-primary mr-2">
												Attach Case
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</Modal>

					<Modal show={remarkModal}>
						<Modal.Header>
							<Button
								onClick={() => SetremarkModal(false)}
								className="btn-close"
								variant="">
								x
							</Button>
						</Modal.Header>
						<div className="row">
							<div className="col-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h2 className="card-title text-center">Add Remark</h2>
										{/* <p className="card-description text-center"  > Input updated details </p> */}
										<form
											className="forms-sample"
											onSubmit={handleSubmit(handleCreateRemark)}>
											<Form.Group>
												<label htmlFor="exampleInputName1">Remark </label>
												
												{/* <input
													type="hidden"
													name="user_id"
													{...register("user_id")}
													defaultValue={userID ? userID : ""}
												/> */}
												<Form.Control
													type="text"
													name="remark"
													{...register("remark")}
													className="form-control"
													id="exampleInputName1"
													placeholder="Remark"
													onChange={(event) => {
														setremarkDetails({
														  ...remarkDetails,
														  remark: event.target.value,
														});
													  }}
												/>
											</Form.Group>

											<button
												type="submit"
												className="btn btn-gradient-primary mr-2">
												Add Remark
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</Modal>

          <Modal show={adjoinModal}>
						<Modal.Header>
							<Button
								onClick={() => SetAdjournModal(false)}
								className="btn-close"
								variant="">
								x
							</Button>
						</Modal.Header>
						<div className="row">
							<div className="col-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h2 className="card-title text-center">Adjourn</h2>
										{/* <p className="card-description text-center"  > Input updated details </p> */}
										<form
											className="forms-sample"
											onSubmit={handleSubmit(Adjourn)}>
											<Form.Group>
												<label htmlFor="exampleInputName1">Date </label>
												<input
													type="hidden"
													name="caseDiaryId"
													{...register("caseDiaryId")}
													defaultValue={cas.id ? cas.id : ""}
												/>
												<Form.Control
													type="date"
													name="date_held"
													{...register("date_held")}
													className="form-control"
													id="exampleInputName1"
													placeholder="Date"
												/>
											</Form.Group>
                      <Form.Group>
												<label htmlFor="exampleInputName1">Remmark </label>
												<Form.Control
													type="text"
													name="remark"
													{...register("remark")}
													className="form-control"
													id="exampleInputName1"
													placeholder="Remark"
												/>
											</Form.Group>
                      

											<button
												type="submit"
												className="btn btn-gradient-primary mr-2">
												Adjourn
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</Modal>

					<Modal show={deactivateModal}>
						<Modal.Header>
							<Button
								onClick={() => SetDeactivateModal(false)}
								className="btn-close"
								variant="">
								x
							</Button>
						</Modal.Header>
						<div className="row">
							<div className="col-12 grid-margin stretch-card">
								<div className="card">
									<div className="card-body">
										<h2 className="card-title text-center">Close Diary</h2>
										{/* <p className="card-description text-center"  > Input updated details </p> */}
										<form
											className="forms-sample"
											onSubmit={handleSubmit(HandleCloseDiary)}>
												<p>Do you want to close this Diary?</p>
                     						 <Form.Group>
												<label htmlFor="exampleInputName1">Remark </label>
												<Form.Control
													type="text"
													name="remark"
													{...register("remark")}
													className="form-control"
													id="exampleInputName1"
													placeholder="Remark"
												/>
											</Form.Group>
                      

											<button
												type="submit"
												className="btn btn-gradient-primary mr-2">
												Submit
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					</Modal>


          <Modal show={deleteRemakModal} >
                    <Modal.Header >
                        <Button
                           onClick={() => {
                            SetdeleteRemakModal(false);
                            reset();
                          }}
                          
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
                <p className="card-description text-center"> Do you want to remove this remark? </p>
                <form className="forms-sample" onSubmit={handleSubmit(handleRemoveRemark)}>
                  <Form.Group>
                    {/* <label htmlFor="exampleInputName1">First Name</label> */}
                    <p>{caseSuiteName}</p>
                  </Form.Group>
                  <Form.Group>
            
                    <Form.Control type="hidden"  {...register("caseAttachementId")}  id="exampleInputEmail3" defaultValue={caseID} />
                  </Form.Group>
                  
                  
                  
                  <button type="submit" className="btn btn-gradient-primary mr-2">Remove</button>
                
                </form>
              </div>
            </div>
          </div>
        
          </div>
                </Modal>
				</div>
			</div>
			<SittingJustices />
      {remarks?
			<div className="row">
				<div className="col-lg-12 grid-margin stretch-card">
					<div className="card">
						<div className="card-body">
							<h4 className="card-title">Remarks</h4>

							<div className="table-responsive">
								<table className="table">
									<thead>
										<tr>
											<th>S/N</th>
											<th>Remarks.</th>
											<th>Created By</th>
											<th>Action</th>
										</tr>
									</thead>
									<tbody>
										{remarks.map((remark, index) => (
											<tr key={remark.id}>
												<td>{index + 1}</td>
												<td>{remark.remark}</td>
												<td>{formatDate(remark.createdAt)}</td>
												<td>
													{/* <button className="btn btn-primary">Edit</button> */}
													<button className="btn btn-danger"  onClick={() => openDeleteModal(remark.id, remark.remark)}>Delete</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
      :
      <div className="text-center"> No remark added</div>
    }
		</>
	);
};

export default SingleCase;
