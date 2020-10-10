import React, { useState, useEffect } from 'react';
import Header from './navs/header';
import Sidebar from './navs/sidebar';
import fetch_data from './utils/fetch-data';
import './app.css';

function App() {
  const [study_name, setStudyName] = useState("");
  const [plot_type, setPlotType] = useState("none");

  const [study_summaries, setStudySummaries] = useState([]);

  useEffect(() => { fetch_data("/api/study-summaries", "", setStudySummaries, "study-summaries") }, []);

  return (
    <div className="App">
      <Header />
      <Sidebar onclick_hook={(v: string) => { setPlotType(v); }} />
      <div className="App-main">
        <div>
          <label htmlFor="study-name-choice">Study name: </label>
          <input list="study-name" id="study-name-choice" name="ice-cream-choice" />

          <datalist id="study-name">
            {study_summaries.map((x) => <option value={x["name"]} />)}
          </datalist>

          <button onClick={
            () => {
              let name_choices = document.getElementById("study-name-choice") as HTMLInputElement;
              if (name_choices !== null) {
                setStudyName(name_choices.value);
              }
            }
          }>Use
          </button>
        </div>
        <table className="studies">
          <thead>
            <tr>
              <th>name</th>
              <th>#trials</th>
              <th>best</th>
              <th>direction</th>
            </tr>
          </thead>
          <tbody>
            {
              study_summaries.map(
                (x) => <tr>
                  <th>{x["name"]}</th>
                  <th>{x["num-trials"]}</th>
                  <th>{x["best-value"]}</th>
                  <th>{x["direction"]}</th>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;