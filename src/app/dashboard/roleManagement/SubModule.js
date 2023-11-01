import React, { useState, useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useForm } from "react-hook-form";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import {GetSubModule} from "./SubModuleList"
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

export const Submodule = () => {
	const [moduleList, setModuleList] = useState([]);
	const [subModuleList, setSubModuleList] = useState([]);


const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("user id", currentUser.id);
const userID = currentUser.id;
const { caseId } = useParams()
const [subModuleDetails, setSubsubModuleDetails] = useState({
    submodule_name: '',
    module_id: '',
    route:"",
    rank:"",
    icon:"",

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


const getSubModuleList = async () => {
    setLoading(true);
    await endpoint.get('/submodule/list')
        .then((res) => {
            console.log("modules", res.data.data)
            setSubModuleList(res.data.data)
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
console.log("form data", subModuleDetails);
setLoading(true);
try {
await endpoint
.post(`/submodule/create`, subModuleDetails)
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
    getSubModuleList()
}, []);



const handleSelectChange = (e) => {
const selectedValue = e.target.value;
if (selectedValue === "Others") {

} else {
// Handle other options if needed
}
};

const getSubmodules = async (id) => {
    setLoading(true)
   
      console.log("a", id)
      setLoading(true)
      await endpoint.get(`/submodule/list/${id}`)
        .then((res) => {
          console.log("sub-modules and modules", res.data.data)
          setSubModuleList(res.data.data)
          setLoading(false)
        }).catch((err) => {
          console.log(err.response.data.message)
          setLoading(false)
        })

    }
  

return (
<>
				<div>
								<div className="page-header">
												<h3 className="page-title"> SubModule</h3>
												<nav aria-label="breadcrumb">
																
												</nav>
								</div>
								<div className="row">
												<div className="col-12 grid-margin stretch-card">
																<div className="card">
																				<div className="card-body">
																								<h2 className="card-title text-center">Create a new SubModule </h2>
																								<p className="card-description text-center">
																										Input details to creat a new SubModule

																								</p>
																								<form className="forms-sample" onSubmit={handleCreateRole}>
                                                                                                <Form.Group>
                                                                                                                <label htmlFor="exampleInputName1">Select Module </label>
                                                                                                                {/* <Form.Control type="text" className="form-control" value={selectedRow.case_color} onChange={(e) => setSelectedRow({ ...selectedRow, case_color: e.target.value })} id="exampleInputName1" /> */}
                                                                                                                <select
                                                                                                                    className="form-control"
                                                                                                                    value={subModuleDetails.module_id}
                                                                                                                      onChange={(e) => { getSubmodules(e.target.value); setSubsubModuleDetails({ ...subModuleDetails, module_id: e.target.value }); }}

                                                                                                                >
                                                                                                                    <option value="">--Select--</option>
                                                                                                                   
                                                                                                                    {moduleList.map((module)=>  <option key={module.id} value={module.id}> {module.module_name}</option>) }
                                                                                                     
                                                                                                                </select>
                                                                                                            </Form.Group>
																												<Form.Group>
																																<label htmlFor="exampleInputName1">Sub Module name</label>
																																<Form.Control type="text" defaultValue={subModuleDetails.submodule_name} onChange={(e)=> {
																																				setSubsubModuleDetails({
																																				...subModuleDetails, submodule_name: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="SubModule Icon"
																																				/>
																												</Form.Group>
                                                                                                                <Form.Group>
																																<label htmlFor="exampleInputName1">Sub Module Route</label>
																																<Form.Control type="text" defaultValue={subModuleDetails.route} onChange={(e)=> {
																																				setSubsubModuleDetails({
																																				...subModuleDetails, route: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="SubModule Icon"
																																				/>
																												</Form.Group>
                                                                                                                <Form.Group>
																																<label htmlFor="exampleInputName1">Sub Module Rank</label>
																																<Form.Control type="text" defaultValue={subModuleDetails.rank} onChange={(e)=> {
																																				setSubsubModuleDetails({
																																				...subModuleDetails, rank: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="SubModule Icon"
																																				/>
																												</Form.Group>
                                                                                                                
                                                                                                                <Form.Group>
																																<label htmlFor="exampleInputName1">Sub Module Icon</label>
																																<Form.Control type="text" defaultValue={subModuleDetails.icon} onChange={(e)=> {
																																				setSubsubModuleDetails({
																																				...subModuleDetails, icon: e.target.value }) }}
																																				className="form-control"
																																				id="exampleInputName1"
																																				placeholder="SubModule Icon"
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
				<GetSubModule subModuleList={subModuleList} getSubModuleList={getSubModuleList}/>
</>
);
};

export default Submodule;
