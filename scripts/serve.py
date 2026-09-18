"""Serve the static portfolio locally, including concurrent browser checks."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class PreviewServer(ThreadingHTTPServer):
    # Multiple test browsers can open many asset connections simultaneously.
    request_queue_size = 128


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    handler = partial(SimpleHTTPRequestHandler, directory=str(root))
    with PreviewServer(("127.0.0.1", args.port), handler) as server:
        print(f"Portfolio preview: http://127.0.0.1:{args.port}", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
