import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import ElementSelection from '../inputs/element-selection';
import fetch_data from "../../utils/fetch-data"
import MultiElementSelection from '../inputs/multi-element-selection';

function ParameterImportancePlot(props: { study_summaries: Array<any> }) {
    const [plot_data, setPlotData] = useState([]);
    const [param_list, setParamList] = useState([] as string[]);
    const [study_name, setStudyName] = useState("");
    const [parameters, setParameters] = useState([] as string[]);

    let width: number = window.innerWidth * 0.8;
    let height: number = width * 0.7;

    let study_names = props.study_summaries.map((x) => x["name"]);

    useEffect(() => {
        if (study_name == "") { return }
        fetch_data(
            "/api/parameters",
            [["study-name", study_name]],
            setParamList,
            "parameter-names",
        );
    }, [study_name]);

    useEffect(() => {
        if (!study_names.includes(study_name) || parameters.length == 0 || !parameters.every((x) => param_list.includes(x))) { return }
        fetch_data(
            "/api/plot-data",
            [
                ["type", "parameter-importance"],
                ["study-name", study_name],
            ].concat(parameters.map((x) => ["param-names", x])),
            setPlotData,
        );
    }, [study_name, parameters]);

    return (
        <div>
            <ElementSelection candidates={study_names} display_name="Study Name" setter={setStudyName} />
            <MultiElementSelection candidates={param_list} display_name="Parameter" setter={setParameters} current_values={parameters} />

            <Plot
                data={plot_data}
                layout={
                    {
                        width: width,
                        height: height,
                        title: 'Parameter Importance.',
                    }
                }
            />
        </div>
    );
}

export default ParameterImportancePlot;