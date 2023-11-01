import React from "react";
import "./styles.css";
import { useEffect, useState, useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Context } from "../../../auth/Context";
import endpoint from "../../../auth/endpoint";
import { useParams } from "react-router-dom";
import interactionPlugin from "@fullcalendar/interaction";
import { SuccessAlert, ErrorAlert } from "../../../toasst/toast";
import {
	CForm,
	CCol,
	CFormLabel,
	CFormFeedback,
	CFormInput,
	CInputGroup,
	CInputGroupText,
	CButton,
	CFormCheck,
} from "@coreui/react";
import { useForm } from "react-hook-form";
import { Modal } from "react-bootstrap";
import {
	Col,
	Row,
	Card,
	Form,
	FormGroup,
	FormControl,
	ListGroup,
	Button,
	Breadcrumb,
} from "react-bootstrap";
import events from "./events";
import bootstrapPlugin from "@fullcalendar/bootstrap";

//parent function
export default function Calender() {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();
	const params = useParams();

	//get authenticated user
	const { user, dispatch } = useContext(Context);
	const currentUser = user?.user;
	console.log("user id", currentUser.id);
	const userID = currentUser.id;

	//disclear all variables
	const [showModal, setShowModal] = useState(false);
	const [showCaseModal, setCaseShowModal] = useState(false);
	const [selectedDate, setSelectedDate] = useState("");
	const [setEventDate, setSelectedEventDate] = useState(null);
	const [title, setTitle] = useState("");
	const [cases, setCaseList] = useState([]);
	const [CasesAdded, setCasesAdded] = useState([]);
	const [Dairies, setCasediary] = useState([]);
	const [DateDairies, setDatediary] = useState([]);
	const [isLoading, setLoading] = useState(false);
	const [selected, setSelected] = useState();
	const [caseTypes, setCaseTypes] = useState([]);
	let [dat, filteredEvents] = useState([]);
	const [diaryCount, setCasediaryCount] = useState([]);
	const [datediaryCount, setDatediaryCount] = useState([]);
	const [courtRoom, setcourtRoom] = useState([]);

	let formattedStartDate = "";

	

	useEffect(() => {
		getCaseTypeList();
		getCasediary();
		getdiaryCount();
		getCasediaryCount();
		getCourtRoomList()
	}, [selectedDate]);

	//handle event click
	const handleEventClick = (eventInfo) => {
		formattedStartDate = eventInfo.event.extendedProps.data.date_held;

		// Filtering the Dairies array
		const events = Dairies.filter(
			(diary) => diary.date_held === formattedStartDate
		);
		filteredEvents(events);
	
  		setSelectedDate(new Date(formattedStartDate));
		getDateCasediary();
		setCaseShowModal(true);
	};

	//handle clicking of date
	const handleDateClick = ({ date, allDay, jsEvent, view }) => {
		console.log("selected date", date);
		const d = new Date(date);
		const day = d.getDate();
		const month = d.getMonth() + 1;
		const year = d.getFullYear();
		const dDate = `${year}-${month}-${day}`;
		setSelectedDate(date);
		setDetails({ ...details, date_held: dDate });
		setShowModal(true);
	};

	//set the variable for creating a diary
	const [details, setDetails] = useState({
		case_type_id: "",
		case_id: "",
		location: "",
		platform: "web",
		date_held: "",
		user_id: userID,
		description: "",
	});


//get case diary for a particular date
	const getDateCasediary = async () => {
		setLoading(true);
		await endpoint
			.get(`/case-diary/day-list/${formattedStartDate}`)
			.then((res) => {
				  console.log("todays case", res.data.data)
				setDatediary(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	//function to get diary count
	const getdiaryCount = async () => {
		setLoading(true);
		await endpoint
			.get(`/case-diary/list-type-count`)
			.then((res) => {
				console.log(
					"todays color",
					res.data.data.map((a) => a.casetypes.map((ctype) => ctype.color))
				);
				console.log(
					"todays case count 2",
					res.data.data.map((a) =>
						a.casetypes.map((ctype) =>
							ctype.categories.map((catCount) => catCount.count)
						)
					)
				);
			
				setDatediaryCount(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};


	//function to display form to add diary to calender
	function renderDayCell(dayInfo) {
		return (
			<div
				className="dateCellContent"
				style={{ position: "relative" }}>
				<div
					style={{
						display: "flex",
						flexDirection: "column-reverse",
						justifyContent: "space-between",
						alignItems: "flex-end",
					}}>
					<span>{dayInfo.dayNumberText}</span>
				</div>
				<button
					className="addbutton btn-xs"
					style={{ position: "absolute", right: 0, bottom: 25 }}
					onClick={handleDateClick}>
					Add Diary
				</button>
			</div>
		);
	}

	//function to display the event content
	const renderEventContent = (eventInfo) => {
		const eventData = eventInfo.event.extendedProps.data;

		if (!eventData) {
			return null;
		}

		const casetypes = eventData.casetypes;

		return (
			<>
				{casetypes.map((ctype) => (
					<div
						key={ctype.type}
						style={{ backgroundColor: ctype.color }}>
						<div style={{ display: "flex", justifyContent: "space-between" }}>
							<div>
								{ctype.categories.slice(0, 1).map((catCount) => (
									<div key={catCount.abr}>
										<span onClick={handleEventClick}>{catCount.abr}: </span>
										<span onClick={handleEventClick}>{catCount.count}</span>
									</div>
								))}
							</div>
							<div>
								{ctype.categories.slice(1).map((catCount) => (
									<div key={catCount.abr}>
										<span onClick={handleEventClick}>{catCount.abr}: </span>
										<span onClick={handleEventClick}>{catCount.count}</span>
									</div>
								))}
							</div>
						</div>
					</div>
				))}
			</>
		);
	};



	//get the case type
	const getCaseTypeList = async () => {
		const users = localStorage.getItem("user-token");
		console.log("useress", users);
		setLoading(true);
		await endpoint
			.get("/case-type/list")
			.then((res) => {
				// console.log("case list", res.data.data)
				setCaseTypes(res.data.data);
				setCaseList(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	//function to get all diary
	const getCasediary = async () => {
		setLoading(true);
		await endpoint
			.get("/case-diary/list")
			.then((res) => {
				// console.log("case diary data", res.data.data)
				setCasediary(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};
	const getCourtRoomList = async () => {
		setLoading(true);
		try {
			const res = await endpoint.get("/court-room/list");
			console.log("court room list", res.data.data);
			setcourtRoom(res.data.data);
		} catch (err) {
			console.log(err);
		}
		setLoading(false);
	};

	//function to get the count of all cases in a diary
	const getCasediaryCount = async () => {
		setLoading(true);
		await endpoint
			.get("/case-diary/list-type-count")
			.then((res) => {
				console.log("new case count", res.data.data);
				setCasediaryCount(res.data.data);
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
				console.log(err);
			});
	};

	//function to filter list of cases base on case type selected
	const handleChange = (event) => {
		console.log(event.target.value);
		setSelected(event.target.value);

		if (selected !== null) {
			const getCases = async () => {
				//   console.log("selected cases", event.target.value)
				await endpoint
					.get(`/case/list/${event.target.value}`)
					.then((res) => {
						console.log(res.data.data);
						setCasesAdded(res.data.data);
					})
					.catch((err) => console.log(err));
			};
			getCases();
		}
	};

	console.log("hhhhhhh", Dairies);
	

// modify the diary and set event start date to date held and also pass the data to RenderEvent Function
	const modifiedEvents = diaryCount.map((data) => {
		const eventTitle = data.casetypes
			.map((ctype) => {
				return ctype.categories
					.map((catCount) => `${catCount.abr}: ${catCount.count}`)
					.join(", ");
			})
			.join(" - ");

		return {
			title: eventTitle,
			start: data.date_held,
			// backgroundColor: data.casetypes[0].color,
			extendedProps: {
				data: data,
			},
		};
	});

	//create diary for a dtae
	const handleCreatediary = async (e) => {
		e.preventDefault();
		console.log("diary datarrrr", details);
		setLoading(true);

		try {
			await endpoint.post("/case-diary/create", details).then((res) => {
				window.location.reload();
				SuccessAlert(res.data.message);
			});
		} catch (error) {
			ErrorAlert(error.response.data.message);
			console.log(error);
		}
	};
	const varable =()=>{
console.log("details", details.description);


	}

	return (
		<>
			<FullCalendar
				initialView="dayGridMonth"
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				//  headerToolbar={{
				//   start:"",
				//   center:"",
				//   end:"dayGridMonth, timeGridWeek, timeGridDay",
				//  }}
				events={modifiedEvents}
				displayEventEnd={true}
				eventContent={renderEventContent}
				themeSystem="bootstrap"
				eventClick={handleEventClick}
				dateClick={handleDateClick}
				editable={true}
				// dayRender={renderDay}
				dayCellContent={renderDayCell}
			/>

			<Modal show={showModal}>
				<Modal.Header>
					<Button
						onClick={() => setShowModal(false)}
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
									Add a diary to{" "}
									{selectedDate
										? selectedDate.toLocaleString("en-US", {
												day: "numeric",
												month: "long",
												year: "numeric",
										  })
										: ""}{" "}
								</p>
								<form className="forms-sample" onSubmit={handleCreatediary}>
  <FormGroup>
    <label htmlFor="exampleInputname">Case Type</label>
    <select
      className="form-control"
      value={details.case_type_id}
      onChange={(event) => {
        handleChange(event);
        setDetails({
          ...details,
          case_type_id: event.target.value,
        });
      }}
    >
      <option value="">--select--</option>

      {cases.map((Case) => (
        <option key={Case.id} value={Case.id}>
          {Case.case_type}
        </option>
      ))}
    </select>
  </FormGroup>

  <Form.Group>
  <label htmlFor="exampleInputname">Case Name</label>
  <select
    type="text"
    className="form-control"
    value={details.case_id}
    onChange={(event) => {
      const selectedCaseId = event.target.value;
      const selectedCase = CasesAdded.find((Case) => Case.id == selectedCaseId);

      setDetails({
        ...details,
        case_id: selectedCaseId,
        description: selectedCase ? `${selectedCase.suite_no} (${selectedCase.parties})` : '',
      });
    }}
  >
    <option value="">--select--</option>

    {CasesAdded.map((Case) => (
      <option key={Case.id} value={Case.id}>
        {Case.suite_no} ({Case.parties})
      </option>
    ))}
  </select>
</Form.Group>

<Form.Group>
  <label htmlFor="exampleInputName1">Diary Description</label>
  <Form.Control
    type="text"
    value={details.description}
    onChange={(e) => setDetails({ ...details, description: e.target.value })}
    className="form-control"
    id="exampleInputName1"
    placeholder="diary Description"
  />
</Form.Group>

<Form.Group>
  <label htmlFor="exampleInputname">Court Room</label>
  <select
    type="text"
    className="form-control"

  >
    <option value="">--select--</option>

    {courtRoom.map((Court) => (
      <option key={Court.id} value={Court.id}>
        {Court.name} ({Court.parties})
      </option>
    ))}
  </select>
</Form.Group>


  <button type="submit" className="btn btn-gradient-primary mr-2">
    Submit
  </button>
</form>

							</div>
						</div>
					</div>
					<Button
						onClick={() => setShowModal(false)}
						className="btn btn-light btn-sm ml-5 mb-3"
						variant="">
						close
					</Button>
				</div>
			</Modal>

			<Modal show={showCaseModal}>
				<Modal.Header>
					<Button
						onClick={() => setCaseShowModal(false)}
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
									List of Diary for{" "}
									{selectedDate
										? selectedDate.toLocaleString("en-US", {
												day: "numeric",
												month: "long",
												year: "numeric",
										  })
										: ""}{" "}
								</p>
								<form className="forms-sample">
									<ul>
										{dat.map((diary) => (
											<a
												className="list-a card mb-2 text-white text-align-left"
												href={`/user-case/${diary.id}`}
												style={{
													backgroundColor: diary.CaseType.case_color,
													color: diary.CaseType.case_color,
												}}>
												{/* <li>{diary.CaseAttachements.Case.suite_no}</li> */}
												<li className="text-left text-white">
												
{diary.CaseAttachements.map((attachments) => (
  <React.Fragment key={attachments.Case.id}>
    <span className="text-center">
      {attachments.Case.suite_no}{" "}
      <span style={{ color: "white" }}>
        ({attachments.Case.parties})
      </span>
    </span><br />
  </React.Fragment>
))}
												</li>
											</a>
										))}
									</ul>
								</form>
							</div>
						</div>
					</div>
					<Button
						onClick={() => setShowModal(false)}
						className="btn btn-light btn-sm ml-5 mb-3"
						variant="">
						close
					</Button>
				</div>
			</Modal>
		</>
	);
}
