import React from "react";

import { BsFillPencilFill } from 'react-icons/bs';

const ReadOnlyRow = (props) => {
 
  return (
    <tr>
      <td>{props.data.name}</td>
      <td>{props.data.sapId}</td>
      <td>{props.data.projectHours}</td>
      <td>{props.data.holiday}</td>
      <td>{props.data.afternoonShift}</td>
      <td>{props.data.nightShift}</td>
      <td>{props.data.daysTa}</td>
      <td>{props.data.transportAllowance}</td>
      <td>{props.data.totalAllowance}</td>

      <td>
        <div
          // type="button"
          // className="btn btn-info btn-sm"
          className="pencil"
          onClick={(event) => props.handleEditClick(event, props.data)}
        >
         <BsFillPencilFill style={{color:"blue"}}></BsFillPencilFill> 
        </div>
      </td>
    </tr>
  );
};

export default ReadOnlyRow;
