import React from "react";
import classes from "./EditableRow.module.css";
import {FaSave} from "react-icons/fa"
const EditableRow = ({ data, handleSaveClick, handleFieldChange,editTa }) => {
  
 
  
  return (
    <tr>
      <td>{data.name}</td>
      <td>{data.sapId}</td>
      <td>{data.projectHours}</td>
      <td>{data.holiday}</td>
      <td>
        <span>
          <input
            className={classes.input}
            // style="font-size: 10pt;"
            //  type="email"
            required="required"
            //  placeholder="Enter an email..."
            name="afternoonShift"
            id={"afternoonShift"}
            type="number"
            value={data.afternoonShift}
            onChange={handleFieldChange}
            
          ></input>
        </span>
      </td>
      <td>
        <input
          id={"nightShift"}
          name={"nightShift"}
          type="number"
          value={data.nightShift}
          onChange={handleFieldChange}
      
        ></input>
      </td>
      <td>
        {" "}
        <input
          id={"daysTa"}
          name={"daysTa"}
          type="number"
          value={data.daysTa}
          onChange={handleFieldChange}
        
        ></input>
      </td>

      <td>{data.transportAllowance}</td>
      <td>{data.totalAllowance}</td>
      <td>
        <div
          // className="btn btn-info btn-sm"
          // type="submit"
          onClick={handleSaveClick}
        >
          <FaSave style={{color:"blue"}}></FaSave>
        </div>
      </td>
    </tr>
  );
};

export default EditableRow;
