# optdash

**Optdash** is a third-party dashboard for optuna.

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
