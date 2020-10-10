import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import ElementSelection from '../inputs/element-selection';
import fetch_data from "../../utils/fetch-data"

function ContourPlot(props: { study_summaries: Array<any>}) {
    const [plot_data, setPlotData] = useState([]);
    const [param_list, setParamList] = useState([]);
    const [study_name, setStudyName] = useState("");
    const [param_x, setParamX] = useState("");
    const [param_y, setParamY] = useState("");

    let width: number = window.innerWidth * 0.8;
    let height: number = width * 0.7;

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
        if (study_name == "" || param_x == "" || param_y == "") { return }
        fetch_data(
            "/api/plot-data",
            [
                ["type", "contour"],
                ["study-name", study_name],
                ["param-x", param_x],
                ["param-y", param_y],
            ],
            setPlotData,
        );
    }, [study_name, param_x, param_y]);

    let study_names = props.study_summaries.map((x) => x["name"]);

    return (
        <div>
            <ElementSelection candidates={study_names} display_name="Study Name" setter={setStudyName} />
            <ElementSelection candidates={param_list} display_name="Parameter-X" setter={setParamX} />
            <ElementSelection candidates={param_list} display_name="Parameter-Y" setter={setParamY} />

            <Plot
                data={plot_data}
                layout={
                    {
                        width: width,
                        height: height,
                        title: 'A Contour Plot.',
                        xaxis: { title: param_x },
                        yaxis: { title: param_y },
                    }
                }
            />
        </div>
    );
}

export default ContourPlot;