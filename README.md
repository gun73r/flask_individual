# flask_individual
Online document editor
## Installation
### For developing
```shell script
poetry install
poetry shell
pre-commit install
pre-commit run -a # to run all pre-commit tests
```
### For production deploy
```shell script
poetry install --no-dev
poetry run python run.py
```
