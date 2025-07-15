import markdown
from pathlib import Path
node_modules = Path('./node_modules')


def safe_read(file: Path) -> str:
    encodings_to_try = ['utf-8', 'utf-16', 'utf-32', 'latin-1']
    for enc in encodings_to_try:
        try:
            return file.read_text(encoding=enc)
        except UnicodeDecodeError:
            continue
    # Final fallback with errors replaced
    return file.read_text(encoding='utf-8', errors='replace')


with open('+page.svelte', 'a', encoding='utf-8') as licenses:
    licenses.write("""<script>
    import { ChevronLeft } from "@lucide/svelte";
</script>
<section class="bg-surface-900 text-surface-100 min-h-screen px-6 py-10">
    <a href="/" class="flex flex-wrap items-center"
        ><ChevronLeft/>Back</a
    >
    <section
        class="min-h-screen bg-surface-900 text-surface-100 px-6 py-16 flex justify-center"
    >
                    <div class="w-full max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
                   <h1 class="text-4xl font-extrabold mb-8 text-center text-primary-400">
                           Third Party Licenses
                           </h1> """)
    for file in node_modules.rglob('*'):
        if file.stem.lower().strip() == 'license' and file.suffix not in ['js', 'ts', 'css', 'ico', 'svg', 'png', 'jpg', 'webp', 'tiff']:
            try:
                package = file.parts[file.parts.index('node_modules') + 1]
            except ValueError:
                package = "UNKNOWN"
            text = safe_read(file)
            text = markdown.markdown(text.replace('>', '&gt;').replace('<', '&lt;').replace(
                '{', '&lbrace;').replace('}', '&rbrace;').replace('\n', '<br/>'))
            text = text.replace('<p>', '<p class="text-base sm:text-lg leading-relaxed break-words">').replace(
                '<a ', '<a class="text-primary-400 italic" ')+'\n'

            licenses.write(f'''<h2 class="text-3xl font-extrabold mb-8 text-center text-primary-400">
                           License from: {package}
                           </h2> 
                           {text}
                           <div class="my-8 flex justify-center">
  <hr class="w-1/2 sm:w-1/3" />
</div>''')
    licenses.write("</div></section></section>")
