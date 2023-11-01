import React, { useState, useEffect } from 'react'
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import './printCauseList.css'

const CauseListCounselWithSister = () => {
    const [isLoading, setLoading] = useState(false);
    const [dailyCauseList, setDailyCauseList] = useState([]);
    const [date, setDate] = useState('');

    //add suffix to date
    const dateSuffix = (day) => {
        if ((day == 1) || (day == 21) || (day == 31)) {
            return day + '' + "st";
        } else if ((day == 2) || (day == 22)) {
            return day + '' + "nd";
        } else if ((day == 3) || (day == 23)) {
            return day + '' + "rd";
        } else {
            return day + '' + "th";
        }
    }

    const formattedDate = date && (new Date(date).toLocaleDateString('en-us', { weekday: "long" }) + ", " + dateSuffix(new Date(date).toLocaleDateString('en-us', { day: "numeric" })) + " day of " +
        new Date(date).toLocaleDateString('en-us', { month: "long" }) + ", " + new Date(date).toLocaleDateString('en-us', { year: "numeric" })).toUpperCase();

    const curDate = new Date()
    const dateStr = (curDate.toLocaleDateString('en-us', { weekday: "long" }) + ", " + dateSuffix(curDate.toLocaleDateString('en-us', { day: "numeric" })) + " day of " +
        curDate.toLocaleDateString('en-us', { month: "long" }) + ", " + curDate.toLocaleDateString('en-us', { year: "numeric" })).toUpperCase();

    const alphabetArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    const todaysDate = () => {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const day = String(currentDate.getDate()).padStart(2, '0');

        const formatDate = `${year}-${month}-${day}`;

        console.log("new", formatDate);
        return formatDate
    }

    useEffect(() => {
        getDailyCauseList()
        dateSuffix()
    }, [])

    const getDailyCauseList = async () => {
        await endpoint.get(`/case-diary/new-day-list/${todaysDate()}`)
            .then(({ data }) => {
                let causeArr = data.data

                const groupedData = causeArr.reduce((result, obj) => {
                    const key = obj.CaseType.case_type + ' ' + obj.CaseTypeCategory.case_type_cat;

                    if (!result[key]) {
                        result[key] = [];
                    }

                    result[key].push(obj);

                    return result;
                }, []);
                setDailyCauseList(groupedData)
            }).catch((err) => {
                console.log(err)
            })
    }

    const handleFetchData = async () => {
        setLoading(true)
        await endpoint.get(`/case-diary/new-day-list/${date}`)
            .then(({ data }) => {
                let causeArr = data.data

                const groupedData = causeArr.reduce((result, obj) => {
                    const key = obj.CaseType.case_type + ' ' + obj.CaseTypeCategory.case_type_cat;

                    if (!result[key]) {
                        result[key] = [];
                    }

                    result[key].push(obj);

                    return result;
                }, []);
                setDailyCauseList(groupedData)
                setLoading(false)
                //updated to new endpoint
            }).catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    return (
        <>
            <div id='divToPrint'>
                <div className='row'>
                    <div className='col-md-12 text-center' style={{ textDecoration: `underline` }}> <span>IN THE SUPREME COURT OF NIGERIA</span><br />
                        HOLDEN AT ABUJA <br />
                        {date ? formattedDate : dateStr.toUpperCase()}
                    </div>
                </div>

                <div className='row mt-2'>
                    <div className='col-md-12 text-center'>
                        Counsels are required to put their names opposite the cases in this list in which they are
                        engaged and to supply to the Registrar with a list of authorities they intend to cite.
                    </div>
                </div>

                <div className='row mt-4'>
                    <div className='col'>
                        <div className="input-group mb-3" id='hideDate'>
                            <input type="date" className="form-control" aria-label="Recipient's username" aria-describedby="button-addon2"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                            <div className="input-group-append">
                                <button className="btn btn-outline-primary" type="button" onClick={handleFetchData} id="button-addon2">Search</button>
                            </div>
                        </div>

                    </div>
                    <div className='col'>

                    </div>
                </div>

                {isLoading && <Loader />}

                {!isLoading &&
                    <div className='row mt-4'>
                        <div className='col-md-12'>

                            {Object.entries(dailyCauseList).map(([headings, items], index) => (
                                <>
                                    <div className='table-reponsive'>
                                        <table className="table table-striped table-bordered mb-5" style={{ tableLayout: `fixed`, width: `100%`, border: `1px solid black` }}>
                                            <thead className="thead-light">
                                                <tr>
                                                    <th rowspan="2" style={{ border: `1px solid black`, width: `70px` }}>SNo.</th>
                                                    <th rowspan="2" style={{ border: `1px solid black` }}>{alphabetArray[index]}.{headings.toUpperCase()}</th>
                                                    <th colspan="2" style={{ border: `1px solid black`, textAlign: `center` }}>
                                                        COUNSEL'S NAME
                                                    </th>
                                                </tr>
                                                <tr>
                                                    <th className='text-center' style={{ border: `1px solid black` }}>For Appellant</th>
                                                    <th className='text-center' style={{ border: `1px solid black` }}>For Respondent</th>
                                                </tr>
                                            </thead>

                                            <tbody style={{ border: `1px solid black` }}>
                                                {
                                                    items.map((item, index) => (

                                                        <>
                                                            {item.CaseAttachements && item.CaseAttachements.map((Case, index2) => (
                                                                <tr key={index} style={{ border: `1px solid black` }}>
                                                                    {(index2 === 0) && <td rowSpan={item.CaseAttachements.length} style={{ border: `1px solid black` }}>{index + 1}.</td>}
                                                                    <td style={{ whiteSpace: `normal`, paddingBottom: `100px`, border: `1px solid black` }}>
                                                                        <span className='mb-2'>{Case.suite_no}</span>
                                                                        <p style={{ paddingTop: `5px` }}>{Case.parties}</p>
                                                                    </td>

                                                                    <td style={{ border: `1px solid black` }}></td>
                                                                    <td style={{ border: `1px solid black` }}></td>
                                                                </tr>
                                                            ))}
                                                        </>
                                                    ))
                                                }
                                            </tbody>

                                        </table>
                                    </div>
                                </>
                            ))}

                        </div>
                    </div>
                }

                {Object.entries(dailyCauseList).length > 0 &&
                    <div className='col-md-12 hideBtn'>
                        <button className="btn btn-outline-primary" type="button" onClick={() => window.print()} id="button-addon2">Print</button>
                    </div>
                }

            </div>
        </>

    )
}

export default CauseListCounselWithSister