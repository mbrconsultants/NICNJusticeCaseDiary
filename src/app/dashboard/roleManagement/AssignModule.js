import React, { useState, useContext, useEffect } from "react";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { useForm } from "react-hook-form";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Loader from "react-loader-advanced";

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
import { AssignModule } from "./AssignModuleList";

export const Submodule = () => {
	const [roleList, setRoleList] = useState([]);
	const [subModuleList, setSubModuleList] = useState([]);
    


const { user, dispatch } = useContext(Context);
const currentUser = user?.user;
console.log("user id", currentUser.id);
const userID = currentUser.id;
const { caseId } = useParams()

const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	
    const [alreadyAssigned, setAlreadyAssigned] = useState([])

	const [selectedRow, setSelectedRow] = useState('');
    const [role_id, setRole] = useState('')
	const [rowToDelete, setSelectedRowToDelete] = useState('')
    const [selectedSubmodules, setSelectedSubmodules] = useState([])
    const [moduleSubmodules, setModuleSubmodules] = useState([])



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

//get all modules and sub modules
const modulesAndSubmodules = async () => {
    await endpoint.get(`/submodule/list/module`)
        .then((res) => {
            console.log("sub and module ist", res.data.data)
            setModuleSubmodules(res.data.data)
        }).catch((err) => {
            console.log(err)
        })
}


const getSubModuleList = async () => {
    setLoading(true);
    await endpoint.get('/submodule/list')
        .then((res) => {
            // console.log("checkSub module", res.data.data)
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
console.log("form data", selectedRow);

};

useEffect(() => {
    getroleListList()
    getSubModuleList()
    modulesAndSubmodules()
    getAlreadyAssigned()

}, []);

	const openEditModal = async () => {
		SetEditModal(true)
	}

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}

	const updatemodule = async (e) => {
		e.preventDefault()
		setLoading(true)
		// console.log("data update", selectedRow)
		await endpoint.put(`/submodule/edit/${selectedRow.id}`, selectedRow)
			.then((res) => {
				setLoading(false)
				console.log(res)
                getSubModuleList();
                SetEditModal(false);
                SuccessAlert(res.data.message);
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
		await endpoint.delete(`/submodule/delete/${id}`)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getSubModuleList()
				SetDeleteModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetDeleteModal(false)
				ErrorAlert(err.response.data.message)
			})
	}
    const getAlreadyAssigned = async (role_id) => {
        if (role_id) {
            await endpoint.get(`/assignsubmodule/list/${role_id}`)
                .then((res) => {
                    // console.log("already assigned", res.data.data)
                    setAlreadyAssigned(res.data.data.map(({ submodule_id }) => submodule_id))
                    setSubModuleList(res.data.data)
                    if(res.data.data == ''){
                        setSelectedSubmodules([])
                    }
                    else{
                        setSelectedSubmodules(res.data.data.map(({ submodule_id }) => submodule_id))
                    }
                }).catch((err) => {
                    console.log(err)
                })
        } else {
            setAlreadyAssigned([]);
            setSelectedSubmodules([]);
        }
    }

    
    const toggleAlreadyChecked = (id, e) => {
        console.log(e)
        if (e === true) {
            console.log("b1")
            setSelectedSubmodules([...selectedSubmodules, id])
        }
        if (e === false) {
            console.log("b2")
            setSelectedSubmodules(selectedSubmodules.filter((item) => id !== item))

            //this helps uncheck the already assigned check box
            setAlreadyAssigned(alreadyAssigned.filter((item) => id !== item))
        }
    }


    const toggleCheckbox = (id, e) => {
        console.log(e)
        if (e === true) {
            console.log("c1")
            setSelectedSubmodules([...selectedSubmodules, id])
        }
        if (e === false) {
            console.log("c2")
            setSelectedSubmodules(selectedSubmodules.filter((item) => id !== item))
        }
    }
    const Assign =async (id, e) => {
        setLoading(true)
     let   submodule_id=selectedSubmodules;
        // console.log("sumodule id", { submodule_id, role_id });
        await endpoint.post(`/assignsubmodule/create/multiple`, { submodule_id, role_id })
            .then((res) => {
                setLoading(false)
                SuccessAlert(res.data.message)
                setAlreadyAssigned([])
                setSelectedSubmodules([])
                getAlreadyAssigned(role_id)

            }).catch((err) => {
                console.log(err)
            })
   
    }

return (
<>
				<div>
								<div className="page-header">
												<h3 className="page-title"> Assign Module</h3>
												<nav aria-label="breadcrumb">
																
												</nav>
								</div>
								<div className="row">
												<div className="col-12 grid-margin stretch-card">
																<div className="card">
																				<div className="card-body">
																								
																								<p className="card-description text-center">
																										Choose a role and assign module

																								</p>
																								<form className="forms-sample" >
                                                                                                <Form.Group>
                                                                                                                <label htmlFor="exampleInputName1">Select Role </label>
                                                                                                                {/* <Form.Control type="text" className="form-control" value={selectedRow.case_color} onChange={(e) => setSelectedRow({ ...selectedRow, case_color: e.target.value })} id="exampleInputName1" /> */}
                                                                                                                <select
                                                                                                                    className="form-control"
                                                                                                                    value={role_id}
                                                                                                                      onChange={(e) => { setRole( e.target.value ); getAlreadyAssigned(e.target.value) }}

                                                                                                                >
                                                                                                                    <option value="">--Select--</option>
                                                                                                                   
                                                                                                                    {roleList.map((role)=>  <option key={role.id} value={role.id}> {role.role_name}</option>) }
                                                                                                     
                                                                                                                </select>
                                                                                                            </Form.Group>
																								</form>
																				</div>
																</div>
												</div>
								</div>
				</div>
                <div>
        {moduleSubmodules.length > 0 ? (
          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-center"> Assigned Modules</h4>
                  <div className="table-responsive">
                {selectedSubmodules.length > 0 ? <button className="btn btn-primary" onClick={(e)=>{Assign()}}> Assign </button> :""}
                    <table className="table">
                      <thead>
                        <tr>
                        <th>Select</th>
                          <th>S/N</th>
                          <th>Module Name</th>
                          <th>Sub Module Name</th>
                          <th>Route</th>
                          <th>Rank</th>
                          <th>Icon</th>
                         
                         
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading && <Loader />}
                        {!isLoading && (
                          <>
                            {moduleSubmodules.map((sub, index) => (
                              <React.Fragment key={module.id}>
                                <tr>
                                  <td colSpan="8">
                                    <strong>{sub.module_name.toUpperCase()}</strong>
                                  </td>
                                </tr>
                               {sub.SubModules.map((submodule, index) => (
                                    <tr key={submodule.id}>
                                          <td>
                                          {alreadyAssigned && alreadyAssigned.includes(submodule.id) ?
                                                                                        <input type="checkbox" checked value={submodule.id} onChange={(e) => {
                                                                                            toggleAlreadyChecked(submodule.id, e.target.checked)
                                                                                            console.log("a1", e.target.checked)
                                                                                        }} />
                                                                                        : <input type="checkbox" value={submodule.id} onChange={(e) => {
                                                                                            toggleCheckbox(submodule.id, e.target.checked)
                                                                                            console.log("a2", e.target.checked)
                                                                                        }} />
                                                                                    }
                                      </td>
                                      <td>{index + 1}</td>
                                    
                                      <td>{sub.module_name}</td>
                                      <td>{submodule.submodule_name}</td>
                                      <td>{submodule.route}</td>
                                      <td>{submodule.rank}</td>
                                      <td>{submodule.icon}</td> 
                                    </tr>
                                  ))}
                              </React.Fragment>
                            ))}
                            <Modal show={editModal}>
                              {/* Your edit modal content here */}
                            </Modal>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">No record for that module</div>
        )}
      </div>
      
</>
);
};

export default Submodule;
