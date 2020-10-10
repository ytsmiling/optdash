import React from 'react';
import StudyList from './study-list';

function Content(props: { content_type: string, study_summaries: Array<any> }) {
    if (props.content_type == "study-list") {
        return <StudyList study_summaries={props.study_summaries}/>
    } else {
        return <div></div>
    }
}

export default Content;