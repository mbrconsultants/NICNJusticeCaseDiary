import React, { useEffect, useState } from 'react'
import endpoint from "../../../auth/endpoint";
import { Link, Navigate } from "react-router-dom";
import Loader from "react-loader-advanced";
import './printCauseList.css'

const CauseList = () => {

    const [isLoading, setLoading] = useState(false);
    const [dailyCauseList, setDailyCauseList] = useState([]);
    const [date, setDate] = useState('');

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

    useEffect(() => {
        getDailyCauseList()
    }, [])

    const getDailyCauseList = async () => {
        setLoading(true)
        await endpoint.get(`/case-diary/cause-list`)
            .then(({ data }) => {
                console.log("response", data.data)
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
            }).catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    const handleFetchData = async () => {
        setLoading(true)
        await endpoint.get(`/case-diary/cause-list/${date}`)
            .then(({ data }) => {
                console.log("response", data.data)
                let causeArr = data.data

                const groupedData = causeArr.reduce((result, obj) => {
                    const key = obj.CaseType.case_type + ' ' + obj.CaseTypeCategory.case_type_cat + ' ' + (obj.AdjournmentType.id == 2 ? obj.AdjournmentType.id : '');
                    // const key = obj.CaseType.case_type + ' ' + obj.CaseTypeCategory.case_type_cat;
                    if (!result[key]) {
                        result[key] = [];
                    }

                    result[key].push(obj);

                    return result;
                }, []);
                setDailyCauseList(groupedData)
                setLoading(false)
            }).catch((err) => {
                console.log(err)
                setLoading(false)
            })
    }

    //function that adds "judgement" to heading
    const splitHeading = (str) => {
        const firstSpaceIndex = str.indexOf(' ')
        const firstPart = str.slice(0, firstSpaceIndex)
        return (firstPart+' '+'Judgement').toUpperCase()
    }

    //function that removes the adjournment id from heading
    const removeNumber = (str) => {
        const result = str.replace(/[0-9]/g, '')
        return (result+' '+'(s)').toUpperCase()
    }

    return (
        <>
            <div id='divToPrint'>
                <div className='row'>
                    <div className='col-md-12 text-center' style={{ textDecoration: `underline` }}> <span>IN THE SUPREME COURT OF NIGERIA</span><br />
                        HOLDEN AT ABUJA <br />
                        CAUSELIST FOR {date ? formattedDate : dateStr.toUpperCase()}
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
                                    <div className='causeListHeading'>
                                        <div className='text-center mb-2' style={{
                                            color: `${headings.toUpperCase().includes("CIVIL") ? 'green' : headings.toUpperCase().includes("CRIMINAL") ? "red" : headings.toUpperCase().includes("POLITICAL") ? "blue" : ""}
                                        `}}>
                                            
                                            {headings.includes(2) ? `${alphabetArray[index]}.`+' '+splitHeading(headings) : `${alphabetArray[index]}.`+' '+removeNumber(headings) }
                                            {/* {alphabetArray[index]}. {headings.toUpperCase()}(S) */}
                                        </div>
                                        <div className='table-reponsive'>
                                            <table className="table mb-5" style={{ width: `100%` }}>
                                                <thead className="thead-light">
                                                    <tr style={{ border: `1px solid black` }}>
                                                        <th style={{ maxWidth: `5px`, border: `1px solid black` }}>SN.</th>
                                                        <th scope="col" style={{ border: `1px solid black` }}>APPEAL NO.</th>
                                                        {headings.toUpperCase().includes("APPEAL") ?
                                                            <>
                                                                <th scope="col" style={{ border: `1px solid black` }}>APPLICANTS</th>
                                                                <th scope="col" style={{ border: `1px solid black` }}>RESPONDENTS</th>
                                                            </>
                                                            : <>
                                                                <th scope="col" style={{ border: `1px solid black` }}>PARTIES</th>
                                                                <th scope="col" style={{ border: `1px solid black` }}>APPLICATIONS</th>
                                                            </>
                                                        }

                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {
                                                        items.map((item, index) => (
                                                            <tr key={index} style={{ border: `1px solid black` }}>
                                                                <td style={{ border: `1px solid black` }}>{index + 1}.</td>
                                                                <td style={{ border: `1px solid black`, color: `${item.CaseType.case_color}` }}>{item.suite_no}</td>
                                                                {headings.toUpperCase().includes("APPEAL") ?
                                                                    <>
                                                                        <td style={{ whiteSpace: `normal`, border: `1px solid black` }}>
                                                                            <tr>{item.appellants}</tr>
                                                                            <tr>{item.appellants_title}</tr>
                                                                        </td>
                                                                        <td style={{ whiteSpace: `normal`, border: `1px solid black` }}>
                                                                            <tr>{item.respondent}</tr>
                                                                            <tr>{item.respondent_title}</tr>
                                                                        </td>
                                                                    </>
                                                                    :
                                                                    <>
                                                                        {/* <td style={{ whiteSpace: `normal` }}>{item.parties}</td> */}
                                                                        <td className='text-center' style={{ whiteSpace: `normal`, border: `1px solid black` }}>
                                                                            <tr>{item.appellants}</tr>
                                                                            <tr>({item.appellants_title}(s))</tr>
                                                                            <tr><div className='mt-2 mb-2'>VS.</div></tr>
                                                                            <tr>{item.respondent}</tr>
                                                                            <tr>({item.respondent_title}(s))</tr>
                                                                        </td>
                                                                        <td style={{ whiteSpace: `pre-wrap`, border: `1px solid black`, wordWrap: `break-word` }}>{item.case_desc}</td>
                                                                    </>
                                                                }

                                                            </tr>
                                                        ))
                                                    }
                                                </tbody>

                                            </table>
                                        </div>
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

export default CauseList