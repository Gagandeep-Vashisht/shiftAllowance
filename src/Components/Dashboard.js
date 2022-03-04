import classes from "./Dashboard.module.css";
import { useState, useEffect, Fragment } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai";

import EditableRow from "./EditableRow";
import ReadOnlyRow from "./ReadOnlyRow";
import { fetchToken } from "../util/storage";
const DashBoard = () => {
  // const userContext = useContext(UserContext);
  const [selectedDate, setDate] = useState(new Date());
  const [order, setOrder] = useState("ASC");
  const [sortKey, setSortKey] = useState("sapId");
  const [rowId, setRowId] = useState(-1);
  var [projects, setProject] = useState([]);
  var [startDate, setStartDate] = useState(new Date());
  var [endDate, setEndDate] = useState(new Date());
  var [dateSelected, setDateSelected] = useState(false);
  var [projectSelected, setProjectSelected] = useState(null);
  var [perDayAllowance, setPerDayAllowance] = useState(150);
  const [curPage, setCurPage] = useState(0);
  const [leftDisabled, setLeftDisabled] = useState(true);
  const [rightDisabled, setRightDisabled] = useState(true);
  const [totalPage, setTotalPage] = useState(0);

  // var startDate=new Date(),endDate=new Date();
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    sapId: "",
    projectHours: "",
    holiday: "",
    afternoonShift: "",
    nightShift: "",
    daysTa: "",
    transportAllowance: "",
    totalAllowance: "",
  });
  const [editTa, setEditTa] = useState(false);

  var data = [];
  const headers = [
    { label: "Name", key: "name" },
    { label: "SAP Id", key: "sapId" },
    { label: "project Hours", key: "projectHours" },
    { label: "Holiday", key: "holiday" },
    { label: "Af Shift", key: "afternoonShift" },
    { label: "night sht", key: "nightShift" },
    { label: "days ta", key: "daysTa" },
    { label: "transport allowance", key: "transportAllowance" },
    { label: "totalAllowance", key: "totalAllowance" },
  ];

  const [sortData, setSortData] = useState(data);

  useEffect(() => {
    setSortData(data);
    getAllProject();
  }, []);

  const getAllProject = async () => {
    const token = fetchToken();
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // "Acess-Control-Allow-Origin":"*",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await fetch(
      `${process.env.REACT_APP_ENDPOINT}/allowance/distinct`,
      requestOptions
    );
    const jsonData = await res.json();
    // console.log(jsonData);
    // projects=jsonData;
    setProject([]);
    projects = [];
    // console.log(jsonData);
    for (var i = 0; i < jsonData.length; i++) {
      // console.log(jsonData[i]);
      projects.push(jsonData[i]);
    }
    // console.log(projects);
    setProject(projects);
  };

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
  const sorting = (col, type) => {
    setSortKey(col);
    if (type === "string") {
      if (order === "ASC") {
        const sorted = [...sortData].sort((a, b) =>
          a[col].toLowerCase() < b[col].toLowerCase() ? 1 : -1
        );

        setSortData(sorted);
        data = sorted;

        setOrder("DSC");
      }
      if (order === "DSC") {
        const sorted = [...sortData].sort((a, b) =>
          a[col].toLowerCase() > b[col].toLowerCase() ? 1 : -1
        );

        setSortData(sorted);
        data = sorted;

        setOrder("ASC");
      }
    }
    if (type === "number") {
      if (order === "ASC") {
        const sorted = [...sortData].sort((a, b) =>
          parseInt(a[col]) < parseInt(b[col]) ? 1 : -1
        );

        setSortData(sorted);
        data = sorted;

        setOrder("DSC");
      }
      if (order === "DSC") {
        const sorted = [...sortData].sort((a, b) =>
          parseInt(a[col]) > parseInt(b[col]) ? 1 : -1
        );

        setSortData(sorted);
        data = sorted;

        setOrder("ASC");
      }
    }
    console.log("sorting", sortKey, order);
  };
  const csvReport = {
    data: sortData,
    headers: headers,
    filename: `Allowance_Report_${formatDate(new Date())}.csv`,
  };
  const handleEditClick = (event, data) => {
    console.log("inside handle edit click");
    event.preventDefault();

    setRowId(data.id);
    const tempData = {
      id: data.id,
      name: data.name,
      sapId: data.sapId,
      projectHours: data.projectHours,
      holiday: data.holiday,
      afternoonShift: data.afternoonShift,
      nightShift: data.nightShift,
      daysTa: data.daysTa,
      transportAllowance: data.transportAllowance,
      totalAllowance: data.totalAllowance,
    };
    setEditTa(false);
    setEditData(tempData);
  };

  const handleSaveClick = (event) => {
    console.log("inside handle save click");
    console.log(editData);
    event.preventDefault();
    editData.nightShift =
      editData.nightShift.length === 0 ? 0 : editData.nightShift;
    editData.afternoonShift =
      editData.afternoonShift === "" ? 0 : editData.afternoonShift;
    editData.daysTa = editData.daysTa === "" ? 0 : editData.daysTa;

    editData.transportAllowance = parseInt(editData.daysTa) * perDayAllowance;
    editData.totalAllowance =
      parseInt(editData.transportAllowance) +
      parseInt(editData.nightShift) * 2 * perDayAllowance;
    const editedData = {
      id: rowId,
      name: editData.name,
      sapId: editData.sapId,
      projectHours: editData.projectHours,
      holiday: editData.holiday,
      afternoonShift: editData.afternoonShift,
      nightShift: editData.nightShift,
      daysTa: editData.daysTa,
      transportAllowance: editData.transportAllowance,
      totalAllowance: editData.totalAllowance,
    };
    // console.log(editData.nightShift);
    const tempData = [...sortData];
    const index = sortData.findIndex((e) => e.id === rowId);
    tempData[index] = editedData;
    setEditTa(false);
    setRowId(null);
    setSortData(tempData);
  };

  const handleFieldChange = (event) => {
    console.log("inside handle form change click");

    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...editData };

    if (fieldName === "daysTa") {
      setEditTa(true);
      if (fieldValue >= 0) newFormData[fieldName] = fieldValue;
    }
    if (fieldName === "afternoonShift" || fieldName === "nightShift") {
      if (fieldValue >= 0) newFormData[fieldName] = fieldValue;
      if (!editTa) {
        newFormData["daysTa"] =
          parseInt(newFormData["afternoonShift"]) +
          parseInt(newFormData["nightShift"]);
      }
    }
    newFormData["transportAllowance"] =
      parseInt(newFormData["daysTa"]) * perDayAllowance;
    newFormData["totalAllowance"] =
      parseInt(newFormData["transportAllowance"]) +
      parseInt(newFormData["nightShift"] * 2 * perDayAllowance);
    console.log(fieldValue, fieldName);

    setEditData(newFormData);
  };
  function startAndEndOfWeek(date) {
    var now = new Date(date);

    // set time to some convenient value
    now.setHours(0, 0, 0, 0);

    // Get the previous Monday
    var monday = new Date(now);
    console.log(monday);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    // Get next Sunday
    var sunday = new Date(now);
    // console.log(sunday.getDay());
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
    return [monday, sunday];
  }

  const fetchDetail = async () => {
    console.log("inside fetch project");
    const token = fetchToken();
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Acess-Control-Allow-Origin": "*",
        Authorization: `Bearer ${token}`,
      },
    };

    const res = await fetch(
      `${
        process.env.REACT_APP_ENDPOINT
      }/allowance/getprojects/${projectSelected}/${formatDate(
        startDate
      )}/${formatDate(endDate)}/${curPage}/10/name/asc`,
      requestOptions
    );
    const jsonData = await res.json();
    console.log(jsonData);

    setSortData([]);
    setLeftDisabled(jsonData.first);
    setRightDisabled(jsonData.right);
    setTotalPage(jsonData.totalPages - 1);
    data = jsonData.content.map((data, i) => ({
      id: data.id,
      name: data.name,
      sapId: data.sapid,
      projectHours: data.projectHours,
      holiday: data.leaveHours,
      afternoonShift: data.afternoonShiftDays,
      nightShift: data.nightShiftDays,
      daysTa: data.tadays,
      transportAllowance: data.ta,
      totalAllowance: data.totalAllowance,
      startDate: data.startDate,
      endDate: data.endDate,
      projectName: data.projectName,
    }));
    setSortData(data);
  };
  const Approve = async () => {
    console.log("inside approve method");

    const body = sortData.map((e, i) => ({
      afternoonShiftDays: e.afternoonShift,
      endDate: formatDate(endDate),
      id: e.id,
      leaveHours: e.holiday,
      name: e.name,
      nightShiftDays: e.nightShift,
      projectHours: e.projectHours,
      projectName: projectSelected,
      sapid: e.sapId,
      startDate: formatDate(startDate),
      status: "Approve",
      ta: e.transportAllowance,
      tadays: e.daysTa,
      totalAllowance: e.totalAllowance,
    }));

    const token = fetchToken();
    const requestOptions = {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        // "Acess-Control-Allow-Origin":"*",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    };
    console.log(body);
    console.log("before put call");
    const res = await fetch(
      `${process.env.REACT_APP_ENDPOINT}/allowance/updateAll`,
      requestOptions
    );
    console.log("after put call");
    console.log("printing res", res);
  };
  const onApplyToAll = () => {
    var updatedData = [];
    console.log(sortData);
    updatedData = sortData.map((e, i) => ({
      id: e.id,
      name: e.name,
      sapId: e.sapId,
      projectHours: e.projectHours,
      holiday: e.holiday,
      afternoonShift: e.afternoonShift,
      nightShift: e.nightShift,
      daysTa: e.daysTa,
      transportAllowance: parseInt(e.daysTa) * perDayAllowance,
      totalAllowance:
        parseInt(e.daysTa) * perDayAllowance +
        parseInt(e.nightShift) * 2 * perDayAllowance,
    }));
    setSortData(updatedData);
  };
  return (
    <div>
      <div className={classes.txt}>Allowance DashBoard</div>
      <div className="container ">
        <div className={classes.row}>
          <span>
            <label className={classes.lbl}>Project</label>
            <div>
              <select
                defaultValue={"none"}
                className={classes.inputText}
                value={projectSelected}
                onChange={(value) => {
                  setProjectSelected(value.target.value);
                  console.log(value.target.value);
                }}
              >
                <option value="none" selected disabled hidden>
                  Select an Option
                </option>
                {projects.map((e, i) => (
                  <option>{e}</option>
                ))}
              </select>
            </div>
          </span>
          <div className={classes.row}>
            <span className="container mx-5">
              <label className={classes.lbl}>Start Date</label>
              <DatePicker
                selected={selectedDate}
                dateFormat="yyyy-MM-dd"
                className={classes.inputText}
                maxDate={new Date()}
                onChange={(date) => {
                  setDate(date);
                  var [s, e] = startAndEndOfWeek(date);
                  setStartDate(s);
                  setEndDate(e);
                  setDateSelected(true);
                  console.log(startDate, endDate);
                }}
              />
            </span>
            <span>
              <label className={classes.lbl}>Period (MONDAY-SUNDAY)</label>
              <div>
                <input
                  className={classes.inputText}
                  disabled
                  value={formatDate(startDate) + " TO " + formatDate(endDate)}
                ></input>
              </div>
            </span>
            <div className="text-center mx-5">
              <label></label>
              <div>
                <button
                  className=" btn btn-primary"
                  onClick={() => {
                    setCurPage(0);
                    fetchDetail();
                  }}
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
          <span className={classes.row}>
            <div>
              <label>Per Day Allowance</label>
              <div>
                <input
                  className={classes.inputText}
                  type="number"
                  value={perDayAllowance}
                  onChange={(e) => setPerDayAllowance(e.target.value)}
                />
              </div>
              <div></div>
            </div>
          </span>
          <div className="mx-3">
            <label></label>
            <div>
              <button className="btn btn-primary" onClick={onApplyToAll}>
                Apply to all
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={classes.mar}>
        <form>
          <table className="table  table-hover table-striped">
            <thead className="table-info">
              <tr>
                <th
                  onClick={() => {
                    sorting("name", "string");
                  }}
                >
                  <span type="button" className={classes.tabletxt}>
                    Name
                    {"name" === sortKey ? (
                      "ASC" === order ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown></AiFillCaretDown>
                      )
                    ) : (
                      <AiFillCaretUp />
                    )}
                  </span>
                </th>
                <th
                  onClick={() => {
                    sorting("sapId", "number");
                  }}
                >
                  <span type="button" className={classes.tabletxt}>
                    {" "}
                    SAP Id{" "}
                    {"sapId" === sortKey ? (
                      "ASC" === order ? (
                        <AiFillCaretUp />
                      ) : (
                        <AiFillCaretDown></AiFillCaretDown>
                      )
                    ) : (
                      <AiFillCaretUp />
                    )}
                  </span>
                </th>
                <th>
                  {" "}
                  <span className={classes.tabletxt}>Project Hours</span>{" "}
                </th>
                <th>
                  <span className={classes.tabletxt}>
                    Holiday/ Leaves Hours
                  </span>{" "}
                </th>
                <th>
                  <span className={classes.tabletxt}>Afternoon Shift</span>{" "}
                </th>
                <th>
                  <span className={classes.tabletxt}>Night Shift</span>{" "}
                </th>
                <th>
                  <span className={classes.tabletxt}>Days eligible for Ta</span>{" "}
                </th>
                <th>
                  <span className={classes.tabletxt}>
                    {" "}
                    Transport Allowance{" "}
                  </span>
                </th>
                <th>
                  <span className={classes.tabletxt}>Total Allowance </span>{" "}
                </th>
                <th></th>
              </tr>
            </thead>
            {sortData.map((element, key) => (
              <Fragment>
                {rowId === element.id ? (
                  <tbody>
                    <EditableRow
                      data={editData}
                      handleSaveClick={handleSaveClick}
                      handleFieldChange={handleFieldChange}
                      editTa={editTa}
                    ></EditableRow>
                  </tbody>
                ) : (
                  <tbody>
                    <ReadOnlyRow
                      data={element}
                      handleEditClick={handleEditClick}
                      editTa={editTa}
                    ></ReadOnlyRow>
                  </tbody>
                )}
              </Fragment>
            ))}
          </table>
        </form>
        <div className={`${classes.paginationbtn}`}>
          <button
            className="btn btn-info btn-sm"
            style={{ borderRadius: 8 }}
            disabled={curPage == 0 || leftDisabled}
            onClick={() => {
              setCurPage(curPage - 1);
              fetchDetail();
            }}
          >
            {"<"}
          </button>
          <input
            className="mx-2 input"
            value={curPage}
            disabled
            style={{ width: 25, borderRadius: 8, textAlign: "center" }}
          />
          <button
            className="btn btn-info btn-sm"
            disabled={curPage == totalPage || rightDisabled}
            style={{ borderRadius: 8 }}
            onClick={() => {
              setCurPage(curPage + 1);
              fetchDetail();
            }}
          >
            {">"}
          </button>
        </div>
        <CSVLink {...csvReport}>
          <button className={classes.addButton} onClick={Approve}>
            Approve and Download
          </button>
        </CSVLink>
      </div>
    </div>
  );
};

export default DashBoard;
