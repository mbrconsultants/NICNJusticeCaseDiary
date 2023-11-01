import React from "react";
import reactDom from "react-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Header from "../../shared/Header"
import style from "./style.css"

export const AllCases = () => {
	const [data, setAppellant] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
    const [EditModal, SetEditModal] = useState(false);
    const [createJusticesModal, SetcreateJusticesModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id:'', name:''
	})
    const [filterText, setFilterText] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

	const getAppelantList = async () => {
		setLoading(true);
		try {
			const res = await endpoint.get("/appellant-title/list");
			 console.log("Appellant Title", res.data.data);
			setAppellant(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		getAppelantList();
	}, []);

	const openDeleteModal = async () => {
		SetDeleteModal(true)
	}

    const openEditModal = async () => {
		reset()
		SetEditModal(true)
	}
    const openCreateJusticeModal = async () => {
		SetcreateJusticesModal(true)
	}

    const handleCreateJustices = async (data) => {
        console.log("Appellant create details", data);
        setLoading(true);
        try {
          await endpoint.post('/appellant-title/create', data)
            .then((res) => {
              SuccessAlert(res.data.message);
              getAppelantList()
            })
            .catch((err) => console.log(err));
        } catch (error) {
          ErrorAlert(error.response.data.message)
          console.log(error);
        }
        console.log(data)
      };
      

      const handleUpdateJustices = async (data) => {
		setLoading(true)
		console.log("id update", selectedRow.id)
		console.log("id data", data)

		await endpoint.put(`/appellant-title/edit/${selectedRow.id}`, data)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getAppelantList()
				SetEditModal(false)
				SuccessAlert(res.data.message)
			}).catch((err) => {
				console.log(err)
				setLoading(false)
				SetEditModal(false)
				ErrorAlert(err.response.data.message)
			})
	}
	const deleteCase = (e, id) => {
		e.preventDefault();
		setLoading(true);
		endpoint.delete(`/appellant-title/delete/${id}`)
		.then((res) => {
			SetDeleteModal(false)
			setLoading(false);
			SuccessAlert(res.data.message)
			setAppellant(data.filter((c) => c.id !== id))
		}).catch((err) => {
			setLoading(false);
			SetDeleteModal(false)
			ErrorAlert(err.response.data.message)
			console.log(err)
		})
	}


    const handleFilter = (e) => {
		setFilterText(e.target.value);
	};

	const filteredData = data.filter(
		(item) =>
			item.name.includes(filterText.toLowerCase()) ||
			item.rank.includes(filterText.toLowerCase())
           
	);

	const columns = [
		{
			name: "S/N",
			cell: (row, index) => index + 1,
			width: "60px",
		},
		{
			name: "Name",
			selector: (row) => [row.name],

			style: { textAlign: "left" },
			sortable: true,

			width: "300px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.name  }
				</div>
			),
		},

		// {
		// 	name: "Status",
		// 	selector: (row) => [row.status],

		// 	style: { textAlign: "right" },
		// 	sortable: true,

		// 	width: "100px",
		// 	cell: (row) => (
		// 		<div className="fs-12 fw-bold ">
		// 			{row.status === 1 && 
		// 			<Badge
		// 				bg={row.status}
		// 				className="badge bg-warning me-1 mb-1 mt-1">
		// 				Active
		// 			</Badge>
		// 			}
		// 			{row.status === 0 && 
		// 			<Badge
		// 				bg={row.status}
		// 				className="badge bg-danger me-1 mb-1 mt-1">
		// 				InActive
		// 			</Badge>
		// 			}
		// 		</div>
		// 	),
		// },
		{
			name: "Actions",
			selector: (row) => [row.role_id],

			style: { textAlign: "right" },
			sortable: true,

			width: "120px",
			cell: (row) => (
				<div className="fs-12 fw-bold row">
					<>
						<Button
							className="btn btn-dark btn-sm mdi mdi-tooltip-edit"
                            
							onClick={()=>
                                {  
                                    setSelectedRow({id:row.id, name:row.name, rank:row.rank ,email:row.email, phone_number:row.phone_number    });
                                    openEditModal()}
                               }
						>
							Edit
						</Button>

						{/* <Button
							className="btn btn-danger btn-sm mdi mdi-archive"
							onClick={() => {
								setSelectedRow({id:row.id, name:row.name   });
								openDeleteModal();
							}}
						>

						</Button> */}
					</>

				</div>
			),
		},
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
					/>
				) : (
					<>
  <div className="header-container" style={style}>
    <Header />
    <button className=" btn btn-success push-right" onClick={ openCreateJusticeModal}>Create Appellant</button>
  </div>
  <div className="filter-container">
						<input
							className="filter-input mb-1"
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
								<p className="card-description text-center"> Please confirm you want to delete Appellant Title {selectedRow.name}? </p>
								<form className="forms-sample">
	
									<button type="button" onClick={(e) => deleteCase(e, selectedRow.id)} className="btn btn-gradient-danger mr-2">Delete</button>

								</form>
							</div>
						</div>
					</div>

				</div>
			</Modal>
            <Modal show={createJusticesModal} >
				<Modal.Header >
					<Button
						onClick={() => SetcreateJusticesModal(false)}
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
								<p className="card-description text-center"> Create New Appellant </p>
								<form className="forms-sample" onSubmit={handleSubmit(handleCreateJustices)}>
                                <Form.Group>
										<label htmlFor="exampleInputName1">
											 Name{" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
											placeholder="Full Name"
                                            {...register("name")}
										/>
									</Form.Group>
									{/* <Form.Group>
										<label htmlFor="exampleInputName1">
											 Email{" "}
										</label>
										<Form.Control
											type="email"
											className="form-control"
											id="exampleInputName1"
											placeholder="Email"
                                            {...register("email")}
										/>
									</Form.Group>
									<Form.Group>
										<label htmlFor="exampleInputName1">
											 Phone{" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
											placeholder="Full Name"
                                            {...register("phone_number")}
										/>
									</Form.Group> */}
                                   
                                   
                                    

									<button type="submit"  className="btn btn-gradient-danger mr-2">Submit</button>

								</form>
							</div>
						</div>
					</div>

				</div>
			</Modal>
            <Modal show={EditModal} >
				<Modal.Header >
					<Button
						onClick={() => SetEditModal(false)}
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
								<p className="card-description text-center"> Edit Appellant Record </p>
								<form className="forms-sample" onSubmit={handleSubmit(handleUpdateJustices)}>
                                <Form.Group>
										<label htmlFor="exampleInputName1">
											Name {" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
											placeholder="Date"
                                            {...register("name")}
                                            defaultValue={selectedRow.name}
										/>
									</Form.Group>
								
                                   
                                    

									<button type="submit"  className="btn btn-gradient-danger mr-2">Submit</button>

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
