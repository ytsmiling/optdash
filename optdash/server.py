import argparse
from http.server import BaseHTTPRequestHandler
from http.server import HTTPServer
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
from urllib.parse import urlparse
import webbrowser

from optdash.version import __version__


__all__: List[str] = []


def create_request_handler_class() -> type:
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

        def get_contents(self) -> Tuple[int, Dict[str, str], Optional[bytes]]:
            parsed_url = urlparse(self.path)
            pathname = parsed_url.path
            folder = Path(__file__).absolute().parent / "frontend" / "public"
            headers = {}
            buffer: Optional[bytes] = None
            if pathname == "/":
                pathname = "/index.html"
            if pathname[1:] in self.public_contents:
                with (folder / pathname[1:]).open("rb") as bf:
                    buffer = bf.read()
                headers["Content-Type"] = self.content_type[pathname.split(".")[-1]]
                headers["Content-Length"] = f"{len(buffer)}"
                status_code = 200
            else:
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
    def __init__(self, host: str, port: int, url: str) -> None:
        super(HTTPServerThread, self).__init__(daemon=True)
        self.url = url
        self.port = port
        self.host = host
        self.server = ThreadedHTTPServer((host, port), create_request_handler_class())
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
    def __init__(self) -> None:
        self._thread_list: List = []

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
        thread = HTTPServerThread(host, port, url)
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

    server = Server()
    server.serve(browse=args.browse, port=args.port, host=args.host)
    server.wait()
    sys.exit(0)


if __name__ == "__main__":
    main()
