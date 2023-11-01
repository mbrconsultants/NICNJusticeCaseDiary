import React, { useEffect, useState } from "react";
import { useForm } from 'react-hook-form';
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import { OverlayTrigger, Tooltip, Badge, Button, Modal, Form } from "react-bootstrap";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Header from "../../shared/Header";
import style from "./style.css";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";

export const AllCases = () => {
	const [data, SetJustices] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [deleteModal, SetDeleteModal] = useState(false);
    const [EditModal, SetEditModal] = useState(false);
    const [createJusticesModal, SetcreateJusticesModal] = useState(false);
	const [selectedRow, setSelectedRow] = useState({
		id:'', name:'', rank:'', email:'', phone_number:''
	})
    const [filterText, setFilterText] = useState("");
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

	const getAssignedJusticeList = async () => {
		setLoading(true);
		try {
			const res = await endpoint.get("/justice/assigned-list");
			 console.log("assigned justices", res.data.data);
			SetJustices(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	useEffect(() => {
		getAssignedJusticeList();
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
        console.log("justices", data);
        setLoading(true);
        try {
          await endpoint.post('/justice/create', data)
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
      

      const handleUpdateJustices = async (data) => {
		setLoading(true)
		console.log("Justices update", data)
		await endpoint.put(`/justice/update/${selectedRow.id}`, data)
			.then((res) => {
				setLoading(false)
				console.log(res)
				getAssignedJusticeList()
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
		endpoint.delete(`/justice/delete/${id}`)
		.then((res) => {
			SetDeleteModal(false)
			setLoading(false);
			SuccessAlert(res.data.message)
			SetJustices(data.filter((c) => c.id !== id))
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

	
      
    const formatDate = (date) => {
        const options = {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        };
      
        return date.toLocaleDateString("en-US", options);
      };
      
   
     
      const filteredData = data.filter((item) => {
        console.log("Item:", item);
        console.log("Filter Text:", filterText);
      
        const formattedDate = formatDate(new Date(item.sitting_date));
        console.log("Formatted Date:", formattedDate);
      
        const match =
          item.Justice.name.includes(filterText.toLowerCase()) ||
          formattedDate.includes(filterText.toLowerCase());
        console.log("Match:", match);
      
        return match;
      });

	const columns = [
		{
			name: "S/N",
			cell: (row, index) => index + 1,
			width: "60px",
		},
		{
			name: "Suit No.",
			selector: (row) => [row.Justice.name],

			style: { textAlign: "left" },
			sortable: true,

			width: "300px",
			cell: (row) => (
				<div className="fs-12 fw-bold ">
					{row.Justice.name  }
				</div>
			),
		},
		

        {
            name: "Assigned Date",
            selector: (row) => [row.sitting_date],
            style: { textAlign: "right" },
            sortable: true,
            width: "300px",
            cell: (row) => (
              <div className="fs-12 fw-bold">
                {row.sitting_date}
                {/* {formatDate(new Date(row.sitting_date))} */}
              </div>
            ),
          },

          {
            name: "Assigned Justices",
            selector: (row) => [row.sitting_date],
            style: { textAlign: "right" },
            sortable: true,
            width: "300px",
            cell: (row) => (
              <div className="fs-12 fw-bold">
                {row.sitting_date}
                {/* {formatDate(new Date(row.sitting_date))} */}
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
								<p className="card-description text-center"> Please confirm you want to delete Justice {selectedRow.name}? </p>
								<form className="forms-sample">
	
									<button type="button" onClick={(e) => deleteCase(e, selectedRow.id)} className="btn btn-gradient-danger mr-2">Delete</button>

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
								<p className="card-description text-center"> Edit Justices Record </p>
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
									<Form.Group>
										<label htmlFor="exampleInputName1">
											Email {" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
										
                                            {...register("email")}
                                            defaultValue={selectedRow.email}
										/>
									</Form.Group>
									<Form.Group>
										<label htmlFor="exampleInputName1">
											Phone {" "}
										</label>
										<Form.Control
											type="text"
											className="form-control"
											id="exampleInputName1"
											placeholder="Phone Number"
                                            {...register("phone_number")}
                                            defaultValue={selectedRow.phone_number}
										/>
									</Form.Group>
                                    <Form.Group>
                  <label htmlFor="exampleInputName1">Rank</label>
                  
                  <select
                    className="form-control"
                    {...register("rank")}
                  >
                    <option value="">--Select--</option>
                    {selectedRow.rank !=="" ?  <option selected value={selectedRow.rank}>{selectedRow.rank}</option>:""}
  <option value={1}>1</option>
  <option value={2}>2</option>
  <option value={3}>3</option>
  <option value={4}>4</option>
  <option value={5}>5</option>
  <option value={6}>6</option>
  <option value={7}>7</option>
  <option value={8}>8</option>
  <option value={9}>9</option>
  <option value={10}>10</option>
  <option value={11}>11</option>
  <option value={12}>12</option>
  <option value={13}>13</option>
  <option value={14}>14</option>
  <option value={15}>15</option>
  <option value={16}>16</option>
  <option value={17}>17</option>
  <option value={18}>18</option>
  <option value={19}>19</option>
  <option value={20}>20</option>


                      
                  </select>
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
