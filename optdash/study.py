import threading
from typing import Dict
from typing import List
from typing import Optional

import optuna


class Study:
    def __init__(self, study: optuna.Study) -> None:
        self.study_name = study.study_name
        self.user_attrs = study.user_attrs
        self.system_attrs = study.system_attrs
        self.direction = study.direction
        self.best_trial = study.best_trial
        self.best_params = study.best_params
        self.best_value = study.best_value
        self.trials = study.get_trials(deepcopy=False)

    def get_trials(self, deepcopy: bool = True) -> List[optuna.trial.FrozenTrial]:
        return self.trials


class StudyCache:
    def __init__(self, database_url: str) -> None:
        self.lock = threading.Lock()
        self.study_cache: Dict[str, Study] = {}
        self.summary_cache: Optional[List[optuna.study.StudySummary]] = None
        self.database_url = database_url

    def _get_study_summary(self) -> List[optuna.study.StudySummary]:
        if self.summary_cache is not None:
            return self.summary_cache
        summary = optuna.get_all_study_summaries(storage=self.database_url)
        self.summary_cache = summary
        return summary

    def get_study_summary(self) -> List[optuna.study.StudySummary]:
        with self.lock:
            return self._get_study_summary()

    def get_study(self, study_name: Optional[str], cache: bool = True) -> Study:
        if study_name is None:
            raise FileNotFoundError()
        with self.lock:
            if study_name not in [study.study_name for study in self._get_study_summary()]:
                raise FileNotFoundError
            if study_name not in self.study_cache:
                study = Study(
                    optuna.load_study(
                        study_name=study_name,
                        storage=self.database_url,
                    )
                )
                if cache:
                    self.study_cache = {study_name: study}
                else:
                    return study
            return self.study_cache[study_name]
