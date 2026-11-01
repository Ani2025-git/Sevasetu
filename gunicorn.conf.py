import os

# Automatically bind to 0.0.0.0:$PORT for Render / cloud environments
port = os.getenv("PORT", "10000")
bind = f"0.0.0.0:{port}"

# Concurrency settings suitable for free/standard instances
workers = int(os.getenv("WEB_CONCURRENCY", "1"))
threads = 4
timeout = 120

# Stream logs to stdout / stderr for Render log streaming
accesslog = "-"
errorlog = "-"
loglevel = "info"
