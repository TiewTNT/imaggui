from pathlib import Path
import subprocess
import re

def get_image_format(path: Path) -> str:
    result = subprocess.run(
        str(fr'magick "{str(path)}" -format "%m\n" info:'),
        stdout=subprocess.PIPE,
        text=True,
        shell=True,
    )
    print('[INFO] Attempting', str(fr'magick "{str(path)}" -format "%m\n" info:'))
    detected = result.stdout.strip().lower()
    if not detected:
        print('[INFO] Using suffix fallback')
        detected = path.suffix[1:]
    print('[INFO] The format of', str(path), 'is', detected)
    print('[INFO]', path, 'exists =', path.exists())
    return detected


def parse(text: str):
    
    pattern = re.compile(r"(?<!\\)@\{(.*?)\}@")
    escape_pattern = re.compile(r"\\@\{(.*?)\}@")
    def replacer(m):
        expr = m.group(1)
        print(expr)
        try:
            return f'"%[fx:{expr}]"'
        except Exception as e:
            return f"[error: {e}: {m.group(0)}]"

    return escape_pattern.sub(lambda m: m.group(0)[1:], pat := pattern.sub(replacer, text))


if __name__ == "__main__":
    # print(get_image_format(Path(r'C:\Users\tntti\Downloads\Portrait-of-a-cat-with-whiskers-visible(10).png')))
    print(parse(r"@{2*2}@x@{2*2}@"))