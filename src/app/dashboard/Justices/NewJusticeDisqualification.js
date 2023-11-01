import React, { useEffect, useState } from "react";
import endpoint from "../../../auth/endpoint";
import Loader from "react-loader-advanced";
import moment from "moment";
import "./printDisqaulificationsnew.css";

const JusticeDisqualifications = () => {
  const [isLoading, setLoading] = useState(false);
  const [qualified, setQualified] = useState([]);
  const [disqualifications, setDisqualifications] = useState([]);
  const [moreData, setMoreData] = useState([]);
  // const [moreDisqualificationData, setMoreDisqualificationData] = useState([]);

  // Get the current date
  var today = new Date();
  // Format the date as desired (YYYY-MM-DD)
  var formattedToday = today.toISOString().split("T")[0];

  const [date, setDate] = useState(formattedToday);
  const [moreFields, setMoreFields] = useState([{ value: "" }]);
  const handleAddFields = () => {
    const newInputField = { value: "" };
    setMoreFields([...moreFields, newInputField]);
  };

  const handleInputChange = (index, event) => {
    const values = [...moreFields];
    values[index].value = event.target.value;
    setMoreFields(values);
  };

  const handleRmv = (e, index) => {
    setMoreFields(
      moreFields.filter((x) => x.value !== moreFields[index].value)
    );
    setMoreData((moreData[index] = ""));
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

  const getQualified = async (date) => {
    setLoading(true);
    console.log("date", date);
    await endpoint
      .get(`/new-justice/qualified-list-new/${date}`)
      .then(({ data }) => {
        setLoading(false);
        setQualified(data.data);
        console.log(
          "data",
          data.data.map((dat) => dat)
        );
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getDisqualified = async (date) => {
    setLoading(true);
    await endpoint
      .get(`/new-justice/assigned-cases-list/${date}`)
      .then(({ data }) => {
        setLoading(false);
        setDisqualifications(data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const formattedDate =
    date &&
    (
      new Date(date).toLocaleDateString("en-us", { weekday: "long" }) +
      ", " +
      dateSuffix(
        new Date(date).toLocaleDateString("en-us", { day: "numeric" })
      ) +
      " day of " +
      new Date(date).toLocaleDateString("en-us", { month: "long" }) +
      ", " +
      new Date(date).toLocaleDateString("en-us", { year: "numeric" })
    ).toUpperCase();

  const formattedDate2 =
    date &&
    (
      dateSuffix(
        new Date(date).toLocaleDateString("en-us", { day: "numeric" })
      ) +
      " " +
      new Date(date).toLocaleDateString("en-us", { month: "long" }) +
      ", " +
      new Date(date).toLocaleDateString("en-us", { year: "numeric" })
    ).toUpperCase();

  const curDate = new Date();
  const dateStr = (
    curDate.toLocaleDateString("en-us", { weekday: "long" }) +
    ", " +
    dateSuffix(curDate.toLocaleDateString("en-us", { day: "numeric" })) +
    " day of " +
    curDate.toLocaleDateString("en-us", { month: "long" }) +
    ", " +
    curDate.toLocaleDateString("en-us", { year: "numeric" })
  ).toUpperCase();

  const dateStr2 = (
    dateSuffix(curDate.toLocaleDateString("en-us", { day: "numeric" })) +
    " " +
    curDate.toLocaleDateString("en-us", { month: "long" }) +
    ", " +
    curDate.toLocaleDateString("en-us", { year: "numeric" })
  ).toUpperCase();

  const handleFetchData = () => {
    getQualified(date);
    getDisqualified(date);
  };

  // const handleMoreData = async (e, index) => {
  //     e.preventDefault();
  //     console.log("date", moreFields[index].value);
  //     await endpoint.get(`/justice/qualified-list/${moreFields[index].value}`)
  //         .then(({ data }) => {
  //             setMoreData((prevResult) => ({
  //                 ...prevResult,
  //                 [index]: data.data
  //             }))
  //         }).catch((err) => {
  //             console.log(err)
  //         })

  //     await endpoint.get(`/justice/assigned-cases-list/${moreFields[index].value}`)
  //         .then(({ data }) => {
  //             console.log("more disqualify data", data.data)
  //             setMoreDisqualificationData((prevResult) => ({
  //                 ...prevResult,
  //                 [index]: data.data
  //             }))
  //         }).catch((err) => {
  //             console.log(err)
  //         })

  // }

  return (
    <>
      <div id="divToPrint">
        <div className="row">
          <div
            className="col-md-12 text-center"
            style={{ textDecoration: `underline` }}>
            {" "}
            <span>IN THE NATIONAL INDUSTRIAL COURT OF NIGERIA</span>
            <br />
            HOLDEN AT ABUJA <br />
            SITTING ARRANGEMENT FOR THE WEEK OF{" "}
            {date ? formattedDate2 : dateStr2.toUpperCase()}
          </div>
        </div>

        <div className="row mt-4">
          <div className="col">
            <div
              className="input-group mb-3"
              id="hideDate">
              <input
                type="date"
                className="form-control"
                aria-label="Recipient's username"
                aria-describedby="button-addon2"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setQualified([]);
                  setDisqualifications([]);
                }}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleFetchData}
                  id="button-addon2">
                  Search
                </button>
              </div>
            </div>
          </div>
          <div className="col"></div>
        </div>

        {isLoading && <Loader />}

        {!isLoading && (
          <>
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="table-reponsive">
                  <table
                    className="table mb-5"
                    style={{ width: `100%` }}>
                    <thead className="thead-light">
                      <tr>
                        <div
                          className="col-md-12 text-center text-bold mb-5 ml-5"
                          style={{
                            fontWeight: "bold",
                          }}>
                          {date
                            ? `${moment(date).format("dddd")} the ${moment(
                                date
                              ).format("Do")} day of ${moment(date).format(
                                "MMMM"
                              )}, ${moment(date).format("YYYY").toUpperCase()}`
                            : dateStr2.toUpperCase()}
                        </div>
                      </tr>
                    </thead>

                    <tbody>
                      {date !== "" && qualified.length > 0 ? (
                        <>
                          {qualified.map((justice, index) => (
                            <>
                              <tr key={index}>
                                <td
                                  style={{
                                    fontWeight: "bold",
                                    textDecoration: "underline",
                                  }}>
                                  {String.fromCharCode(65 + index)}
                                  {".  Regular ".toUpperCase() +
                                    justice.CaseType.case_type.toUpperCase() +
                                    " (" +
                                    justice.CaseTypeCategory.case_type_cat.toUpperCase() +
                                    ")"}
                                </td>
                              </tr>

                              {justice.JusticeAssignmentNew.map(
                                (just, jIndex) => (
                                  <tr key={jIndex}>
                                    <td>{just.Justice.name}</td>
                                    <td>{"JSC"}</td>
                                  </tr>
                                )
                              )}
                              <tr>
                                <td></td>
                                <td style={{ fontWeight: "bold" }}>
                                  REGISTRAR
                                </td>
                              </tr>
                            </>
                          ))}
                        </>
                      ) : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {(qualified.length > 0 || disqualifications.length > 0) && (
              <div className="col-md-12 hideBtn">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={() => window.print()}
                  id="button-addon2">
                  Print
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default JusticeDisqualifications;
