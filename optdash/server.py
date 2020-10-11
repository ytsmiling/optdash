import argparse
from datetime import datetime
from http.server import BaseHTTPRequestHandler
from http.server import HTTPServer
import json
import logging
from pathlib import Path
from socketserver import ThreadingMixIn
import sys
import threading
import time
from typing import Any
from typing import Dict
from typing import List
from typing import Optional
from typing import Tuple
from typing import Union
from urllib.parse import parse_qs
from urllib.parse import urlparse
import webbrowser

from optdash.plot_data import build_plot_data
from optdash.study import Study
from optdash.study import StudyCache
from optdash.version import __version__

__all__: List[str] = []


def create_request_handler_class(study_cache: StudyCache) -> type:
    class HTTPRequestHandler(BaseHTTPRequestHandler):
        public_contents = {
            "index.html",
            "bundle.js",
            "manifest.json",
            "favicon.ico",
        }
        content_type = {
            "html": "text/html",
            "ico": "image/x-icon",
            "js": "text/javascript",
            "json": "application/json",
        }
        _study_cache = study_cache

        def get_contents(self) -> Tuple[int, Dict[str, str], Optional[bytes]]:
            parsed_url = urlparse(self.path)
            pathname = parsed_url.path
            folder = Path(__file__).absolute().parent / "frontend" / "public"
            headers = {}
            buffer: Optional[bytes] = None
            if pathname == "/":
                pathname = "/index.html"
            try:
                if pathname[1:] in self.public_contents:
                    with (folder / pathname[1:]).open("rb") as bf:
                        buffer = bf.read()
                    headers["Content-Type"] = self.content_type[pathname.split(".")[-1]]
                    headers["Content-Length"] = f"{len(buffer)}"
                elif len(pathname.split("/")) == 3 and pathname.split("/")[1] == "api":
                    data_type = pathname.split("/")[2]
                    if data_type == "study-summaries":
                        studies = self._study_cache.get_study_summary()
                        study_summaries = {
                            "study-summaries": [
                                {
                                    "name": study.study_name,
                                    "best-value": study.best_trial.value
                                    if study.best_trial
                                    else None,
                                    "num-trials": study.n_trials,
                                    "direction": study.direction.name,
                                    "datetime-start": (
                                        study.datetime_start.isoformat()
                                        if study.datetime_start is not None else ""
                                    ),
                                }
                                for study in sorted(
                                    studies, key=lambda s: (
                                        s.datetime_start if s.datetime_start is None else datetime.now()
                                    )
                                )
                            ]
                        }
                        buffer = json.dumps(study_summaries).encode("utf-8")
                    elif data_type == "parameters":
                        study_name: Optional[Union[str, List[str]]] = parse_qs(
                            parsed_url.query
                        ).get("study-name", None)
                        if isinstance(study_name, list):
                            study_name = study_name[0] if study_name else None
                        study = self._study_cache.get_study(study_name)
                        parameter_names = set()
                        for trial in study.trials:
                            for param_name in trial.params.keys():
                                parameter_names.add(param_name)
                        buffer = json.dumps(
                            {"parameter-names": list(sorted(parameter_names))}
                        ).encode("utf-8")
                    elif data_type == "plot-data":
                        query_params = parse_qs(parsed_url.query)
                        study_name = query_params.get("study-name", None)
                        if isinstance(study_name, list):
                            study_name = study_name[0] if study_name else None
                        if study_name is None:
                            optional_study: Optional[Study] = None
                        else:
                            optional_study = self._study_cache.get_study(study_name)
                        study_names: Optional[Union[str, List[str]]] = query_params.get(
                            "study-names", None
                        )
                        if study_names is None:
                            study_names = []
                        if not isinstance(study_names, list):
                            study_names = [study_names]
                        study_list = [
                            self._study_cache.get_study(sn, cache=False) for sn in study_names
                        ]
                        plot_data = build_plot_data(optional_study, study_list, query_params)
                        buffer = json.dumps(plot_data).encode("utf-8")
                    else:
                        raise FileNotFoundError()
                    headers["Content-Type"] = "application/json"
                    headers["Content-Length"] = f"{len(buffer)}"
                else:
                    raise FileNotFoundError()
                status_code = 200
            except FileNotFoundError:
                status_code = 404
            return status_code, headers, buffer

        def do_GET(self) -> None:
            status_code, headers, buffer = self.get_contents()
            self.send_response(status_code)
            for key in headers:
                self.send_header(key, headers[key])
            self.end_headers()
            if status_code == 404 and buffer is None:
                self.wfile.write(bytes(status_code))
            elif (status_code == 200 or status_code == 404) and buffer is not None:
                self.wfile.write(buffer)

        def do_HEAD(self) -> None:
            status_code, headers, buffer = self.get_contents()
            self.send_response(status_code)
            for key in headers:
                self.send_header(key, headers[key])
            self.end_headers()

        def log_message(self, format: str, *args: Any) -> None:
            logging.debug(format.format(*args))

    return HTTPRequestHandler


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    daemon_threads = True
    pass


class HTTPServerThread(threading.Thread):
    def __init__(self, host: str, port: int, url: str, database_url: str) -> None:
        super(HTTPServerThread, self).__init__(daemon=True)
        self.url = url
        self.port = port
        self.host = host
        study_cache = StudyCache(database_url)
        self.server = ThreadedHTTPServer((host, port), create_request_handler_class(study_cache))
        self.server.timeout = 0.25
        self.terminate_event = threading.Event()
        self.terminate_event.set()
        self.stop_event = threading.Event()

    def run(self) -> None:
        self.stop_event.clear()
        self.terminate_event.clear()
        try:
            while not self.stop_event.is_set():
                self.server.handle_request()
        finally:
            self.terminate_event.set()
            self.stop_event.clear()

    def stop(self) -> None:
        if self.alive():
            logging.info(f"Stopping {self.url}")
            self.stop_event.set()
            self.server.server_close()
            self.terminate_event.wait(1000)

    def alive(self) -> bool:
        return not self.terminate_event.is_set()


class Server:
    def __init__(self, database_url: str) -> None:
        self._thread_list: List = []
        self._database_url = database_url

    def serve(
        self,
        host: str = "localhost",
        port: int = 8080,
        browse: bool = False,
    ) -> None:
        """Start a server at host:port and open in a web browser.

        Args:
            host: Host to serve. Default: 'localhost'
            port: Port to serve. Default: 8080
            browse: Launch web browser. Default: :obj:`True`.
        """
        self.stop(host, port)

        url = f"http://{host}:{port}"

        self._thread_list = [thread for thread in self._thread_list if thread.alive()]
        thread = HTTPServerThread(host, port, url, self._database_url)
        thread.start()
        while not thread.alive():
            time.sleep(10)
        self._thread_list.append(thread)

        logging.info(f"Serving at {url}")
        if browse:
            webbrowser.open(url)

    def wait(self) -> None:
        """Wait for console exit and stop all servers."""
        try:
            while self._thread_list:
                self._thread_list = [thread for thread in self._thread_list if thread.alive()]
                time.sleep(1000)
        except (SystemExit, KeyboardInterrupt):
            pass
        finally:
            for thread in self._thread_list:
                thread.stop()
            self._thread_list = []

    def stop(self, host: str = "localhost", port: int = 8080) -> None:
        """Stop a server at host:port.

        Args:
            port: port to stop. Default: 8080
            host: host to stop. Default: 'localhost'
        """
        for thread in self._thread_list:
            if port == thread.port and host == thread.host:
                thread.stop()
        self._thread_list = [thread for thread in self._thread_list if thread.alive()]


def main() -> None:
    parser = argparse.ArgumentParser(description="A third-party dashboard for optuna.")
    parser.add_argument("--version", help="print version", action="store_true")
    parser.add_argument("db", help="database url of optuna", nargs="?", type=str)
    parser.add_argument("--browse", help="launch web browser", action="store_true")
    parser.add_argument("--port", help="port to serve (default: 8080)", type=int, default=8080)
    parser.add_argument("--host", help="host to serve (default: 'localhost')", default="localhost")
    parser.add_argument("-v", help="verbose mode", action="store_true")
    parser.add_argument("-q", help="quiet mode", action="store_true")
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)
    if args.q:
        logging.basicConfig(level=logging.WARN)
    if args.v:
        logging.basicConfig(level=logging.DEBUG)

    if args.version:
        print(__version__)
        sys.exit(0)

    if args.db is None:
        sys.stderr.write("Usage Error: Specify database to connect.")
        sys.exit(1)

    server = Server(args.db)
    server.serve(browse=args.browse, port=args.port, host=args.host)
    server.wait()
    sys.exit(0)


if __name__ == "__main__":
    main()
