import React, { useEffect, useState } from 'react';
import Plot from "react-plotly.js";
import { Layout } from "plotly.js";
import ElementSelection from '../inputs/element-selection';
import fetch_data from "../../utils/fetch-data"

function ContourPlot(
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
    const [param_x, setParamX] = useState("");
    const [param_y, setParamY] = useState("");
    const study_name = props.study_name;
    const setStudyName = props.setStudyName;
    const parameters = props.parameters;

    useEffect(() => {
        if (study_name === "" || param_x === "" || param_y === "") { return }
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
    let layout = {
        width: props.width,
        height: props.height,
        title: 'A Contour Plot.',
        xaxis: {
            title: param_x,
            type: "linear" as Layout["xaxis.type"],
        },
        yaxis: {
            title: param_y,
            type: "linear" as Layout["yaxis.type"],
        },
    };
    if (param_x in parameters["distributions"]) {
        if (parameters["distributions"][param_x]["categorical"]) {
            layout["xaxis"]["type"] = "categorical" as Layout["xaxis.type"]
        } else if (parameters["distributions"][param_x]["log"]) {
            layout["xaxis"]["type"] = "log" as Layout["xaxis.type"]
        }
    }
    if (param_y in parameters["distributions"]) {
        if (parameters["distributions"][param_y]["categorical"]) {
            layout["yaxis"]["type"] = "categorical" as Layout["yaxis.type"]
        } else if (parameters["distributions"][param_y]["log"]) {
            layout["yaxis"]["type"] = "log" as Layout["yaxis.type"]
        }
    }

    return (
        <div>
            <div className="param-selector">
                <ElementSelection candidates={study_names} display_name="Study Name" setter={setStudyName} default_value={study_name} />
                <ElementSelection candidates={parameters["parameter-names"]} display_name="Parameter-X" setter={setParamX} default_value={""} />
                <ElementSelection candidates={parameters["parameter-names"]} display_name="Parameter-Y" setter={setParamY} default_value={""} />
            </div>

            <Plot
                data={plot_data}
                layout={ layout }
            />
        </div>
    );
}

export default ContourPlot;