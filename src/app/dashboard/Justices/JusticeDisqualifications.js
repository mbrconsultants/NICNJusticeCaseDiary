import React, { useEffect, useState } from "react";
import endpoint from "../../../auth/endpoint";
import Loader from "react-loader-advanced";

const JusticeDisqualifications = () => {
  const [isLoading, setLoading] = useState(false);
  const [qualified, setQualified] = useState([]);
  const [disqualifications, setDisqualifications] = useState([]);
  const [moreData, setMoreData] = useState([]);
  const [moreDisqualificationData, setMoreDisqualificationData] = useState([]);

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
    // console.log("a", Object.keys(moreFields).filter((x) => x[index] == index))
    // console.log("ca", moreFields.filter((x) => x.value !== moreFields[index].value))
    // console.log("b", moreFields[index].value)
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
    await endpoint
      .get(`/justice/qualified-list/${date}`)
      .then(({ data }) => {
        setLoading(false);
        setQualified(data.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const getDisqualified = async (date) => {
    setLoading(true);
    await endpoint
      .get(`/justice/assigned-cases-list/${date}`)
      .then(({ data }) => {
        setLoading(false);
        setDisqualifications(data.data);
        console.log("disqualify", data.data);
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

  const handleMoreData = async (e, index) => {
    e.preventDefault();
    console.log("date", moreFields[index].value);
    await endpoint
      .get(`/justice/qualified-list/${moreFields[index].value}`)
      .then(({ data }) => {
        setMoreData((prevResult) => ({
          ...prevResult,
          [index]: data.data,
        }));
      })
      .catch((err) => {
        console.log(err);
      });

    await endpoint
      .get(`/justice/assigned-cases-list/${moreFields[index].value}`)
      .then(({ data }) => {
        console.log("more disqualify data", data.data);
        setMoreDisqualificationData((prevResult) => ({
          ...prevResult,
          [index]: data.data,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div id="divToPrint">
        <div className="row">
          <div
            className="col-md-12 text-center"
            style={{ textDecoration: `underline` }}>
            {" "}
            <span>IN THE SUPREME COURT OF NIGERIA</span>
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
                      <tr style={{ border: `1px solid black` }}></tr>
                    </thead>

                    <tbody>
                      {date !== ""
                        ? qualified.length > 0
                          ? qualified.map((justice, index) => (
                              <tr key={index}>
                                <td style={{ width: `5px` }}>{index + 1}.</td>
                                <td>
                                  {justice.title
                                    ? justice.title
                                    : "HON. JUSTICE"}{" "}
                                  {justice.Justice.name.toUpperCase()}
                                </td>
                                {/* <td>JSC</td> */}
                              </tr>
                            ))
                          : ""
                        : "Choose date and search for records"}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {disqualifications &&
              disqualifications.map((disqualification) => (
                <div
                  className="row mt-4"
                  key={disqualification.item.id}>
                  <div className="col-md-12 disqualificationHeading">
                    {disqualification.item.suite_no}, (
                    {disqualification.item.parties})
                  </div>
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table
                        className="table mb-5"
                        style={{ width: `100%` }}>
                        <thead className="thead-light">
                          <tr style={{ border: `1px solid black` }}>
                            {/* Add table headers here if needed */}
                          </tr>
                        </thead>
                        <tbody>
                          {disqualification.justiceAssignments.length > 0 ? (
                            disqualification.justiceAssignments.map(
                              (justice, index) => (
                                <tr key={index}>
                                  <td style={{ width: `5px` }}>{index + 1}.</td>
                                  <td>
                                    {justice.QualifiedJustice
                                      ? `${
                                          justice.QualifiedJustice.title ||
                                          "HON. JUSTICE"
                                        } ${justice.QualifiedJustice.name.toUpperCase()}`
                                      : `${
                                          justice.Justice.title ||
                                          "HON. JUSTICE"
                                        } ${justice.Justice.name.toUpperCase()}`}
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td colSpan="2">No Qualified Justices</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}

            {(qualified.length > 0 || disqualifications.length > 0) && (
              <>
                <div className="row">
                  <div className="col-md-3 hideBtn mb-2">
                    <button
                      className="btn btn-primary btn-sm mdi mdi-plus"
                      onClick={handleAddFields}
                      type="button"
                      id="button-addon2">
                      {" "}
                      Add
                    </button>
                  </div>
                </div>
                <div className="row">
                  {moreFields.map((inputField, index) => (
                    <>
                      <div className="col-md-6 hideBtn">
                        <div key={index}>
                          <div
                            className="input-group mb-3"
                            id="hideDate">
                            <input
                              type="date"
                              className="form-control"
                              aria-label="Recipient's username"
                              aria-describedby="button-addon2"
                              value={moreFields.value}
                              onChange={(event) =>
                                handleInputChange(index, event)
                              }
                            />
                            <div className="input-group-append">
                              <button
                                className="btn btn-outline-primary"
                                type="button"
                                onClick={(e) => {
                                  handleMoreData(e, index);
                                }}
                                id="button-addon2">
                                Search
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 hideBtn">
                        <button
                          className="btn btn-danger btn-sm mdi mdi-cancel"
                          onClick={(e) => {
                            handleRmv(e, index);
                          }}
                          type="button"
                          id="button-addon2">
                          {" "}
                        </button>
                      </div>
                      {console.log("more data", moreData[index])}
                      {moreData[index] && (
                        <>
                          <div className="mt-4">
                            <div className="col-md-12 text-center">
                              {moreData[index][0].sitting_date.toUpperCase()}
                            </div>
                            <div className="col-md-12">
                              <div className="table-reponsive">
                                <table
                                  className="table mb-5"
                                  style={{ width: `100%` }}>
                                  <thead className="thead-light">
                                    <tr
                                      style={{
                                        border: `1px solid black`,
                                      }}></tr>
                                  </thead>

                                  <tbody>
                                    {moreData[index].length > 0
                                      ? moreData[index].map(
                                          (justice, index) => (
                                            <tr key={index}>
                                              <td style={{ width: `5px` }}>
                                                {index + 1}.
                                              </td>
                                              <td>
                                                {justice.title
                                                  ? justice.title
                                                  : "HON. JUSTICE"}{" "}
                                                {justice.Justice.name.toUpperCase()}
                                              </td>
                                              {/* <td>JSC</td> */}
                                            </tr>
                                          )
                                        )
                                      : "No Justices Assigned"}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {moreDisqualificationData[index] && (
                        <>
                          <div className="row mt-4">
                            <div className="col-md-12 disqualificationHeading">
                              {moreDisqualificationData[index].item
                                ? `${moreDisqualificationData[index].item.suite_no}, (${moreDisqualificationData[index].item.parties})`
                                : ""}
                            </div>
                            <div className="col-md-12">
                              <div className="table-reponsive">
                                <table
                                  className="table mb-5"
                                  style={{ width: `100%` }}>
                                  <thead className="thead-light">
                                    <tr
                                      style={{
                                        border: `1px solid black`,
                                      }}></tr>
                                  </thead>

                                  <tbody>
                                    {moreDisqualificationData[index]
                                      .justiceAssignments &&
                                    moreDisqualificationData[index]
                                      .justiceAssignments.length > 0
                                      ? moreDisqualificationData[
                                          index
                                        ].justiceAssignments.map(
                                          (justice, index) => (
                                            <tr key={index}>
                                              <td style={{ width: `5px` }}>
                                                {index + 1}.
                                              </td>
                                              <td>
                                                {justice.Justice.title
                                                  ? justice.Justice.title
                                                  : "HON. JUSTICE"}{" "}
                                                {justice.Justice.name.toUpperCase()}
                                              </td>
                                            </tr>
                                          )
                                        )
                                      : ""}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ))}
                </div>
              </>
            )}

            {(qualified.length > 0 || disqualifications.length > 0) && (
              <div
                className="col-md-12 text-center"
                style={{ marginTop: `50px` }}>
                HON. JUSTICE OLUKAYODE ARIWOOLA, GCON <br />
                CHIEF JUSTICE OF NIGERIA
              </div>
            )}

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
