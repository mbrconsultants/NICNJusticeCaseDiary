import React from "react";
import reactDom from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useEffect, useState } from "react";
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Header from "../../shared/Header"
import style from "./style.css"
import { useForm } from "react-hook-form";


export const AllCases = () => {
	const [data, SetHolidays] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [editModal, SeteditModal] = useState(false);
    const [holidayModal, SetHolidayModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id:'', year:'', month:'', day:''
	})
	const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

	const HolidayList = async () => {
		setLoading(true);
		try {
			const res = await endpoint.get("/holiday/list");
			 console.log("holiday", res.data.data);
			SetHolidays(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		HolidayList();
	}, []);

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}
	const openEditModal = async () => {
		SeteditModal(true)
	}
    const openHolidayModal = async () => {
		SetHolidayModal(true)
	}

    
	const deleteHoliday = (e, id) => {
		e.preventDefault();
		setLoading(true);
		endpoint.delete(`/holiday/delete/${id}`)
		.then((res) => {
			SetDeleteModal(false)
			setLoading(false);
			SuccessAlert(res.data.message)
			HolidayList()
		}).catch((err) => {
			setLoading(false);
			SetDeleteModal(false)
			ErrorAlert(err.response.data.message)
			console.log(err)
		})
	}
	const handleCreateHoliday = async (data) => {
		console.log("holiday", data);
		setLoading(true);
		try {
		  await endpoint.post('/holiday/create', data)
			.then((res) => {
			  SuccessAlert(res.data.message);
			  window.location.reload()
			})
			.catch((err) => console.log(err));
		} catch (error) {
		  ErrorAlert(error.response.data.message)
		  console.log(error);
		}
		console.log(data)
	  };
	
	  const updateHoliday = async (data) => {
		
		setLoading(true)
		console.log("data update", selectedRow)
		await endpoint.put(`/holiday/edit/${selectedRow.id}`, data)
			.then((res) => {
				setLoading(false)
				console.log(res)
				HolidayList()
				SeteditModal(false)
				SuccessAlert(res.data.message)
				reset()
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SeteditModal(false)
				ErrorAlert(err.response.data.message)
			})
	}
	const columns = [
		{
			name: "#",
			cell: (row, index) => index + 1,
			width: "60px",
		},
		{
			name: "Year",
			selector: (row) => [row.year],

			style: { textAlign: "right" },
			sortable: true,

			width: "130px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.year  }
				</div>
			),
		},
		{
			name: "Month",
			selector: (row) => [row.month],

			style: { textAlign: "left" },
			sortable: true,

			width: "200px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.month}
				</div>
			),
		},

		{
			name: "Day",
			selector: (row) => [row.day],

			style: { textAlign: "right" },
			sortable: true,

			width: "200px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.day}
				</div>
			),
		},
		{
			name: "Status",
			selector: (row) => [row.status],

			style: { textAlign: "right" },
			sortable: true,

			width: "100px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.status == 1 && 
					<Badge
						bg={row.status}
						className="badge bg-warning me-1 mb-1 mt-1">
						Active
					</Badge>
					}
					{row.status == 0 && 
					<Badge
						bg={row.status}
						className="badge bg-danger me-1 mb-1 mt-1">
						InActive
					</Badge>
					}
				</div>
			),
		},
		{
			name: "Actions",
			selector: (row) => [row.status],

			style: { textAlign: "right" },
			sortable: true,

			width: "500px",
			cell: (row) => (
				<div className="fs-12 fw-bold row">
					<>
						{/* <Button
							className="btn btn-primary btn-sm mdi mdi-eye"
						>
							View
						</Button> */}
						<Button
							className="btn btn-dark btn-sm mdi mdi-tooltip-edit"
							onClick={()=>{
								setSelectedRow({id:row.id, year:row.year, month:row.month, day:row.day})
								openEditModal()
							}}
						>
							Edit
						</Button>

						<Button
							className="btn btn-danger btn-sm mdi mdi-archive"
							onClick={() => {
								setSelectedRow({id:row.id, year:row.year, month:row.month, day:row.day});
								openDeleteModal();
							}}
						>

						</Button>
					</>

				</div>
			),
		},
		// {
		// 	name: "Actions",
		// 	selector: (row) => [row.id],

		// 	style: { textAlign: "right" },
		// 	sortable: true,

		// 	width: "120px",
		// 	cell: (row) => (
		// 		<div className="fs-12 fw-bold ">
		// 			<Link
		// 				to={`/case/${row.id}`}
		// 				className="btn btn-primary btn-sm">
		// 				{" "}
		// 				<span className="fe fe-edit"> View </span>
		// 			</Link>
		// 		</div>
		// 	),
		// },
	];

	const tableDatas = {
		columns,
		data,
	};

	return (
		<>
			<DataTableExtensions {...tableDatas}>
				{isLoading ? (
					<Loader
					/>
				) : (
					<>
  <div className="header-container" style={style}>
    <Header />
    <button className=" btn btn-success push-right" onClick={ openHolidayModal}>Create Holiday</button>
  </div>
  <DataTable
    fixedHeader
    columns={columns}
    data={data} // Pass the `Cases` data here
    persistTableHead
    defaultSortField="id"
    defaultSortAsc={true}
    striped={true}
    center={true}
    pagination
    paginationServer
    paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
    highlightOnHover
  />
</>
				)}
			</DataTableExtensions>

			<Modal show={deleteModal} >
				<Modal.Header >
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
								<p className="card-description text-center"> Please confirm you want to delete this Holiday {selectedRow.suite_no}? </p>
								<form className="forms-sample">
	
									<button type="button" onClick={(e) => deleteHoliday(e, selectedRow.id)} className="btn btn-gradient-primary mr-2">Delete</button>

								</form>
							</div>
						</div>
					</div>

				</div>
			</Modal>
            <Modal show={holidayModal} >
				<Modal.Header >
					<Button
						onClick={() => SetHolidayModal(false)}
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
								<p className="card-description text-center"> Create Holiday </p>
								<form className="forms-sample" onSubmit={handleSubmit(handleCreateHoliday)}>
                                <Form.Group>
										<label htmlFor="exampleInputName1">
											Holiday Date{" "}
										</label>
										<Form.Control
											type="date"
											className="form-control"
											id="exampleInputName1"
											placeholder="Date"
											{...register("date")}
										/>
									</Form.Group>
									<Form.Group>
										<label htmlFor="exampleInputName1">
											Holiday Description{" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
											placeholder="Description"
											{...register("description")}
										/>
									</Form.Group>

									<button type="submit"  className="btn btn-gradient-primary mr-2">Submit</button>

								</form>
							</div>
						</div>
					</div>

				</div>
			</Modal>
			<Modal show={editModal} >
				<Modal.Header >
					<Button
						onClick={() => SeteditModal(false)}
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
								<p className="card-description text-center"> Update Holiday </p>
								<form className="forms-sample" onSubmit={handleSubmit(updateHoliday)}>
                                <Form.Group>
										<label htmlFor="exampleInputName1">
											Holiday Date {selectedRow.year +"/"+selectedRow.month+"/"+selectedRow.day} {" "}
										</label>
										<Form.Control
										defaultValue={selectedRow.year +"/"+selectedRow.month+"/"+selectedRow.day}
											type="date"
											className="form-control"
											id="exampleInputName1"
											placeholder="Date"
											{...register("date")}
										/>
									</Form.Group>

									<button type="submit"  className="btn btn-gradient-primary mr-2">Submit</button>

								</form>
							</div>
						</div>
					</div>

				</div>
			</Modal>


		</>
	);
};

export default AllCases;
