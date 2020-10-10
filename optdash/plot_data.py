from functools import reduce
from typing import Dict
from typing import List
from typing import Optional

from urllib.parse import unquote
import numpy as np
import optuna
from optuna.study import StudyDirection
from optuna.trial import TrialState

from optdash.study import Study


def build_plot_data(
    study: Optional[Study], studies: List[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if query_params["type"][0] == "contour":
        return build_contour_plot_data(study, query_params)
    elif query_params["type"][0] == "edf":
        return build_edf_plot_data(studies, query_params)
    elif query_params["type"][0] == "intermediate-values":
        return build_intermediate_values_plot_data(study, query_params)
    elif query_params["type"][0] == "history":
        return build_history_plot_data(study, query_params)
    elif query_params["type"][0] == "parallel-coordinate":
        return build_parallel_coordinate_plot_data(study, query_params)
    elif query_params["type"][0] == "parameter-importance":
        return build_importance_plot_data(study, query_params)
    raise ValueError(query_params["type"])


def build_contour_plot_data(
    study: Optional[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if study is None:
        raise FileNotFoundError()
    param_x = unquote(query_params["param-x"][0])
    param_y = unquote(query_params["param-y"][0])
    trials = [
        t
        for t in study.trials
        if param_x in t.params and param_y in t.params and t.state == TrialState.COMPLETE
    ]

    return [
        dict(
            x=[trial.params[param_x] for trial in trials],
            y=[trial.params[param_y] for trial in trials],
            z=[trial.value for trial in trials],
            type="contour",
        )
    ]


def build_edf_plot_data(studies: List[Study], query_params: Dict[str, List[str]]) -> List[Dict]:
    value_list = []
    for study in studies:
        all_trials = [trial for trial in study.trials if trial.state == TrialState.COMPLETE]

        min_x_value = min(trial.value for trial in all_trials)
        max_x_value = max(trial.value for trial in all_trials)
        x_values = np.linspace(min_x_value, max_x_value, 100)

        values = np.asarray(
            [trial.value for trial in study.trials if trial.state == TrialState.COMPLETE]
        )

        y_values = np.sum(values[:, np.newaxis] <= x_values, axis=0) / values.size

        value_list.append(
            dict(
                name=study.study_name,
                x=x_values.tolist(),
                y=y_values.tolist(),
                type="scatter",
                mode="lines+markers",
            )
        )

    return value_list


def build_intermediate_values_plot_data(
    study: Optional[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if study is None:
        raise FileNotFoundError()
    trials = [
        trial
        for trial in sorted(study.trials, key=lambda x: x.number)
        if trial.state == TrialState.COMPLETE
    ]

    return [
        dict(
            name=f"trial#{trial.number}",
            x=list(trial.intermediate_values.keys()),
            y=list(trial.intermediate_values.values()),
            type="scatter",
            mode="lines+markers",
        )
        for trial in trials
    ]


def build_history_plot_data(
    study: Optional[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if study is None:
        raise FileNotFoundError
    trials = [
        trial
        for trial in sorted(study.trials, key=lambda x: x.number)
        if trial.state == TrialState.COMPLETE
    ]
    values = [trial.value for trial in trials]
    if study.direction == StudyDirection.MINIMIZE:
        worst = max(values)
        bests = reduce(lambda x, y: x + [min(x[-1], y)], values, [worst])[1:]
    else:
        worst = min(values)
        bests = reduce(lambda x, y: x + [max(x[-1], y)], values, [worst])[1:]

    return [
        dict(
            x=[trial.number for trial in trials],
            y=values,
            type="scatter",
            mode="markers",
            name="trial",
        ),
        dict(
            x=[trial.number for trial in trials],
            y=bests,
            type="scatter",
            mode="lines+markers",
            name="best",
        ),
    ]


def build_parallel_coordinate_plot_data(
    study: Optional[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if study is None:
        raise FileNotFoundError
    param_names = query_params["param-names"] if "param-names" in query_params else []
    trials = [
        trial
        for trial in sorted(study.trials, key=lambda x: x.number)
        if trial.state == TrialState.COMPLETE
        and all(pname in trial.params for pname in param_names)
    ]

    return [
        dict(
            type="parcoords",
            dimensions=[
                dict(
                    label=param_name,
                    values=[trial.params[param_name] for trial in trials],
                )
                for param_name in param_names
            ]
            + [
                dict(
                    label="value",
                    values=[trial.value for trial in trials],
                )
            ],
        )
    ]


def build_importance_plot_data(
    study: Optional[Study], query_params: Dict[str, List[str]]
) -> List[Dict]:
    if study is None:
        raise FileNotFoundError
    param_names = query_params["param-names"] if "param-names" in query_params else []

    importances = optuna.importance.get_param_importances(
        study, evaluator=None, params=param_names  # type: ignore
    )

    importances = dict(reversed(list(importances.items())))
    return [
        dict(
            type="bar", x=list(importances.values()), y=list(importances.keys()), orientation="h"
        ),
    ]
