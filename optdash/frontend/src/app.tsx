import React, { useState, useEffect } from 'react';
import Header from './navs/header';
import Sidebar from './navs/sidebar';
import fetch_data from './utils/fetch-data';
import './app.css';

function App() {
  const [study_name, setStudyName] = useState("");
  const [plot_type, setPlotType] = useState("none");

  const [study_names, setStudyNames] = useState([]);

  useEffect(() => { fetch_data("/api/study-names", "", setStudyNames, "study-names") }, []);

  return (
    <div className="App">
      <Header />
      <Sidebar onclick_hook={(v: string) => { setPlotType(v); }} />
      <div className="App-main">
        <div>
          <label htmlFor="study-name-choice">Study name: </label>
          <input list="study-name" id="study-name-choice" name="ice-cream-choice" />

          <datalist id="study-name">
            {study_names.map((x) => <option value={x} />)}
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
      </div>
    </div>
  );
}

export default App;