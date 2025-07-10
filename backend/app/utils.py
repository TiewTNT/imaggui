from pathlib import Path
import subprocess

def get_image_format(path: Path) -> str:
    result = subprocess.run(
        ["magick", "identify", path],
        stdout=subprocess.PIPE,
        text=True
    )
    try:
        detected = result.stdout.strip().split()[1].lower()
    except IndexError:
        detected = path.suffix[1:]
    print('[INFO] The format of', str(path), 'is', detected)
    print('[INFO]', path, 'exists =', path.exists())
    return detected

if __name__ == "__main__":
    print(get_image_format(Path(r'C:\Users\tntti\Downloads\Portrait-of-a-cat-with-whiskers-visible(10).png')))