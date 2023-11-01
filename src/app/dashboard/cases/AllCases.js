import React from "react";
import reactDom from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useEffect, useState } from "react";
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import {
	OverlayTrigger,
	Tooltip,
	Badge,
	Button,
	Modal,
	Form,
} from "react-bootstrap";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Header from "../../shared/Header";
import style from "./styles.css"

export const AllCases = () => {
	const [data, SetAllCase] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id: "",
		suite_no: "",
	});
	const [filterText, setFilterText] = useState("");

	const getCaseList = async () => {
		setLoading(true);
		try {
			const res = await endpoint.get("/case/cases-list");
			 console.log("case list", res.data.data);
			SetAllCase(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		getCaseList();
	}, []);

	const openDeleteModal = async () => {
		SetDeleteModal(true);
	};

	const deleteCase = (e, id) => {
		e.preventDefault();
		setLoading(true);
		endpoint
			.delete(`/case/delete/${id}`)
			.then((res) => {
				SetDeleteModal(false);
				setLoading(false);
				SuccessAlert(res.data.message);
				SetAllCase(data.filter((c) => c.id !== id));
			})
			.catch((err) => {
				setLoading(false);
				SetDeleteModal(false);
				ErrorAlert(err.response.data.message);
				console.log(err);
			});
	};
	

	const handleFilter = (e) => {
		setFilterText(e.target.value);
	};

	const filteredData = data.filter(
		(item) =>
			item.suite_no.toLowerCase().includes(filterText.toLowerCase()) ||
			item.parties.toLowerCase().includes(filterText.toLowerCase())
	);
	const columns = [
		{
			name: "#",
			cell: (row, index) => index + 1,
			width: "60px",
		},
		{
			name: "Suit Number",
			selector: (row) => [row.suite_no],

			style: { textAlign: "right" },
			sortable: true,

			width: "130px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.suite_no !== null ? row.suite_no.toUpperCase() : ""}
				</div>
			),
		},
		{
			name: "Parties",
			selector: (row) => [row.parties],

			style: { textAlign: "left" },
			sortable: true,

			width: "200px",
			cell: (row) => <div className="fs-12 fw-bold ">{row.parties}</div>,
		},
		{
			name: "Parties(Cause List)",
			selector: (row) => [row.parties_cause_list],

			style: { textAlign: "left" },
			sortable: true,

			width: "300px",
			cell: (row) => <div className="fs-12 fw-bold ">{row.parties_cause_list}</div>,
		},
		{
			name: "Applications",
			selector: (row) => [row.case_desc],

			style: { textAlign: "left" },
			sortable: true,

			width: "200px",
			cell: (row) => <div className="fs-12 fw-bold ">{row.case_desc}</div>,
		},
		{
			name: "Case Type",
			selector: (row) => [row.CaseType.case_type],

			style: { textAlign: "right" },
			sortable: true,

			width: "200px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.CaseType !== null
						? row.CaseType.case_type +
						  " (" +
						  row.CaseTypeCategory.case_type_cat +
						  ")"
						: ""}
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
					{row.status == 1 && (
						<Badge
							bg={row.status}
							className="badge bg-warning me-1 mb-1 mt-1">
							Active
						</Badge>
					)}
					{row.status == 0 && (
						<Badge
							bg={row.status}
							className="badge bg-danger me-1 mb-1 mt-1">
							InActive
						</Badge>
					)}
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
						<Link
							className="btn btn-dark btn-sm mdi mdi-tooltip-edit"
							to={`/edit-case/${row.id}`}>
							Edit
						</Link>

						<Button
							className="btn btn-danger btn-sm mdi mdi-archive"
							onClick={() => {
								setSelectedRow({ id: row.id, suite_no: row.suite_no });
								openDeleteModal();
							}}></Button>
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
		filter: true,
		filterText: filterText,
		filterUpdate: handleFilter,
	};

	return (
		<>
			{isLoading ? (
				<Loader
				// show={true}
				// message={"loading"}
				/>
			) : (
				<>
					<Header />
					<div className="filter-container">
						<input
							className="filter-input"
							type="text"
							placeholder="Filter table"
							value={filterText}
							onChange={handleFilter}
							style={style}
						/>
					</div>
					<DataTable
						fixedHeader
						columns={columns}
						data={filteredData} // Pass the `Cases` data here
						persistTableHead
						defaultSortField="id"
						defaultSortAsc={false}
						striped={true}
						center={true}
						pagination
						paginationServer
						paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
						highlightOnHover
					/>
				</>
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
									Please confirm you want to delete this Case{" "}
									{selectedRow.suite_no}?{" "}
								</p>
								<form className="forms-sample">
									<button
										type="button"
										onClick={(e) => deleteCase(e, selectedRow.id)}
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
};

export default AllCases;
