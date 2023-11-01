import React, { useState, useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useForm } from "react-hook-form";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import {ModuleList} from "./ModuleList"
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
	const [moduleList, setModuleList] = useState([]);

const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("user id", currentUser.id);
const userID = currentUser.id;
const { caseId } = useParams()
const [moduleDetails, setmoduleDetails] = useState({
        module_name: '',
        rank: '',
        icon:""
})


const [isLoading, setLoading] = useState(false);



const getModuleList = async () => {
    setLoading(true);
    await endpoint.get('/modules/getAllModules')
        .then((res) => {
            console.log("modules", res.data.data)
            setModuleList(res.data.data)
            setLoading(false)
        })
        .catch((err) => {
            setLoading(false)
            console.log(err)
        })
}



//handleCreateRole
const handleCreateRole = async (e) => {
e.preventDefault();
console.log("form data", moduleDetails);
setLoading(true);
try {
await endpoint
.post(`/modules/createModule`, moduleDetails)
.then((res) => {
SuccessAlert(res.data.message);
window.location.reload()

})
.catch((error) => {
ErrorAlert(error.response.data.message);
console.log(error);
});
} catch (error) {
console.log(error);
}

};

useEffect(() => {
    getModuleList()
}, []);



const handleSelectChange = (e) => {
const selectedValue = e.target.value;
if (selectedValue === "Others") {

} else {
// Handle other options if needed
}
};

return (
<>
				<div>
								<div className="page-header">
												<h3 className="page-title"> Roles</h3>
												<nav aria-label="breadcrumb">
																
												</nav>
								</div>
								<div className="row">
												<div className="col-12 grid-margin stretch-card">
																<div className="card">
																				<div className="card-body">
																								<h2 className="card-title text-center">Create a new Module </h2>
																								<p className="card-description text-center">
																										Input details to creat a new Module

																								</p>
																								<form className="forms-sample" onSubmit={handleCreateRole}>
																												<Form.Group>
																																<label htmlFor="exampleInputName1">Module name</label>
																																<Form.Control type="text" defaultValue={moduleDetails.module_name} onChange={(e)=> {
																																				setmoduleDetails({
																																				...moduleDetails, module_name: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="Module Name"
																																				/>
																												</Form.Group>
                                                                                                                <Form.Group>
																																<label htmlFor="exampleInputName1">Module Rank</label>
																																<Form.Control type="text" defaultValue={moduleDetails.rank} onChange={(e)=> {
																																				setmoduleDetails({
																																				...moduleDetails, rank: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="Module Rank"
																																				/>
																												</Form.Group>
                                                                                                                <Form.Group>
																																<label htmlFor="exampleInputName1">Module Icon</label>
																																<Form.Control type="text" defaultValue={moduleDetails.icon} onChange={(e)=> {
																																				setmoduleDetails({
																																				...moduleDetails, icon: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="Module Icon"
																																				/>
																												</Form.Group>



																											

																											


																												<button type="submit" className="btn btn-gradient-primary mr-2">
																																Submit
																												</button>
																								</form>
																				</div>
																</div>
												</div>
								</div>
				</div>
				<ModuleList moduleList={moduleList} getModuleList={getModuleList}/>
</>
);
};

export default NewCase;
