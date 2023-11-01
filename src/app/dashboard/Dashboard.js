import React, { useState, useEffect } from 'react';
import { ProgressBar } from 'react-bootstrap';
import Calender from './cases/Index'
import { Bar, Doughnut } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import Users from './users/Users';
import endpoint from "../../auth/endpoint"

// import "react-datepicker/dist/react-datepicker.css";

const Dashboard = () => {
  const [activeCaseCount, setActiveCaseCount] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const getActiveCaseCount = async () => {
		setLoading(true);
		await endpoint.get('/case/case-type-count')
		  .then((res) => {
			console.log(" list", res.data.data)
			setActiveCaseCount(res.data.data)
			setLoading(false)
		  })
		  .catch((err) => {
			setLoading(false)
			console.log(err)
		  })
	  }

    useEffect(() => {
      getActiveCaseCount()
     }, [])
   
    return (
      <div>
      
        <div className="page-header">
          <h3 className="page-title">
            <span className="page-title-icon bg-gradient-primary text-white mr-2">
              <i className="mdi mdi-home"></i>
            </span> Dashboard </h3>
          <nav aria-label="breadcrumb">
            <ul className="breadcrumb">
              <li className="breadcrumb-item active" aria-current="page">
                <span></span>Overview <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="row">
          {activeCaseCount.map((count)=>
        <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-primary card-img-holder text-white">
              <div className="card-body">
                <h4 className="font-weight-normal mb-3">{count.caseType.case_type} <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                </h4>
                <h2 className="mb-5">{count.count} </h2>
                {/* <h6 className="card-text">Increased by 60%</h6> */}
              </div>
            </div>
          </div>
          )}
         
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body p-0 d-flex">
                <div className="dashboard-custom-date-picker">
                  <Calender />
                  {/* <DatePicker inline selected={this.state.startDate}  onChange={this.handleChange}/> */}
                </div>
              </div>
            </div>
          </div>
         
        </div>
       {/* <Users /> */}
 
      </div> 
    );
}

export default Dashboard;
