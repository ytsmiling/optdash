# optdash

**Optdash** is a third-party dashboard for optuna.

![README GIF](docs/images/optdash-readme.gif)

## Key features

* Simple usage
* Interactive visualization
* Minimal dependencies
    * Optdash depends solely on Optuna (and sklearn, which is an optional depedency of optuna).


## Quick start

```shell script
optdash your/db/url
```

The db url is the same with optuna, whose format follows [RFC-1738](https://tools.ietf.org/html/rfc1738.html).

## Install

### From pypi

```shell script
pip install optdash
```


### From source

```shell script
cd optdash/frontend
npm i
npm run build
cd ../../
python -m pip install .
```

## Tutorial

First, create optuna studies.

```python
import optuna

def objective(trial):
     ret = 0
     for j in range(20):
         ret += trial.suggest_float(f"param{j}", 0.0, 1.0)
         trial.report(ret, j)
     return ret

for i in range(10):
     optuna.create_study(
         study_name=f"study{i}", storage="sqlite:///test.db", load_if_exists=True
     ).optimize(objective, n_trials=30)
```

Next, run optdash from a command prompt.

```shell script
optdash sqlite:///test.db
```

Then, you'll see the following message
```text
INFO:root:Serving at http://localhost:8080
```

Open your web-browser, e.g., Google Chrome, and access to http://localhost:8080.
