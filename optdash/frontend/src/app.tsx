import React, { useState, useEffect } from 'react';
import Header from './navs/header';
import Sidebar from './navs/sidebar';
import Content from './contents/content';
import fetch_data from './utils/fetch-data';
import './app.css';

function App() {
  const [study_name, setStudyName] = useState("");
  const [content_type, setContentType] = useState("study-list");

  const [study_summaries, setStudySummaries] = useState([]);

  useEffect(() => { fetch_data("/api/study-summaries", "", setStudySummaries, "study-summaries") }, []);

  return (
    <div className="App">
      <Header />
      <Sidebar onclick_hook={(v: string) => { setContentType(v); }} />
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
        <Content content_type={content_type} study_summaries={study_summaries} />
      </div>
    </div>
  );
}

export default App;