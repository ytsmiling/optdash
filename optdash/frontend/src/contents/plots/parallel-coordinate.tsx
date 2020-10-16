import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import ElementSelection from '../inputs/element-selection';
import fetch_data from "../../utils/fetch-data"
import MultiElementSelection from '../inputs/multi-element-selection';

function ParallelCoordinatePlot(
    props: {
        study_summaries: Array<any>,
        study_name: string,
        setStudyName: (x: string) => void,
        height: number,
        width: number,
        parameters: any,
    }
) {
    const [plot_data, setPlotData] = useState([]);
    const param_list = props.parameters["parameter-names"];
    const study_name = props.study_name;
    const setStudyName = props.setStudyName;
    const [parameters, setParameters] = useState([] as string[]);

    let study_names = props.study_summaries.map((x) => x["name"]);

    useEffect(() => {
        if (!study_names.includes(study_name) || parameters.length === 0 || !parameters.every((x) => param_list.includes(x))) { return }
        fetch_data(
            "/api/plot-data",
            [
                ["type", "parallel-coordinate"],
                ["study-name", study_name],
            ].concat(parameters.map((x) => ["param-names", x])),
            setPlotData,
        );
    }, [study_name, study_names, parameters, param_list]);

    return (
        <div>
            <div className="param-selector">
                <ElementSelection candidates={study_names} display_name="Study Name" setter={setStudyName} default_value={study_name} />
                <MultiElementSelection candidates={param_list} display_name="Parameter" setter={setParameters} current_values={parameters} />
            </div>

            <Plot
                data={plot_data}
                layout={
                    {
                        width: props.width,
                        height: props.height,
                        title: 'Parallel Coordinate Plot.',
                    }
                }
            />
        </div>
    );
}

export default ParallelCoordinatePlot;