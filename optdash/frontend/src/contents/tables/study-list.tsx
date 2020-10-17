import React from 'react';
import './study-list.css'

function StudyList(props: { study_summaries: Array<any> }) {
    return (
        <table className="study-list">
            <thead>
                <tr>
                    <th>study name</th>
                    <th>#trials</th>
                    <th>best</th>
                    <th>direction</th>
                    <th>start time</th>
                </tr>
            </thead>
            <tbody>
                {
                    props.study_summaries.map(
                        (x) => <tr>
                            <td>{x["name"]}</td>
                            <td>{x["num-trials"]}</td>
                            <td>{x["best-value"]}</td>
                            <td>{x["direction"]}</td>
                            <td>{x["datetime-start"]}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    );
}

export default StudyList;