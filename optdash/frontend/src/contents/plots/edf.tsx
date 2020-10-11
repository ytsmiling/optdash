import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import MultiElementSelection from '../inputs/multi-element-selection';
import fetch_data from "../../utils/fetch-data"

function EdfPlot(
    props: {
        study_summaries: Array<any>
        height: number,
        width: number,
    }
) {
    const [plot_data, setPlotData] = useState([]);
    const [study_names, setStudyNames] = useState([] as string[]);

    let study_name_candidates = props.study_summaries.map((x) => x["name"]);

    useEffect(() => {
        if (!study_names.every((x) => study_name_candidates.includes(x))) { return }
        fetch_data(
            "/api/plot-data",
            [
                ["type", "edf"],
            ].concat(
                study_names.map((x) => ["study-names", x])
            ),
            setPlotData,
        );
    }, [study_names]);

    return (
        <div>
            <div className="param-selector">
                <MultiElementSelection candidates={study_name_candidates} display_name="Study Name" current_values={study_names} setter={setStudyNames} />
            </div>

            <Plot
                data={plot_data}
                layout={
                    {
                        width: props.width,
                        height: props.height,
                        title: 'EDF.',
                    }
                }
            />
        </div>
    );
}

export default EdfPlot;