from fastapi import FastAPI, Form, File, UploadFile, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import List
from call import *
from file import *
from werkzeug.utils import secure_filename
import json
from collections import OrderedDict
from fastapi.staticfiles import StaticFiles

app = FastAPI()

# Mount static assets
app.mount("/_app", StaticFiles(directory="../../frontend/build/_app"), name="app")
app.mount("/static", StaticFiles(directory="../../frontend/build"), name="static")

@app.get("/")
async def index():
    return FileResponse("../../frontend/build/200.html")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins="*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Main API endpoint

@app.post("/api")
async def api(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(),
    input_format: str | None = Form(None),
    output_format: str | None = Form(None),
    tools: str | None = Form(None)
):

    # File writing and size limiting
    size = 0
    size_limit = 33554432

    user_files = []

    for f in files:
        if (secure_filename(f.filename) != f.filename) or not Path(f.filename).stem:
            print(f"[SECURITY] Rejected file with unsafe name: {f.filename}")
        fname = secure_filename(f.filename)
        
        if input_format:
            temp_file = TempFile(suffix=input_format)
            print('[INFO] Created input TempFile with suffix', input_format)
        else:
            temp_file = TempFile(suffix=Path(fname).suffix[1:])
            print('[INFO] Created TempFile with suffix', Path(f.filename).suffix[1:])
        
        print('[INFO] User specifies output format:', str(output_format))
        user_files.append(temp_file)

        while True:
            chunk = await f.read(1024 * 1024)
            if not chunk:
                break
            size += len(chunk)
            if size > size_limit:
                return JSONResponse(
                    status_code=413,
                    content={
                        "error": "File too large", "message": f"Uploads are limited to around {size_limit/(1024**2)}MB total."}
                )
            temp_file.write_bytes(chunk)

    # For processed files
    saved_files = []

    # Cleanup
    background_tasks.add_task(delete_all)

    for f in user_files:
        try:
            assert type(f) == TempFile

            buffer = MagickBuffer(input_file=f.path, input_format=input_format, output_format=output_format)

            if type(tools) == str and len(tools) > 0: # Check if use specified tools
                try:
                    tools_dict = json.loads(tools, object_pairs_hook=OrderedDict)
                except json.decoder.JSONDecodeError:
                    return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Tools was invalid JSON", "message": f"The tools should be in a proper JSON format"}
                )

                flags = []

                print(f"[DEBUG] Saved {f.path}, size={Path(f.path).stat().st_size}")
                with open(f.path, 'rb') as file:
                    print(f"[DEBUG] First bytes: {file.read(8)}")


                for key, val in tools_dict.items():
                    flags.append('-'+key.replace(' ', '-').replace('/', '-'))
                    if type(val) == str:
                        if val:
                            flags.append(val)
                    else:
                        flags.extend([v for v in val if v])

                buffer.cmd(flags)

            if output_format:
                saved_file = TempFile(suffix=output_format)
            else:
                saved_file = TempFile(suffix=get_image_format(f))

            buffer.save(saved_file.path)

            saved_files.append(saved_file)
        except Exception as e:
            print(f'[ERROR] File {f.path} not processed properly.\n       → {e}')

    # In case no files were actually processed
    if len(saved_files) == 0:
        return JSONResponse(
            status_code=500,
            content={
                "error": "No files were processed", "message": f"Error most likely occurred in Magick buffer stream"}
        )
    elif len(saved_files) == 1: # If there's only one file, just return it
        return FileResponse(saved_files[0].path, filename=str(Path(files[0].filename).with_suffix(saved_files[0].path.suffix)))
    else: # If there are multiple files, return a .zip archive
        with zip_temps(saved_files, files) as zipped_path:
            background_tasks.add_task(zipped_path.unlink)
            return FileResponse(zipped_path, filename=f"{Path(files[0].filename).with_suffix('.zip')}", media_type="application/zip")

    

