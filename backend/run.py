from app import create_app
import os

app = create_app()

if __name__ == '__main__':
    # Only use debug mode in development, controlled by environment variable
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)
