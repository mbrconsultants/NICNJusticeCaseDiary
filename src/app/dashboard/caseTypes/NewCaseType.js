import React, { Component } from 'react';
import { useState, useContext, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import bsCustomFileInput from 'bs-custom-file-input'
import { useForm } from 'react-hook-form';
import endpoint from "../../../auth/endpoint"
import { SuccessAlert, ErrorAlert } from '../../../toasst/toast';

import { CForm, CCol, CFormLabel, CFormFeedback, CFormInput, CInputGroup, CInputGroupText, CButton, CFormCheck, } from "@coreui/react";

export const NewCaseType = () => {
  const history = useHistory();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const [isLoading, setLoading] = useState(false);


  const handleCreateCaseTypes = async (data) => {
    console.log("case types", data);
    setLoading(true);
    try {
      await endpoint.post('/case-type/create', data)
        .then((res) => {
          history.push(`/case-types`);
          SuccessAlert(res.data.message);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      ErrorAlert(error.response.data.message)
      console.log(error);
    }
    // console.log(data)
  };


  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Case </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><a href="case-types">Case Types</a></li>
            <li className="breadcrumb-item active" aria-current="page">Type</li>
          </ol>
        </nav>
      </div>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center"> Case Type Registration </h2>
              <form className="forms-sample" onSubmit={handleSubmit(handleCreateCaseTypes)}>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Case Type Name</label>
                  <Form.Control  {...register("case_type")} type="text" className="form-control" id="exampleInputName1" placeholder="Case Type " />
                </Form.Group>
                <Form.Group>
                  <label htmlFor="exampleInputName1">Case Type Color</label>
                  {/* <Form.Control  {...register("case_color")} type="text" className="form-control" id="exampleInputName1" placeholder="Case Type Color " /> */}
                  <select
                    className="form-control"
                    {...register("case_color")}
                    onChange={(e) => { setValue("case_color", e.target.value) }}
                  >
                    <option value="">--Select--</option>
                      <option key={1} value={'green'}> Green </option>
                      <option key={2} value={'red'}> Red </option>
                      <option key={3} value={'blue'}> Blue </option>
                      <option key={4} value={'violet'}> Violet </option>
                  </select>
                </Form.Group>

                <button type="submit" className="btn btn-gradient-primary mr-2">Submit</button>

              </form>
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}


export default NewCaseType
