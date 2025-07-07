import subprocess
from pathlib import Path
import os

subprocess.run(["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "10000"], cwd=str(Path(os.getcwd()) / "backend" / "app"))