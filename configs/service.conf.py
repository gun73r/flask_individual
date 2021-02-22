import multiprocessing

port = 5000
host = '127.0.0.1'

bind = f'{host}:{port}'
workers = multiprocessing.cpu_count() * 2 + 1
