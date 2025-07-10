from pathlib import Path
import subprocess

def get_image_format(path: Path) -> str:
    result = subprocess.run(
        ["magick", "identify", "-format", "%m", str(path)],
        capture_output=True,
        text=True
    )
    print('[INFO] The format of', str(path), 'is', result.stdout.strip().lower())
    print('[INFO]', path, 'exists =', path.exists())
    return result.stdout.strip().lower()

if __name__ == "__main__":
    print(get_image_format(r'C:\Users\tntti\Downloads\output_four.png'))