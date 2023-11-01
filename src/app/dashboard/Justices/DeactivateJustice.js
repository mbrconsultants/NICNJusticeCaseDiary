import React, { useState, useEffect } from 'react'
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import { useForm } from 'react-hook-form';
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
import { useHistory, useParams } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";

// import { Form } from "react-bootstrap";

const CauseListCounsel = () => {
const [isLoading, setLoading] = useState(false);
const [JusticesDateList, setJusticesDateList] = useState([]);
const [date, setDate] = useState('');
const [deleteModal, SetDeleteModal] = useState(false);
const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
const history = useHistory();

const [deactivateDetails, setDeactivateDetails] = useState({
case_id: '',
disqualify_justice_id: '',
sitting_date:"",
qualify_justice_id:""

});
const [selectedRow, setSelectedRow] = useState({
id:'', name:''
})
const openDeleteModal = async () => {
SetDeleteModal(true)
}
const [cases, setCases]=useState([]);
const [qualifiedJustices, setQualifiedJustices]=useState([]);
const [disqualifiedJustices, setDisqualifiedJustices]=useState([]);
const [inputValue, setInputValue] = useState('');
const [suggestions, setSuggestions] = useState([]);
const [justuceList, setJustuceList] = useState([]);

const getAllCaseForADate = async (date)=>{
console.log('case date', date);
await endpoint
.get(`/case-diary/cause-list/${date}`)
.then((res) => {
console.log("Cases response", res.data.data);
setCases(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});

}

const getAllQualifiedJustices = async (date)=>{
console.log('Qualified date', date);
await endpoint
.get(`/justice/qualified-list/${date}`)
.then((res) => {
console.log(" Qualified justice List", res.data.data);
setQualifiedJustices(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});

}
const getAllDisqualifiedJustices = async (date)=>{
console.log('disqualified date', date);
await endpoint
.get(`/justice/disqualified-list/${date}`)
.then((res) => {
console.log("disqualified justice response", res.data.data);
setDisqualifiedJustices(res.data.data);
setLoading(false);
})
.catch((err) => {
setLoading(false);
console.log(err);
});

}

const getDateDetails = async (date)=>{
console.log('date details', date);
await endpoint
.get(`/justice/show-disqualification/${date}`)
.then((res) => {
console.log("date details", res.data.data);
setJustuceList(res.data.data);

})
.catch((err) => {
setLoading(false);
console.log(err);
});

}

//delete disqualified justices
const deleteDisqualifiedJustices = (e, id) => {
  e.preventDefault();
  console.log("deleted id", id);
  setLoading(true);
  endpoint.delete(`/justice/delete-disqualification/${id}`)
  .then((res) => {
    SetDeleteModal(false)
    setLoading(false);
    SuccessAlert(res.data.message)
    setJustuceList(justuceList.filter((c) => c.id !== id))
  }).catch((err) => {
    setLoading(false);
    SetDeleteModal(false)
    ErrorAlert(err.response.data.message)
    console.log(err)
  })
}


//deactivate details function
const handleSubmitForm = async () => {
console.log('details', deactivateDetails);
try {
await endpoint
.post("/justice/disqualified", deactivateDetails)
.then((res) => {
	SuccessAlert(res.data.message);
	getDateDetails(deactivateDetails.sitting_date);
})
.catch((error) => {
ErrorAlert(error.response.data.message);
console.log(error);
});
} catch (error) {
console.log(error);
}
}

const handleInputChange = (e) => {
const value = e.target.value;
setInputValue(value);

const filteredSuggestions = cases.filter(
(caseItem) => caseItem.suite_no.toLowerCase().includes(value.toLowerCase())
);
setSuggestions(filteredSuggestions);

setDeactivateDetails({ ...deactivateDetails, SuitNo: value });
};

const handleSuggestionClick = (suggestion) => {
setInputValue(suggestion.suite_no);
setDeactivateDetails({
...deactivateDetails,
case_id: suggestion.case_id

});
setSuggestions([]);
};

return (
  <>
    <div className="row">
      <div className="col-12 grid-margin stretch-card">
        <div className="card">
          <div className="card-body">
            <h2 className="card-title text-center mb-5">
              {" "}
              Deactivate Justice{" "}
            </h2>

            <form
              className="forms-sample"
              onSubmit={handleSubmit(handleSubmitForm)}>
              <div className="row">
                <div className="col-md-3">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Date</label>
                    <Form.Control
                      type="date"
                      onChange={(e) => {
                        setDeactivateDetails({
                          ...deactivateDetails,
                          sitting_date: e.target.value,
                        });
                        getAllCaseForADate(e.target.value);
                        getAllQualifiedJustices(e.target.value);
                        getAllDisqualifiedJustices(e.target.value);
                        getDateDetails(e.target.value);
                      }}
                      className="form-control"
                      id="exampleInputName1"
                      placeholder="Deactivate Justicee"
                    />
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Case suit Number</label>

                    <input
                      type="text"
                      className="form-control"
                      value={inputValue}
                      onChange={handleInputChange}
                    />

                    {suggestions.length > 0 && (
                      <ul>
                        {suggestions.map((suggestion) => (
                          <li
                            key={suggestion.id}
                            value={suggestion.id}
                            onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.suite_no}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Form.Group>
                </div>

                <div className="col-md-3">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">
                      {" "}
                      Disqualified Justice{" "}
                    </label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setDeactivateDetails({
                          ...deactivateDetails,
                          disqualify_justice_id: e.target.value,
                        })
                      }>
                      <option>--select--</option>
                      {qualifiedJustices.map((justice) => (
                        <option
                          key={justice.id}
                          value={justice.Justice.id}>
                          {justice.Justice.name}
                        </option>
                      ))}
                    </select>
                  </Form.Group>
                </div>
                <div className="col-md-3">
                  <Form.Group>
                    <label htmlFor="exampleInputName1">Qualified Justice</label>
                    <select
                      className="form-control"
                      onChange={(e) =>
                        setDeactivateDetails({
                          ...deactivateDetails,
                          qualify_justice_id: parseInt(e.target.value),
                        })
                      }>
                      <option>--select--</option>
                      {qualifiedJustices &&
                        disqualifiedJustices.map((justice) => (
                          <option
                            key={justice.id}
                            value={justice.id}>
                            {justice.name}
                          </option>
                        ))}
                    </select>
                  </Form.Group>
                </div>
              </div>

              <div class="container">
                <div class="row justify-content-end">
                  <div class="col-auto">
                    <button
                      type="submit"
                      class="btn btn-gradient-primary mr-2">
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    {justuceList.length > 0 ? (
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center text-underline">
                <p>
                  LIST OF DEACTIVATED JUSTICES
                  {/* {formattedDate} */}
                </p>
              </h4>
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th> S/N </th>
                      <th> Suit No. </th>
                      <th> Parties </th>
                      <th> Assigned Justice </th>
                      <th> Disqualified Justice </th>
                    </tr>
                  </thead>
                  <tbody>
                    {justuceList.map((data, index) => (
                      <tr key={data.id}>
                        <td>{index + 1}</td>
                        <td>{data ? data.Case.suite_no : ""}</td>
                        <td>
                          {data ? data.Case.appellants : ""}
                          <br />
                          {data ? "(" + data.Case.appellants_title + ")" : ""}
                          <br />
                          VS.
                          <br />
                          {data ? data.Case.respondent : ""}
                          <br />
                          {data ? "(" + data.Case.respondent_title + ")" : ""}
                        </td>

                        <td>{data ? data.QualifiedJustice.name : ""}</td>
                        <td>{data ? data.DisqualifiedJustice.name : ""}</td>
                        <td>
                          <Button
                            className="btn btn-danger btn-sm mdi mdi-archive"
                            onClick={() => {
                              setSelectedRow({
                                id: data.id,
                                name: data.DisqualifiedJustice.name,
                              });
                              openDeleteModal();
                            }}></Button>
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
    ) : (
      <div className="text-center">No Justices details for this date</div>
    )}
    <Modal show={deleteModal}>
      <Modal.Header>
        <Button
          onClick={() => SetDeleteModal(false)}
          className="btn-close"
          variant="">
          x
        </Button>
      </Modal.Header>
      <div className="row">
        <div className="col-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <p className="card-description text-center">
                {" "}
                Please confirm you want to Remove Justice {
                  selectedRow.name
                }?{" "}
              </p>
              <form className="forms-sample">
                <button
                  type="button"
                  onClick={(e) => deleteDisqualifiedJustices(e, selectedRow.id)}
                  className="btn btn-gradient-danger mr-2">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
);
}

export default CauseListCounsel
