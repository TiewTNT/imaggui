from pathlib import Path
import subprocess

def get_image_format(path: Path) -> str:
    result = subprocess.run(
        ["magick", "identify", "-format", "%m", str(path)],
        capture_output=True,
        text=True
    )
    return result.stdout.strip().lower()
