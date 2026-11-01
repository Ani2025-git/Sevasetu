import os
import sys

# Import app from root app.py (which exports Flask app)
import app as app_module

app = app_module.app

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
