import React, { useState, useEffect } from 'react';
import StudyList from './tables/study-list';
import Contour from './plots/contour';
import EdfPlot from './plots/edf';
import InterMediatePlot from './plots/intermediate-values';
import HistoryPlot from './plots/history';
import ParallelCoordinatePlot from './plots/parallel-coordinate';
import ParameterImportancePlot from './plots/parameter-importance';
import fetch_data from "../utils/fetch-data";
import "./content.css"
import Study from "./tables/study";
import Trial from "./tables/trial";

function Content(
    props: {
        content_type: string,
        study_summaries: Array<any>,
    },
) {
    const [study_name, setStudyName] = useState("");
    const [parameters, setParameters] = useState(
        {
            "parameter-names": [], "distributions": {}
        } as any
    );
    const height: number = Math.min(window.innerWidth * 0.8 * 0.7, window.innerHeight * 0.7);
    const width: number = height / 0.8;

    useEffect(() => {
        if (study_name === "") { return }
        fetch_data(
            "/api/parameters",
            [["study-name", study_name]],
            setParameters,
        );
    }, [study_name]);

    if (props.content_type === "study-list") {
        return <StudyList study_summaries={props.study_summaries} />
    } else if (props.content_type === "study") {
        return <Study
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else if (props.content_type === "trial") {
        return <Trial
          study_summaries={props.study_summaries}
          study_name={study_name}
          setStudyName={setStudyName}
        />
    } else if (props.content_type === "contour") {
        return <Contour
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
            height={height}
            width={width}
            parameters={parameters}
        />
    } else if (props.content_type === "edf") {
        return <EdfPlot
            study_summaries={props.study_summaries}
            height={height}
            width={width}
        />
    } else if (props.content_type === "interm") {
        return <InterMediatePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
            height={height}
            width={width}
        />
    } else if (props.content_type === "history") {
        return <HistoryPlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
            height={height}
            width={width}
        />
    } else if (props.content_type === "parallel") {
        return <ParallelCoordinatePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
            height={height}
            width={width}
            parameters={parameters}
        />
    } else if (props.content_type === "importance") {
        return <ParameterImportancePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
            height={height}
            width={width}
            parameters={parameters}
        />
    } else {
        return <div />
    }
}

export default Content;