import React, {useEffect, useState} from 'react';
import './attribute-list.css'
import ElementSelection from "../inputs/element-selection";
import fetch_data from "../../utils/fetch-data";

function Study(
  props: {
    study_summaries: Array<any>,
    study_name: string,
    setStudyName: (x: string) => void,
  }
) {
  const [study, setStudy] = useState(
    {
      "user-attributes": [] as { key: string, value: string }[],
      "system-attributes": [] as { key: string, value: string }[],
    }
  );
  useEffect(() => {
    let study_names = props.study_summaries.map((x) => x["name"]);
    if (!study_names.includes(props.study_name)) {
      return
    }
    fetch_data(
      "/api/study",
      [
        ["study-name", props.study_name],
      ],
      setStudy,
    );
  }, [props.study_name]);
  let study_names = props.study_summaries.map((x) => x["name"]);
  return (
    <div>
      <ElementSelection candidates={study_names} display_name="Study Name" setter={props.setStudyName}
                        default_value={props.study_name}/>

      <h2>Study name</h2>
      <p>{props.study_name}</p>

      <h2>Attributes</h2>
      <table className="attribute-list">
        <thead>
        <tr>
          <th>key</th>
          <th>value</th>
        </tr>
        </thead>
        <tbody>
        {
          study["user-attributes"].map(
            (x: { key: string, value: string }) => <tr>
              <td>{x["key"]}</td>
              <td>{x["value"]}</td>
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  );
}

export default Study;