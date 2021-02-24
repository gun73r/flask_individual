# flask_individual
Online document editor
## Requirements
* Python 3.8+
* Poetry
* Node
## Installation
### Requirements
* Python 3.8 (via pyenv)
```shell script
sudo apt update -y
sudo apt install -y make build-essential libssl-dev zlib1g-dev \
libbz2-dev libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev\
libncursesw5-dev xz-utils tk-dev libffi-dev liblzma-dev python-openssl\
git
git clone https://github.com/pyenv/pyenv.git ~/.pyenv
echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n eval "$(pyenv init -)"\nfi' >> ~/.bashrc
exec "$SHELL"
pyenv install 3.8.5
```
* Poetry
```shell script
curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
export PATH="$PATH:$HOME/.poetry/bin"
poetry config virtualenvs.in-project true
```
* Node + npm
```shell script
curl -fsSL https://deb.nodesource.com/setup_15.x | sudo -E bash -
sudo apt-get install -y nodejs npm
```

### For developing
```shell script
pyenv global 3.8.5
poetry install
poetry shell
pre-commit install
cd templates
npm install
pre-commit run -a # to run all pre-commit tests
```

### For production deploy
* Service
```shell script
pyenv global 3.8.5
poetry install --no-dev
poetry run gunicorn --worker-class eventlet -c ./configs/service.conf.py "run:create_app()[0]"
```
* React
```shell script
cd templates
npm install
yarn start
```

## Config examples
### service.conf.py
```python
import multiprocessing

port = 5000
host = '127.0.0.1'

bind = f'{host}:{port}'
workers = multiprocessing.cpu_count() * 2 + 1
```

### mongo.conf.yml
```yaml
db_name: Zesla
collection_names:
  company: company
  user: user
  agreement: agreement
  approval: approval
  signature: signature
```

### .env
```ini
SECRET_KEY=<your_secret_key>
MONGO_CONNECTION=<mongodb_connection_string>
```
