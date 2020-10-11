import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import ElementSelection from '../inputs/element-selection';
import fetch_data from "../../utils/fetch-data"

function InterMediatePlot(
    props: {
        study_summaries: Array<any>,
        study_name: string,
        setStudyName: (x: string) => void,
    }
) {
    const [plot_data, setPlotData] = useState([]);
    const study_name = props.study_name;
    const setStudyName = props.setStudyName;

    let width: number = window.innerWidth * 0.8;
    let height: number = width * 0.7;

    let study_names = props.study_summaries.map((x) => x["name"]);

    useEffect(() => {
        if (!study_names.includes(study_name)) { return }
        fetch_data(
            "/api/plot-data",
            [
                ["type", "intermediate-values"],
                ["study-name", study_name],
            ],
            setPlotData,
        );
    }, [study_name]);

    return (
        <div>
            <ElementSelection candidates={study_names} display_name="Study Name" setter={setStudyName} default_value={study_name} />

            <Plot
                data={plot_data}
                layout={
                    {
                        width: width,
                        height: height,
                        title: 'Intermediate values.',
                        xaxis: { title: "Step" },
                        yaxis: { title: "Value" },
                    }
                }
            />
        </div>
    );
}

export default InterMediatePlot;