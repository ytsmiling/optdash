import React, {useEffect, useState} from 'react';
import './attribute-list.css'
import ElementSelection from "../inputs/element-selection";
import fetch_data from "../../utils/fetch-data";

function Trial(
  props: {
    study_summaries: Array<any>,
    study_name: string,
    setStudyName: (x: string) => void,
  }
) {
  const [trial, setTrial] = useState({
    "user-attributes": [] as { key: string, value: string }[],
    "system-attributes": [] as { key: string, value: string }[],
    "parameters": [] as { key: string, value: any }[],
    "value": NaN,
    "number": NaN,
    "datetime-start": "",
  });
  const [trial_number, setTrialNumber] = useState("-1");
  let n_trials = -1;
  let study_names = props.study_summaries.map((x) => x["name"]);
  if (study_names.includes(props.study_name)) {
    for (let study of props.study_summaries) {
      if (props.study_name === study["name"]) {
        n_trials = study["num-trials"] as number;
      }
    }
  }

  useEffect(() => {
    let study_names = props.study_summaries.map((x) => x["name"]);
    if (!study_names.includes(props.study_name)) {
      return
    }
    if ((parseInt(trial_number)) < 0) {
      return
    }
    if (parseInt(trial_number) >= n_trials) {
      return
    }
    fetch_data(
      "/api/trial",
      [
        ["study-name", props.study_name],
        ["trial-number", trial_number as string],
      ],
      setTrial,
    );
  }, [props.study_summaries, props.study_name, trial_number]);

  return (
    <div>
      <ElementSelection candidates={study_names} display_name="Study Name" setter={props.setStudyName}
                        default_value={props.study_name}/>
      {
        study_names.includes(props.study_name) ?
          <ElementSelection
            candidates={Array.from({length: n_trials}, (v: any, k: number) => (k.toString()))}
            display_name="Trial Number"
            setter={setTrialNumber} default_value=""
          /> : <div/>
      }

      <h3>Value</h3>
      {trial["value"]}

      <h3>Start time</h3>
      {trial["datetime-start"] as unknown as string}

      <h3>Attributes</h3>
      <table className="attribute-list">
        <thead>
        <tr>
          <th>key</th>
          <th>value</th>
        </tr>
        </thead>
        <tbody>
        {
          trial["user-attributes"].map(
            (x: { key: string, value: string }) => <tr>
              <td>{x["key"]}</td>
              <td>{x["value"]}</td>
            </tr>
          )
        }
        </tbody>
      </table>

      <h3>Parameters</h3>
      <table className="attribute-list">
        <thead>
        <tr>
          <th>key</th>
          <th>value</th>
        </tr>
        </thead>
        <tbody>
        {
          trial["parameters"].map(
            (x: { key: string, value: any }) => <tr>
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

export default Trial;
