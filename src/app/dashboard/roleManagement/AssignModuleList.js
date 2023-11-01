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

export const AssignModule = ({subModuleList, getSubModuleList}) => {
	// const { register, handleSubmit, formState: { errors }, reset } = useForm()

	
	const [isLoading, setLoading] = useState(false);
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [moduleList, setModuleList] = useState([]);

	const [selectedRow, setSelectedRow] = useState({
		role_id: "",
		submodule_id: "",
	});
	const [rowToDelete, setSelectedRowToDelete] = useState('')
	// const [formData, setFormData] = useState({});

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

    useEffect(() => {
        getModuleList()
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
		console.log("data update", selectedRow)
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
    const toggleSubmoduleSelection = (submoduleId) => {
        // const isSelected = selectedRow.includes(submoduleId);
        // if (isSelected) {
        //   setSelectedRow(selectedRow.filter((id) => id !== submoduleId));
        // } else {
        //   setSelectedRow([...selectedRow, submoduleId]);
        // }
      };

	return (
        <div>
        {subModuleList.length > 0 ? (
          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title text-center"> Modules</h4>
                  <div className="table-responsive">
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
                          <th>Action</th>
                         
                        </tr>
                      </thead>
                      <tbody>
                        {isLoading && <Loader />}
                        {!isLoading && (
                          <>
                            {moduleList.map((module, index) => (
                              <React.Fragment key={module.id}>
                                <tr>
                                  <td colSpan="8">
                                    <strong>{module.module_name}</strong>
                                  </td>
                                </tr>
                                {subModuleList
                                  .filter(
                                    (submodule) =>
                                      submodule.module_id === module.id
                                  )
                                  .map((submodule, index) => (
                                    <tr key={submodule.id}>
                                          <td>
                                        <Form.Check
                                        className="ml-5"
                                          type="checkbox"
                                        //   checked={selectedRow.includes(
                                        //     submodule.id
                                        //   )}

                                          onChange={() =>
                                            setSelectedRow(

                                            )
                                          }
                                        />
                                      </td>
                                      <td>{index + 1}</td>
                                    
                                      <td>{submodule.Module.module_name}</td>
                                      <td>{submodule.submodule_name}</td>
                                      <td>{submodule.route}</td>
                                      <td>{submodule.rank}</td>
                                      <td>{submodule.icon}</td>
                                      <td>
                                        <Button
                                          onClick={() => openEditModal(submodule)}
                                          className="btn btn-primary btn-sm"
                                        >
                                          Edit
                                        </Button>
                                        <Button
                                          onClick={() => openEditModal(submodule)}
                                          className="btn btn-danger btn-sm mdi mdi-archive"
                                        >
                                          Delete
                                        </Button>
                                      </td>
                                     
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
	);
}



