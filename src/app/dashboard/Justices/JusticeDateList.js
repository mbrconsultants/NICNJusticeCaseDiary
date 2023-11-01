import React, { useState, useEffect } from 'react'
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import { useForm } from 'react-hook-form';

const CauseListCounsel = () => {
const [isLoading, setLoading] = useState(false);
const [JusticesDateList, setJusticesDateList] = useState([]);
const [date, setDate] = useState('');
const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
const curDate = new Date()
const dateStr = curDate.toDateString()
const [justicesDate, setjusticesDate] = useState({
startDate: '',
endDate: ''

})

const formatDate = (date) => {
const options = {
weekday: "long",
day: "numeric",
month: "long",
year: "numeric",
};

return date.toLocaleDateString("en-US", options);
};

const sittingDates = formatDate(new Date(justicesDate.startDate));
// const sittingDates = JusticesDateList.length >0 ? JusticesDateList[1].sitting_date :'';
// const sittingDates = JusticesDateList.map(item => item.sitting_date);

const handleFetchData = async () => {
console.log('dates', justicesDate);
setLoading(true)
await endpoint.get(`/justice/assigned-list/${justicesDate.startDate}/${justicesDate.endDate}`)
.then((res) => {
console.log("response", res.data.data)
setJusticesDateList( res.data.data)
setLoading(false)
}).catch((err) => {
console.log(err)
setLoading(false)
})
}

return (
<>

				<div className='row mt-2'>
								<div className='col-md-12 text-center'>
												Select date to view assigned justices
								</div>
				</div>

				<div className='row mt-4'>
								<div className='col'>
                                <div className="input-group mb-3">
                                <label className='ml-5'>From</label>
<input
  type="date"
  className="form-control"
  aria-label="From Date"
  aria-describedby="button-addon2"
  style={{ width: '200px' }}
  value={justicesDate.startDate} // Use justicesDate.startDate instead of date
  {...register("startDate")}
  onChange={(e) => {
    setjusticesDate({ ...justicesDate, startDate: e.target.value.toString() });
  }}
/>

<label className='ml-5'>To</label>
<input
  type="date"
  className="form-control"
  aria-label="To Date"
  aria-describedby="button-addon2"
  style={{ width: '200px' }}
  value={justicesDate.endDate} // Use justicesDate.endDate instead of date
  {...register("endDate")}
  onChange={(e) => {
    setjusticesDate({ ...justicesDate, endDate: e.target.value.toString() });
  }}
/>

  <div className="input-group-append ml-5">
    <button className="btn btn-outline-primary" type="button" onClick={handleFetchData} id="button-addon2">Search</button>
  </div>
</div>

												</div>

								</div>
								<div className='col'>

								</div>
				

				{isLoading &&
				<Loader />}

				{!isLoading &&
				<div className='row mt-4'>
								<div className='col-md-12'>

												<>
																{JusticesDateList.length > 0 ?

																<div className="row">
																				<div className="col-12 grid-margin">
																								<div className="card">
																												<div className="card-body">
																																<h4 className="card-title text-center text-underline">
																																				<p>
																																								IN THE SUPREME COURT OF NIGERIA
																																				</p>
																																				<p>
																																								HOLDEN AT ABUJA

																																				</p>
																																				<p>
																																								{sittingDates}
																																				</p>
																																				<p>
																																								BEFORE THEIR LORDSHIPS
																																				</p>

																																</h4>
																																<div className="table-responsive">
																																				<table className="table">
																																								<thead>
																																												<tr>
																																																<th> S/N </th>
																																																<th> Name </th>

																																												</tr>
																																								</thead>
																																								<tbody>

																																												{JusticesDateList.map((user, index)=>
																																												<tr key={user.id}>
																																																<td>{index+1}</td>
																																																<td>

																																																				{user.Justice.name }
																																																</td>

																																												</tr>
																																												)}

																																								</tbody>
																																				</table>

																																</div>
																												</div>
																								</div>
																				</div>
																</div>

																:
																<div className='text-center'>
																				No Record Found
																</div>
																}
												</>

								</div>
				</div>
				}
</>
)
}

export default CauseListCounsel
