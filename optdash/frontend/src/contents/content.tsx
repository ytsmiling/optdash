import React, {useState, useEffect} from 'react';
import StudyList from './study-list';
import Contour from './plots/contour';
import EdfPlot from './plots/edf';
import InterMediatePlot from './plots/intermediate-values';
import HistoryPlot from './plots/history';
import ParallelCoordinatePlot from './plots/parallel-coordinate';
import ParameterImportancePlot from './plots/parameter-importance';
import fetch_data from "../utils/fetch-data"

function Content(
    props: {
        content_type: string,
        study_summaries: Array<any>,
    },
) {
    const [study_name, setStudyName] = useState("");
    const [param_list, setParamList] = useState([]);

    useEffect(() => {
        if (study_name == "") { return }
        fetch_data(
            "/api/parameters",
            [["study-name", study_name]],
            setParamList,
            "parameter-names",
        );
    }, [study_name]);

    if (props.content_type == "study-list") {
        return <StudyList study_summaries={props.study_summaries} />
    } else if (props.content_type == "contour") {
        return <Contour
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else if (props.content_type == "edf") {
        return <EdfPlot study_summaries={props.study_summaries} />
    } else if (props.content_type == "interm") {
        return <InterMediatePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else if (props.content_type == "history") {
        return <HistoryPlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else if (props.content_type == "parallel") {
        return <ParallelCoordinatePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else if (props.content_type == "importance") {
        return <ParameterImportancePlot
            study_summaries={props.study_summaries}
            study_name={study_name}
            setStudyName={setStudyName}
        />
    } else {
        return <div />
    }
}

export default Content;