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

export const GetSubModule = ({subModuleList, getSubModuleList}) => {
	// const { register, handleSubmit, formState: { errors }, reset } = useForm()

	
	const [isLoading, setLoading] = useState(false);
	const [editModal, SetEditModal] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [moduleList, setModuleList] = useState([]);

	const [selectedRow, setSelectedRow] = useState({
		id: "",
		submodule_name: "",
		module_id: "",
        module_name:"",
		route: "",
		rank: "",
		icon: ""
	});
	const [rowToDelete, setSelectedRowToDelete] = useState('')
	// const [formData, setFormData] = useState({});

	const getModuleList = async () => {
        setLoading(true);
        await endpoint.get('/modules/getAllModules')
            .then((res) => {
                console.log("role", res.data.data)
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
 

	return (
		<div>
			{subModuleList.length > 0 ?
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
											<th>Module Name</th>
											<th>Sub Module Name</th>
											<th> Route</th>
											<th> Rank </th>
											<th> Icon </th>
											<th> Action </th>
										</tr>
									</thead>
                                    <tbody>
  {isLoading && <Loader />}
  {!isLoading && (
    <>
      {subModuleList.map((submodule, index ) =>
        
          <tr key={submodule.id}>
            <td>{index +1}</td>
            <td>{submodule.Module ? submodule.Module.module_name :""}</td>
            <td>{submodule.submodule_name}</td>
            <td>{submodule.route}</td>
            <td>{submodule.rank}</td>
            <td>{submodule.icon}</td>
            <td>
              <Button
                onClick={() => {
                  setSelectedRow({
                    id: submodule.id,
                    submodule_name: submodule.submodule_name,
                    module_id: submodule.Module ? submodule.Module.id :"",
                    module_name: submodule.Module ? submodule.Module.module_name :"",
                    rank: submodule.rank,
                    route: submodule.route,
                    icon: submodule.icon,
                  });
                  openEditModal();
                }}
                className="btn btn-primary btn-sm"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setSelectedRowToDelete(submodule);
                  openDeleteModal();
                }}
                className="btn btn-warning btn-sm"
              >
                Delete
              </Button>
            </td>

         

           
          </tr>
      )}
         <Modal show={editModal}>
              <Modal.Header>
                <Button
                  onClick={() => {
                    setSelectedRow("");
                    SetEditModal(false);
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
                      <h2 className="card-title text-center">Update module</h2>
                      <p className="card-description text-center">
                        Input updated details
                      </p>
                      <form className="forms-sample" onSubmit={updatemodule}>
                      <Form.Group>
                    <label htmlFor="exampleInputName1">Module Name</label>
                    <Form.Control
                        as="select"
                        className="form-control"
                        value={selectedRow.module_id}
                        onChange={(e) =>
                        setSelectedRow({
                            ...selectedRow,
                            module_id: e.target.value,
                        })
                        }
                        id="exampleInputName1"
                    >
                        <option selected value={selectedRow.module_id}>{selectedRow.module_name}</option>

                        {moduleList.map((module, index)=>   
                        <option key={module.id} value={module.id}>{module.module_name}</option>
                        )}
                      
                    </Form.Control>
                    </Form.Group>
                      <Form.Group>
                <label htmlFor="exampleInputName1">SubModule Name</label>
                <Form.Control
                  
                    className="form-control"
                    value={selectedRow.submodule_name}
                    onChange={(e) =>
                    setSelectedRow({
                        ...selectedRow,
                        submodule_name: e.target.value,
                    })
                    }
                    id="exampleInputName1"
                >
                </Form.Control>
                </Form.Group>

                        <Form.Group>
                          <label htmlFor="exampleInputName1">module Route</label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="form-control"
                            id="exampleInputName1"
                            placeholder="module Rank"
                            value={selectedRow.route}
                            onChange={(e) =>
                              setSelectedRow({
                                ...selectedRow,
                                rank: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <label htmlFor="exampleInputName1">module Rank</label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="form-control"
                            id="exampleInputName1"
                            placeholder="module Rank"
                            value={selectedRow.rank}
                            onChange={(e) =>
                              setSelectedRow({
                                ...selectedRow,
                                rank: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <Form.Group>
                          <label htmlFor="exampleInputName1">module Icon</label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            className="form-control"
                            id="exampleInputName1"
                            placeholder="module Icon"
                            value={selectedRow.icon}
                            onChange={(e) =>
                              setSelectedRow({
                                ...selectedRow,
                                icon: e.target.value,
                              })
                            }
                          />
                        </Form.Group>
                        <button
                          type="submit"
                          className="btn btn-gradient-primary mr-2"
                        >
                          Submit
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
            <Modal show={deleteModal}>
              <Modal.Header>
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
                      <p className="card-description text-center">
                        Do you want to delete {rowToDelete.submodule_name} SubModule?
                      </p>
                      <form className="forms-sample">
                        <Form.Group>
                          {/* <label htmlFor="exampleInputName1">{rowToDelete.name} </label> */}
                        </Form.Group>
                        <button
                          type="button"
                          onClick={(e) => deletemodule(e, rowToDelete.id)}
                          className="btn btn-danger mr-2"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
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
            : <div className="text-center"> No record for that module</div>}
		</div>
	);
}



