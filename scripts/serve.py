"""Dev server with caching disabled — ES modules always load fresh.
Usage: python scripts/serve.py [port]  (default 8756)
"""
import sys,http.server,functools

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-cache, no-store, must-revalidate')
        self.send_header('Pragma','no-cache')
        self.send_header('Expires','0')
        super().end_headers()

if __name__=='__main__':
    port=int(sys.argv[1]) if len(sys.argv)>1 else 8756
    http.server.ThreadingHTTPServer(('',port),NoCacheHandler).serve_forever()
