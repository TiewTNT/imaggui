from pathlib import Path
import subprocess

def get_image_format(path: Path) -> str:
    result = subprocess.run(
        str(fr'magick "{str(path)}" -format "%m\n" info:'),
        stdout=subprocess.PIPE,
        text=True,
        shell=True,
    )
    print('[INFO] Attempting', str(fr'magick "{str(path)}" -format "%m\n" info:'))
    detected = result.stdout.strip().lower()
    print('[INFO] The format of', str(path), 'is', detected)
    print('[INFO]', path, 'exists =', path.exists())
    return detected

if __name__ == "__main__":
    print(get_image_format(Path(r'C:\Users\tntti\Downloads\Portrait-of-a-cat-with-whiskers-visible(10).png')))