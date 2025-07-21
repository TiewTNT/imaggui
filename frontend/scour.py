import markdown
from pathlib import Path
node_modules = Path('./node_modules')


def safe_read(file: Path) -> str:
    encodings_to_try = ['utf-8', 'utf-16', 'utf-32', 'latin-1']
    for enc in encodings_to_try:
        try:
            return file.read_text(encoding=enc), enc
        except UnicodeDecodeError:
            continue
    # Final fallback with errors replaced
    return file.read_text(encoding='utf-8', errors='replace'), 'utf-8'


for file in node_modules.rglob('*'):
    if file.stem.lower().strip() == 'license' and file.suffix not in ['.js', '.ts', '.css', '.ico', '.svg', '.png', '.jpg', '.webp', '.tiff']:
        try:
            package = file.relative_to(node_modules).parent
        except ValueError:
            package = "UNKNOWN"
        text, enc = safe_read(file)
        text = markdown.markdown(text.replace('>', '&gt;').replace('<', '&lt;').replace(
            '{', '&lbrace;').replace('}', '&rbrace;').replace('\n', '<br/>'))
        text = text.replace('<p>', '<p class="text-base sm:text-lg leading-relaxed break-words">').replace(
            '<a ', '<a class="text-primary-400 italic" ')+'\n'

        with open(f'src/lib/licenses/{'-'.join(str(package).split('\\'))}', 'w', encoding=enc) as license_file:
            license_file.write(f'''
                        <details class="bg-surface-800 p-4 rounded-xl shadow mb-6">
                        <summary class="cursor-pointer text-2xl font-bold text-primary-400">
                        {package}
                        </summary>
                        <div class="h-4">
                        </div>
                        {text}
                        <div class="flex justify-center mt-6">
                        <hr class="w-[30%]" />
                        </div>
                        </details>''')

