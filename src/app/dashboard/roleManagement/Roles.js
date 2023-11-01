import React, { useState, useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useForm } from "react-hook-form";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import {RoleList} from "./RolesList"
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
	const [roleList, setRoleList] = useState([]);

const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("user id", currentUser.id);
const userID = currentUser.id;
const { caseId } = useParams()
const [roleDetails, setRoleDetails] = useState({
role_name: '',
role_description: ''
})


const [isLoading, setLoading] = useState(false);



const getroleListList = async () => {
    setLoading(true);
    await endpoint.get('/role/getRoles')
        .then((res) => {
            console.log("role", res.data.data)
            setRoleList(res.data.data)
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
console.log("form data", roleDetails);
setLoading(true);
try {
await endpoint
.post(`/role/create`, roleDetails)
.then((res) => {
SuccessAlert(res.data.message);
getroleListList()

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
    getroleListList()
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
																								<h2 className="card-title text-center">Create a new role </h2>
																								<p className="card-description text-center">
																										Input details to creat a new role

																								</p>
																								<form className="forms-sample" onSubmit={handleCreateRole}>
																												<Form.Group>
																																<label htmlFor="exampleInputName1">Role name</label>
																																<Form.Control type="text" value={roleDetails.role_name} onChange={(e)=> {
																																				setRoleDetails({
																																				...roleDetails, role_name: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="Role Name"
																																				/>
																												</Form.Group>


																											

																												<Form.Group>
																																<label htmlFor="exampleInputName1">Role Description </label>
																																<Form.Control as="textarea" rows={3} className="form-control" id="exampleInputName1"
																																				placeholder="Role Description" value={roleDetails.role_description}
																																				onChange={(e)=> { setRoleDetails({ ...roleDetails, role_description: e.target.value }) }}
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
				<RoleList roleList={roleList} getroleListList={getroleListList}/>
</>
);
};

export default NewCase;
