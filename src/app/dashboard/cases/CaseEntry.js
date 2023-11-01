import React, { useState, useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useForm } from "react-hook-form";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import {
CForm,
CCol,
CFormLabel,
CFormFeedback,
CFormInput,
CInputGroup,
CInputGroupText,
CButton,
CFormCheck,
} from "@coreui/react";

import { Link, useHistory, useParams } from "react-router-dom";

export const NewCase = () => {
const [cases, setCaseList] = useState([]);
const [titles, setTitleList] = useState([]);
const [createTitle, setCreateTitle] = useState(false);

const [casesCat, setCaseCategoryList] = useState([]);
const history = useHistory();
const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("user id", currentUser.id);
const userID = currentUser.id;
const { caseId } = useParams()
const [caseDetails, setCaseDetails] = useState({
user_id: userID,
suite_no: '',
parties: '',
case_type_id: '',
case_type_cat_id: '',
case_desc: '',
appellants:'',
respondent:'',
appellants_title:'',
respondent_title:''

})

const {
register,
handleSubmit,
formState: { errors },
reset,
} = useForm();
const [isLoading, setLoading] = useState(false);

const getCaseTypeList = async () => {
setLoading(true);
await endpoint
.get("/case-type/list")
.then((res) => {
console.log("case list", res.data.data);
setCaseList(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});
};

//handle get title
const getTitleList = async () => {
setLoading(true);
await endpoint
.get("/appellant-title/list")
.then((res) => {
console.log("case title list", res.data.data);
setTitleList(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});
};

//handle get category List
const getCaseCategoryList = async () => {
setLoading(true);
await endpoint
.get("/case-type-cat/list")
.then((res) => {
console.log("case Categ list", res.data.data);
setCaseCategoryList(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});
};

//handleCreateCase
const handleCreateCase = async (e) => {
e.preventDefault();
console.log("form data", caseDetails);
setLoading(true);
if (caseId) {
try {
await endpoint
.put(`/case/edit/${caseId}`, caseDetails)
.then((res) => {
SuccessAlert(res.data.message);
history.push(`/all-case`);
})
.catch((error) => {
ErrorAlert(error.response.data.message);
console.log(error);
});
} catch (error) {
console.log(error);
}
} else {
try {
await endpoint
.post("/case/create", caseDetails)
.then((res) => {
SuccessAlert(res.data.message);
history.push(`/all-case`);
})
.catch((error) => {
ErrorAlert(error.response.data.message);
console.log(error);
});
} catch (error) {
console.log(error);
}
}
};

useEffect(() => {
getCaseTypeList();
getTitleList();
getCaseCategoryList();
if (caseId) {
endpoint.get(`/case/show/${caseId}`)
.then((res) => {
setCaseDetails({
user_id: userID,
suite_no: res.data.data.suite_no,
parties: res.data.data.parties,
case_type_id: res.data.data.case_type_id,
case_type_cat_id: res.data.data.case_type_cat_id,
case_desc: res.data.data.case_desc,
status: res.data.data.status,
appellants: res.data.data.appellants,
respondent: res.data.data.respondent,
appellants_title:res.data.data.appellants_title,
respondent_title:res.data.data.respondent_title
})
console.log("edit case", res.data.data)
}).catch((err) => {
console.log(err)
})
}
}, []);

const handleCreateJustices = async (data) => {
console.log("Appellant create details", data);
setLoading(true);
try {
await endpoint.post('/appellant-title/create', data)
.then((res) => {
	getTitleList()
	setCreateTitle(false)
	SuccessAlert(res.data.message);
	getTitleList()
})
.catch((err) => console.log(err));
} catch (error) {
ErrorAlert(error.response.data.message)
console.log(error);
}
console.log(data)
};

const handleSelectChange = (e) => {
const selectedValue = e.target.value;
if (selectedValue === "Others") {
setCreateTitle(true);
} else {
// Handle other options if needed
}
};

return (
<>
				<div>
								<div className="page-header">
												<h3 className="page-title"> Case</h3>
												<nav aria-label="breadcrumb">
																<ol className="breadcrumb">
																				<li className="breadcrumb-item">
																								{caseId ?
																								<a href="/add-case">
																												Create New Case
																								</a>
																								:
																								<a href="all-case">
																												Case List
																								</a>
																								}
																				</li>

																</ol>
												</nav>
								</div>
								<div className="row">
												<div className="col-12 grid-margin stretch-card">
																<div className="card">
																				<div className="card-body">
																								<h2 className="card-title text-center">{caseId ? "Edit Case" : "Case Registration"} </h2>
																								<p className="card-description text-center">
																												{" "}
																												{caseId ? `Edit Case ${caseDetails.suite_no}` : "Input details to Register a Case"}

																								</p>
																								<form className="forms-sample" onSubmit={handleCreateCase}>
																												<Form.Group>
																																<label htmlFor="exampleInputName1">Suit Number</label>
																																<Form.Control type="text" value={caseDetails.suite_no} onChange={(e)=> {
																																				setCaseDetails({
																																				...caseDetails, suite_no: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="Suit Number"
																																				/>
																												</Form.Group>

																												<div className="row">
																																<div className="col-md-3">
																																				<Form.Group>
																																								<label htmlFor="exampleInputName1">Appellant Name</label>
																																								<Form.Control type="text" defaultValue={caseDetails.appellants}
																																												onChange={(e)=>
																																												setCaseDetails({ ...caseDetails, appellants: e.target.value })
																																												}
																																												className="form-control"
																																												id="exampleInputName1"
																																												placeholder="Appellant Name"
																																												/>
																																				</Form.Group>
																																</div>
																																<div className="col-md-2">
																																				<Form.Group>
																																								<label htmlFor="exampleInputName1">Appellant Title</label>
																																								<select value={caseDetails.appellants_title} onChange={(e)=> {
																																												handleSelectChange(e);
																																												setCaseDetails({ ...caseDetails, appellants_title: e.target.value });
																																												}}
																																												className="form-control"
																																												>
																																												<option>--select--</option>
																																												{titles.map((title) => (
																																												<option key={title.id} value={title.name}>
																																																{title.name}
																																												</option>
																																												))}
																																												<option key="others" value="Others">
																																																Others
																																												</option>
																																								</select>

																																				</Form.Group>

																																</div>
																																<span className="mt-4">Vs</span>
																																<div className="col-md-3">
																																				<Form.Group>
																																								<label htmlFor="exampleInputName1">Respondent Name</label>
																																								<Form.Control type="text" defaultValue={caseDetails.respondent}
																																												onChange={(e)=>
																																												setCaseDetails({ ...caseDetails, respondent: e.target.value })
																																												}
																																												className="form-control"
																																												id="exampleInputName1"
																																												placeholder="Respondent Name"
																																												/>
																																				</Form.Group>
																																</div>
																																<div className="col-md-2">
																																				<Form.Group>
																																								<label htmlFor="exampleInputName1">Respondent Title</label>
																																								<select value={caseDetails.respondent_title} onChange={(e)=> {
																																												handleSelectChange(e);
																																												setCaseDetails({ ...caseDetails, respondent_title: e.target.value });
																																												}}
																																												className="form-control"
																																												>
																																												<option>--select--</option>
																																												{titles.map((title) => (
																																												<option key={title.id} value={title.name}>
																																																{title.name}
																																												</option>
																																												))}
																																												<option key="others" value="Others">
																																																Others
																																												</option>
																																								</select>

												

																																				</Form.Group>
																																</div>
																												</div>

																												<Form.Group>
																																<label htmlFor="exampleInputName1">Case Type</label>
																																<select className="form-control" value={caseDetails.case_type_id} onChange={(e)=> {
																																				setCaseDetails({ ...caseDetails, case_type_id: e.target.value }) }}
																																				>
																																				<option value="">--Select--</option>
																																				{cases.map((cas) => (
																																				<option key={cas.id} value={cas.id} selected={cas.id===caseDetails.case_type_id}>
																																								{cas.case_type}
																																				</option>
																																				))}
																																</select>
																												</Form.Group>
																											

																												{caseId &&
																												<Form.Group>
																																<label htmlFor="exampleInputName1">Status</label>
																																<select className="form-control" value={caseDetails.status} onChange={(e)=> {
																																				setCaseDetails({ ...caseDetails, status: e.target.value }) }}
																																				>
																																				<option value="">--Select--</option>
																																				<option key={1} value={1} selected={1===caseDetails.status}>
																																								Active
																																				</option>
																																				<option key={2} value={0} selected={0===caseDetails.status}>
																																								InActive
																																				</option>

																																</select>
																												</Form.Group>
																												}

																												<button type="submit" className="btn btn-gradient-primary mr-2">
																																Submit
																												</button>
																								</form>
																				</div>
																</div>
												</div>
								</div>
				</div>
				<Modal show={createTitle}>
								<Modal.Header>
												<Button onClick={()=> setCreateTitle(false)}
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
																								<p className="card-description text-center"> Create New Appellant </p>
																								<form className="forms-sample" onSubmit={handleSubmit(handleCreateJustices)}>
																												<Form.Group>
																																<label htmlFor="exampleInputName1">
																																				Name{" "}
																																</label>
																																<Form.Control type="text" className="form-control" id="exampleInputName1"
																																				placeholder="Full Name" {...register("name")} />
																												</Form.Group>

																												<button type="submit" className="btn btn-gradient-danger mr-2">Submit</button>

																								</form>
																				</div>
																</div>
												</div>

								</div>
				</Modal>
</>
);
};

export default NewCase;
