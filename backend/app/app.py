from fastapi import FastAPI, Form, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from typing import List
from call import *
from file import *
from werkzeug.utils import secure_filename

app = FastAPI()

# CORS setup

app.add_middleware(
    CORSMiddleware,
    allow_origins="*",

    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"],
)


# Main API endpoint

@app.post("/api")
async def api(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(),
    input_format: str | None = Form(None),
    output_format: str | None = Form(None),
):

    # File writing and size limiting
    size = 0
    size_limit = 33554432

    user_files = []

    for f in files:
        if (secure_filename(f.filename) != f.filename) or not Path(f.filename).stem:
            print(f"[SECURITY] Rejected file with unsafe name: {f.filename}")
            return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Filename inappropriate", "message": f"User-uploaded file has a malformed name: {f.filename}"}
                )
        
        if input_format:
            temp_file = TempFile(suffix=input_format)
            print('[INFO] Created input TempFile with suffix', input_format)
        else:
            temp_file = TempFile(suffix=Path(f.filename).suffix[1:])
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

            # Code
            # More code
            # Code McCodeFace
            # And finally, more code

            if output_format:
                saved_file = TempFile(suffix=output_format)
            else:
                saved_file = TempFile(suffix=get_image_format(f))

            buffer.save(saved_file.path)

            saved_files.append(saved_file)
        except Exception as e:
            print(f'[ERROR] File {f.path} not processed properly.\n       → {e}')

    # In case no files were actually processes
    if len(saved_files) == 0:
        return JSONResponse(
            status_code=500,
            content={
                "error": "No files were processed", "message": f"Error most likely occurred in Magick buffer stream"}
        )


    if len(saved_files) == 1: # If there's only one file, just return it
        return FileResponse(saved_files[0].path, filename=str(Path(files[0].filename).with_suffix(saved_files[0].path.suffix)))
    else: # If there are multiple files, return a .zip archive
        with zip_temps(saved_files) as zipped_path:
            background_tasks.add_task(zipped_path.unlink)
            return FileResponse(zipped_path, filename=f"{Path(files[0].filename).with_suffix('.zip')}", media_type="application/zip")

    
