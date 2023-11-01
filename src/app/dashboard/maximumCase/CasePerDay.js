import React, { useState, useEffect } from 'react'
import { Modal } from "react-bootstrap";
import endpoint from "../../../auth/endpoint"
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import Loader from "react-loader-advanced";
import {
    Button, Form
} from "react-bootstrap";

const CasePerDay = () => {

    // const [editModal, SetEditModal] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [limits, setLimits] = useState([]);
    const [selectedRow, setSelectedRow] = useState({
        id: "",
        limit: "",
        day: "",
        status: 1
    });

    useEffect(() => {
        getLimits()
    }, [])

    const getLimits = async () => {
        setLoading(true)
        await endpoint.get(`/limit/list`)
            .then((res) => {
                setLoading(false)
                setLimits(res.data.data)
                console.log("limit", res.data.data)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                ErrorAlert(err.response.data.message)
            })
    }

    const [isEditing, setIsEditing] = useState(null);

    const handleTextClick = (id) => {
        setIsEditing(id);
    };

    // const openEditModal = async () => {
    //     SetEditModal(true)
    // }

    const updateLimit = async (e) => {
        e.preventDefault();
        console.log("update data", selectedRow)
        setLoading(true)
        await endpoint.put(`/limit/edit/${selectedRow.id}`, selectedRow)
            .then((res) => {
                setLoading(false)
                const newLimit = limits.map((limit) => {
                    if (limit.id === selectedRow.id) {
                        const updatedItem = {
                            ...limit,
                            id: selectedRow.id,
                            limit: selectedRow.limit
                        };

                        return updatedItem;
                    }

                    return limit;
                });
                setIsEditing(null)
                setLimits(newLimit)
                SuccessAlert(res.data.message)
                // SetEditModal(false)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
                ErrorAlert(err.response.data.message)
            })
    }

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title"> Case Limit </h3>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a
                                href="#"
                            >
                                Case Limit per day
                            </a>
                        </li>
                        <li
                            className="breadcrumb-item active"
                            aria-current="page">
                            {" "}
                            Daily limit
                        </li>
                    </ol>
                </nav>
            </div>

            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title"> Case Daily Limits</h4>
                            <p><span className='text-danger'>***</span> To Edit please click on the limit <span className='text-danger'>***</span> </p>
                            <div className='text-right'>

                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th> S/N</th>
                                            <th> Day </th>
                                            <th> Limit </th>
                                            <th> Action </th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {isLoading && <Loader />}

                                        {!isLoading && <>
                                            {limits && limits.map((limit, index) => (
                                                <tr key={index}>
                                                    <td> {index + 1} </td>
                                                    <td> {limit.day} </td>
                                                    {isEditing === limit.id ? (<td>
                                                        <input type="text"
                                                            className="form-control"
                                                            style={{ width: `70px` }}
                                                            value={selectedRow.limit}
                                                            onChange={(e) => setSelectedRow({ ...selectedRow, limit: e.target.value })}    
                                                        />
                                                    </td>) :
                                                        (<td onClick={() => {
                                                            handleTextClick(limit.id); setSelectedRow({
                                                                id: limit.id,
                                                                day: limit.day, limit: limit.limit
                                                            })
                                                        }}> {limit.limit} </td>)}
                                                    <td>
                                                        {/* <Button
                                                            onClick={() => {
                                                                setSelectedRow({
                                                                    id: limit.id,
                                                                    limit: limit.limit
                                                                });

                                                                openEditModal();
                                                            }}
                                                            className="btn btn-primary btn-sm"
                                                        >
                                                            Edit
                                                        </Button> */}

                                                        {isEditing === limit.id ?
                                                            <Button
                                                                onClick={updateLimit}
                                                                className="btn btn-primary btn-sm"
                                                            >
                                                                Update
                                                            </Button>
                                                            : ""
                                                        }

                                                    </td>

                                                    {/* <Modal show={editModal} >
                                                        <Modal.Header >
                                                            <Button
                                                                onClick={() => { setSelectedRow(""); SetEditModal(false) }}
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
                                                                        <h2 className="card-title text-center">Update Limit</h2>
                                                                        <form className="forms-sample" onSubmit={updateLimit}>
                                                                            <Form.Group>
                                                                                <label htmlFor="exampleInputName1">Day</label>
                                                                                <Form.Control type="text" className="form-control" value={selectedRow.day} onChange={(e) => setSelectedRow({ ...selectedRow, day: e.target.value })} readOnly id="exampleInputName1" />
                                                                            </Form.Group>
                                                                            <Form.Group>
                                                                                <label htmlFor="exampleInputName1">Limit</label>
                                                                                <Form.Control type="text" className="form-control" value={selectedRow.limit} onChange={(e) => setSelectedRow({ ...selectedRow, limit: e.target.value })} />
                                                                            </Form.Group>

                                                                            <button type="submit" className="btn btn-gradient-primary mr-2">Save</button>

                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </Modal> */}

                                                </tr>
                                            ))}
                                        </>
                                        }

                                    </tbody>
                                </table>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CasePerDay