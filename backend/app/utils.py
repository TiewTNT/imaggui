from pathlib import Path
import subprocess
import regex

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


def parse(text: str, vars: dict):
    reg = r"\@\{.*?\}|[^@]+"
    pattern = regex.compile(reg)
    result = []
    matches = pattern.findall(text)
    print(matches)
    for m in matches:
        if reg_match := regex.match(r"\@\{(.*)\}", m):
            
            expr = reg_match.group(1)
            result.append(str(int(round(eval(expr, {"__builtins__": {}}, vars)))))
        else:
            result.append(m)

    return ''.join(result)


if __name__ == "__main__":
    # print(get_image_format(Path(r'C:\Users\tntti\Downloads\Portrait-of-a-cat-with-whiskers-visible(10).png')))
    print(parse("@{w*2}x@{h*2}", {}))