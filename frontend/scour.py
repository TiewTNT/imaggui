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
                    <div class="max-w-3xl w-full space-y-10">
                   <h1 class="text-4xl font-extrabold mb-8 text-center text-primary-400">
                           Third Party Licenses
                           </h1> """)
    for file in node_modules.rglob('*'):
        if file.stem.lower().strip() == 'license':
            try:
                package = file.parts[file.parts.index('node_modules') + 1]
            except ValueError:
                package = "UNKNOWN"
            text = safe_read(file)
            text = '<p class="text-lg leading-relaxed">'+text.replace('>', '&gt;').replace('<', '&lt;').replace('{', '&lbrace;').replace('}', '&rbrace;').replace('\n', '<br/>')+'</p>\n'
        
            licenses.write(f'''<h2 class="text-3xl font-extrabold mb-8 text-center text-primary-400">
                           License from: {package}
                           </h2> 
                           {text}
                           <div class=\"flex justify-center\"
                           ><hr class=\"w-[30%]\" />
                           </div>''')
    licenses.write("</div></section></section>")