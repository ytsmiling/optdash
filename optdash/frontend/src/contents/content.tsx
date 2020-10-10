import React from 'react';
import StudyList from './study-list';
import Contour from './plots/contour';
import EdfPlot from './plots/edf';
import InterMediatePlot from './plots/intermediate-values';
import HistoryPlot from './plots/history';
import ParallelCoordinatePlot from './plots/parallel-coordinate';
import ParameterImportancePlot from './plots/parameter-importance';

function Content(props: { content_type: string, study_summaries: Array<any>}) {
    if (props.content_type == "study-list") {
        return <StudyList study_summaries={props.study_summaries}/>
    } else if (props.content_type == "contour") {
        return <Contour study_summaries={props.study_summaries} />
    } else if (props.content_type == "edf") {
        return <EdfPlot study_summaries={props.study_summaries} />
    } else if (props.content_type == "interm") {
        return <InterMediatePlot study_summaries={props.study_summaries} />
    } else if (props.content_type == "history") {
        return <HistoryPlot study_summaries={props.study_summaries} />
    } else if (props.content_type == "parallel") {
        return <ParallelCoordinatePlot study_summaries={props.study_summaries} />
    } else if (props.content_type == "importance") {
        return <ParameterImportancePlot study_summaries={props.study_summaries} />
    } else {
        return <div></div>
    }
}

export default Content;