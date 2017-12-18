#!/usr/bin/env python
import os
import sys
import urlparse
import SimpleHTTPServer
import time
class MyHTTPRequestHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_my_headers()
        SimpleHTTPServer.SimpleHTTPRequestHandler.end_headers(self)

    def send_my_headers(self):
        #Only cache images
        if not self.path.endswith("png"):
            self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
            self.send_header("Pragma", "no-cache")
            self.send_header("Expires", "0")

    def do_GET(self):
        urlparts = urlparse.urlparse(self.path)
        request_file_path = urlparts.path
        if not os.path.exists(os.getcwd()+request_file_path):
            self.path = 'index.html'

        return SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    SimpleHTTPServer.test(HandlerClass=MyHTTPRequestHandler)
