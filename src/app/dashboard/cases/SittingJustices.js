import React, { Component } from "react";
import {useEffect, useState} from "react";
import { useForm } from 'react-hook-form';
import {Modal } from "react-bootstrap";
import endpoint from "../../../auth/endpoint"
import {  useParams, useHistory } from "react-router-dom";
import { CForm, CCol, CFormLabel, CFormFeedback, CFormInput, CInputGroup, CInputGroupText, CButton, CFormCheck, } from "@coreui/react";
import {
	Col,
	Row,
	Card,
	Form,
	FormGroup,
	FormControl,
	ListGroup,
	Button,
	Breadcrumb,
  } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast"

export const SisterCase =() =>{
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const params = useParams();
  const history = useHistory();
	const [editModal, SetEditModal] = useState(false);
    const [justices, setJustices] = useState([]);
	const [deleteModal, SetDeleteModal] = useState(false);
  const [viewModal, SetviewModal] = useState(false);
  const [caseID, SetcaseID] = useState('');
  const [caseSuiteName, SetcaseSuiteName] = useState('');
  const [Parties, SetParties] = useState('');

	const [isLoading, setLoading] = useState(false);
	
	
	const openEditModal = async () => {
		SetEditModal(true)
		
	  }
	  const closeEditModal = async () => {
		SetEditModal(false)
		
	  }

    // function openDeleteModal(id, suite_no) {
    //   // Access the values id and suite_no here and perform the desired operations
    //   console.log(id); // Example: Log the id value
    //   console.log(suite_no); // Example: Log the suite_no value
    
    //   // Rest of your code for opening the delete modal
    // }

	  const openDeleteModal = async (id, suiteNumber) => {
      reset()
      SetcaseID(id)
      SetcaseSuiteName(suiteNumber)
      console.log("sister id", id, suiteNumber);
		SetDeleteModal(true)
		
	  }
    const openViewModal = async (Parties, suiteNumber) => {
      reset()
      SetParties(Parties)
      SetcaseSuiteName(suiteNumber)
      console.log("sister id", Parties, suiteNumber);
		SetDeleteModal(true)
		
	  }
	  const closeDeleteModal = async () => {
		SetDeleteModal(false)
		
	  }
	

    const handleCreateCaseTypes = async () => {
      console.log("Case Delete ID", caseID);
      setLoading(true);
      try {
        await endpoint.put(`/case-diary/deactivate-attachement/${caseID}`)
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

    const SittingJustices = async () => {
		setLoading(true);
		await endpoint
			.get(`/diary-justice/list/${params.id}`)
			.then((res) => {
				console.log("justices to dairy", res.data.data);
				setJustices(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
  useEffect(() => {
		SittingJustices()
	}, []);
  
  
	
		return (
			<div>
				

				<div className="row">
					<div className="col-12 grid-margin">
						<div className="card">
							<div className="card-body">
								<h4 className="card-title  text-center"  >Sitting Justices</h4>
								<div className="table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th> S/N </th>
												<th> Name </th>
												<th> Rank </th>
												<th> Action </th>
											</tr>
										</thead>
										<tbody>
											
										{ justices.map((s, index)=>
											<tr key={s.id}>
                      <td>{index+1}</td>
                      <td>{s.Justice.name}</td>
                      <td>{s.Justice.rank}</td>
                      <td>
                      
                        <button
                          onClick={() => openDeleteModal(s.id, s.Case.suite_no)}
                          className="btn btn-warning btn-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                    
											)}
											
										</tbody>
									</table>

  



				<Modal show={viewModal} >
                    <Modal.Header >
                        <Button
                           onClick={() => {
                            SetDeleteModal(false);
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
                <p className="card-description text-center"> Case Details </p>
                <form className="forms-sample" onSubmit={handleSubmit(handleCreateCaseTypes)}>
                  <Form.Group>
                    {/* <label htmlFor="exampleInputName1">First Name</label> */}
                    <h4> Suit Number:  {caseSuiteName}</h4>
                    <p>Parties: {Parties}</p>
                  </Form.Group>
                </form>
              </div>
            </div>
          </div>
        
          </div>
                </Modal>



                <Modal show={deleteModal} >
                    <Modal.Header >
                        <Button
                           onClick={() => {
                            SetDeleteModal(false);
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
                <p className="card-description text-center"> Do you want to remove this Case from this diary? </p>
                <form className="forms-sample" onSubmit={handleSubmit(handleCreateCaseTypes)}>
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
						</div>
					</div>
				</div>
        
			</div>
		);
	}
export default SisterCase;


