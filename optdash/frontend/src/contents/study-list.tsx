import React from 'react';

function StudyList(props: { study_summaries: Array<any> }) {
    return (
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
                    props.study_summaries.map(
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
    );
}

export default StudyList;