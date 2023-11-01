import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";

export class UsersCase extends Component {
	
	render() {
		return (
			<div>
				<div className="page-header">
					<h3 className="page-title"> User </h3>
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">
								<a
									href="!#"
									onClick={(event) => event.preventDefault()}>
									All
								</a>
							</li>
							<li
								className="breadcrumb-item active"
								aria-current="page">
								{" "}
								User
							</li>
						</ol>
					</nav>
				</div>

				<div className="row">
					<div className="col-12 grid-margin">
						<div className="card">
							<div className="card-body">
								<h4 className="card-title">All UsersCase</h4>
								<div className="table-responsive">
									<table className="table">
										<thead>
											<tr>
                                                 <th> S/N </th>
												<th> Name </th>
												<th> Designation </th>
												<th> Division </th>
												<th> Action </th>
											</tr>
										</thead>
										<tbody>
											<tr>
                                                <td>1</td>
												<td>
													<img
														src={require("../../../assets/images/faces/face1.jpg")}
														className="mr-2"
														alt="face"
													/>{" "}
													David Grey{" "}
												</td>
												<td>Chief Judge </td>
												<td> Sokoto </td>
												<td>
													<label className="badge badge-gradient-success">
														DONE
													</label>
												</td>
												<td>
													<a
														className="btn btn-primary btn-sm"
														href="/user-cases/:id">
														View Cases
													</a>
													
												</td>
											</tr>
                                            <tr>
                                                <td>2</td>
												<td>
													<img
														src={require("../../../assets/images/faces/face1.jpg")}
														className="mr-2"
														alt="face"
													/>{" "}
													David Samuel{" "}
												</td>
												<td>Chief Judge </td>
												<td> Sokoto </td>
												<td>
													<label className="badge badge-gradient-success">
														DONE
													</label>
												</td>
												<td>
													<a
														className="btn btn-primary btn-sm"
														href="">
														View Cases
													</a>
													
												</td>
											</tr>
                                            <tr>
                                                <td>2</td>
												<td>
													<img
														src={require("../../../assets/images/faces/face1.jpg")}
														className="mr-2"
														alt="face"
													/>{" "}
													David Ikechurku{" "}
												</td>
												<td>Chief Judge </td>
												<td> Sokoto </td>
												<td>
													<label className="badge badge-gradient-success">
														DONE
													</label>
												</td>
												<td>
													<a
														className="btn btn-primary btn-sm"
														href="">
														View Cases
													</a>
													
												</td>
											</tr>
										
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default UsersCase;
