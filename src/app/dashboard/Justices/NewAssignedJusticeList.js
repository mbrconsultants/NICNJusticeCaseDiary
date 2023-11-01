import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import endpoint from "../../../auth/endpoint";
import { Button, Form, Modal } from "react-bootstrap";
import Loader from "react-loader-advanced";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Header from "../../shared/Header";
import style from "./style.css";
import { Link, useHistory } from "react-router-dom";

export const AssignedJustices = () => {
  const history = useHistory();
  const [data, SetJustices] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [deleteModal, SetDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [assignedJusticesList, SetAssignedJusticesList] = useState([]);

  const [filterText, setFilterText] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [caseTypeList, setCaseTypeList] = useState([]);
  const [caseCategoryList, setCaseCategoryList] = useState([]);
  const [myDate, setMyDate] = useState("");
  const [caseCatID, setCaseCatID] = useState("");
  const [caseTypeID, setCaseTypeID] = useState("");

  const [selectedRow, setSelectedRow] = useState({
    id: "",
    name: "",
    castypeId: caseTypeID,
    casecatID: caseCatID,
  });
  const openDeleteModal = async () => {
    SetDeleteModal(true);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const getJusticeList = async () => {
    setLoading(true);
    try {
      const res = await endpoint.get("/justice/list");
      console.log("justice", res.data.data);
      SetJustices(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    getJusticeList();
    getCaseTypes();
    getCaseCategory();
  }, []);

  const handleFilter = (e) => {
    setFilterText(e.target.value);
  };

  const handleCheckboxChange = (row) => {
    const selectedIndex = selectedRows.findIndex(
      (selectedRow) => selectedRow.id === row.id
    );
    let newSelectedRows = [];

    if (selectedIndex === -1) {
      newSelectedRows = [...selectedRows, row];
    } else if (selectedIndex === 0) {
      newSelectedRows = [...selectedRows.slice(1)];
    } else if (selectedIndex === selectedRows.length - 1) {
      newSelectedRows = [...selectedRows.slice(0, -1)];
    } else if (selectedIndex > 0) {
      newSelectedRows = [
        ...selectedRows.slice(0, selectedIndex),
        ...selectedRows.slice(selectedIndex + 1),
      ];
    }

    setSelectedRows(newSelectedRows);
    // setSelectedRows({justice_id:newSelectedRows.id, newSelectedRows});
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
      width: "400px",
      cell: (row) => (
        <div className="fs-12 fw-bold">
          <input
            className="checkbox text-primary"
            type="checkbox"
            checked={selectedRows.some(
              (selectedRow) => selectedRow.id === row.id
            )}
            onChange={() => handleCheckboxChange(row)}
          />
          {row.name}
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => [row.email],
      style: { textAlign: "right" },
      sortable: true,
      width: "300px",
      cell: (row) => <div className="fs-12 fw-bold">{row.email}</div>,
    },
    {
      name: "Rank",
      selector: (row) => [row.rank],
      style: { textAlign: "right" },
      sortable: true,
      width: "220px",
      cell: (row) => <div className="fs-12 fw-bold">{row.rank}</div>,
    },
  ];
  let count=1;

  const tableDatas = {
    columns,
    data,
    filter: true,
    filterText: filterText,
    filterUpdate: handleFilter,
  };

  const handleSubmitSelectedUsers = async (e) => {
    e.preventDefault();
    console.log("selected date", myDate);
    const formattedDate = selectedDate
      ? selectedDate.toISOString().substring(0, 10)
      : null;

    const selectedRowsWithDate = selectedRows.map((row) => ({
      justice_id: row.id,
      sitting_date: myDate.toString(),
      case_type_id: caseTypeID,
      case_type_cat_id: caseCatID,
    }));

    console.log("selected", selectedRowsWithDate);

    try {
      await endpoint
        .post("/new-justice/assign", selectedRowsWithDate)
        .then((res) => {
          console.log("res", res);
          SuccessAlert(res.data.message);
          setTimeout(() => {
            getAssignedJusticeList(myDate); // Pass myDate as an argument if needed
          }, 500); // Add a slight delay (e.g., 500 milliseconds) before calling getAssignedJusticeList
        })
        .catch((err) => {
          ErrorAlert(err.response.data.message);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const dateSuffix = (day) => {
    if (day == 1 || day == 21 || day == 31) {
      return day + "" + "st";
    } else if (day == 2 || day == 22) {
      return day + "" + "nd";
    } else if (day == 3 || day == 23) {
      return day + "" + "rd";
    } else {
      return day + "" + "th";
    }
  };

  const formattedDate =
    myDate &&
    (
      new Date(myDate).toLocaleDateString("en-us", { weekday: "long" }) +
      ", " +
      dateSuffix(
        new Date(myDate).toLocaleDateString("en-us", { day: "numeric" })
      ) +
      " day of " +
      new Date(myDate).toLocaleDateString("en-us", { month: "long" }) +
      ", " +
      new Date(myDate).toLocaleDateString("en-us", {
        year: "numeric",
      })
    ).toUpperCase();

  const getAssignedJusticeList = async (date, e) => {
    // Prevent page reload

    console.log("date", date);
    try {
      const res = await endpoint.get(`/new-justice/qualified-list-new/${date}`);
      console.log("assigned justices List", res.data.data);
      SetAssignedJusticesList(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  const handleRemoveassignedJustice = async (date) => {
    console.log("date", myDate);
    console.log("justices ID", selectedRow.id);

    try {
      const res = await endpoint.delete(
        `/new-justice/assigned-delete/${selectedRow.id}/${myDate}`
      );
      console.log("assigned justices List", res.data.data);
      SuccessAlert(res.data.message);
      SetDeleteModal(false);
      getAssignedJusticeList(myDate);
    } catch (err) {
      ErrorAlert(err.response.data.message);
      SetDeleteModal(false);
      console.log(err);
    }
    setLoading(false);
  };

  //get case type
  const getCaseTypes = async () => {
    try {
      const res = await endpoint.get(`/case-type/list`);
      console.log("Case Type", res.data.data);
      setCaseTypeList(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  //get case category
  const getCaseCategory = async () => {
    try {
      const res = await endpoint.get(`/case-type-cat/list`);
      console.log("Case category", res.data.data);
      setCaseCategoryList(res.data.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="filter-container">
            <input
              className="filter-input mb-1"
              type="text"
              placeholder="Filter table"
              value={filterText}
              onChange={handleFilter}
              style={style}
            />
            <div className="date-picker-container">
              <div className="filter-input mb-1">
                <label htmlFor="caseType">Case Type:</label>
                <select
                  className="form-control"
                  value={caseTypeID}
                  onChange={(e) => setCaseTypeID(e.target.value)}>
                  <option value="type1">--select--</option>
                  {caseTypeList &&
                    caseTypeList.map((caseType) => (
                      <option value={caseType.id}>{caseType.case_type}</option>
                    ))}
                </select>
              </div>
              <div className="filter-input mx-5">
                <label htmlFor="caseCategory">Case Category:</label>
                <select
                  className="form-control"
                  value={caseCatID}
                  onChange={(e) => setCaseCatID(e.target.value)}>
                  <option value="type1">--select--</option>
                  {caseCategoryList &&
                    caseCategoryList.map((caseCat) => (
                      <option value={caseCat.id}>
                        {caseCat.case_type_cat}
                      </option>
                    ))}
                </select>
              </div>
              <input
                type="date"
                value={myDate}
                onChange={(e) => {
                  setMyDate(e.target.value);
                  getAssignedJusticeList(e.target.value, e);
                }}
              />
            </div>
          </div>

          <DataTable
            fixedHeader
            columns={columns}
            data={filteredData} // Pass the `Cases` data here persistTableHead
            defaultSortField="id"
            defaultSortAsc={true}
            striped={true}
            center={true}
            pagination
            paginationServer
            paginationRowsPerPageOptions={[10, 15, 20, 25, 30, 50, 100]}
            highlightOnHover
          />

          <Button
            className="btn btn-sm"
            variant="primary"
            onClick={(e) => {
              handleSubmitSelectedUsers(e);
            }}>
            Assign
          </Button>
          {assignedJusticesList.length > 0 ? (
            <div className="row">
              <div className="col-12 grid-margin">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title text-center text-underline">
                      <p>SITTING JUSTICES FOR {formattedDate}</p>
                    </h4>
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th> S/N </th>
                            <th> Name </th>
                            <th> Case Type(Category) </th>
                          </tr>
                        </thead>
                        <tbody>
                          {assignedJusticesList.map((user, index) => (
                            <React.Fragment key={index}>
                              {user.JusticeAssignmentNew.map(
                                (justice, jIndex) => (
                                  <tr key={jIndex}>
                                    <td>{count++}</td>
                                    <td>{justice.Justice.name}</td>
                                    <td>
                                      {user.CaseType
                                        ? `${user.CaseType.case_type} (${
                                            user.CaseTypeCategory
                                              ? user.CaseTypeCategory
                                                  .case_type_cat
                                              : ""
                                          })`
                                        : ""}
                                    </td>
                                    <td>
                                      <Button
                                        className="btn btn-danger btn-sm mdi mdi-archive"
                                        onClick={() => {
                                          setSelectedRow({
                                            id: justice.Justice.id,
                                            name: justice.Justice.name,
                                          });
                                          openDeleteModal();
                                        }}
                                      />
                                    </td>
                                  </tr>
                                )
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              No Justices assigned for this date
            </div>
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
                      Please confirm you want to remove <br />
                      {selectedRow.name}
                      <br /> from {formattedDate} ?
                    </p>

                    <button
                      type="submit"
                      onClick={(e) => {
                        handleRemoveassignedJustice();
                      }}
                      className="btn btn-gradient-primary mr-2">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default AssignedJustices;
