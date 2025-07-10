import tempfile
from pathlib import Path
from typing import List
import zipfile
import contextlib
import os
from fastapi import UploadFile

temp_files = []

class TempFile():
    def __init__(self, suffix: str, add_to_list:bool=True):
        with tempfile.NamedTemporaryFile(delete=False, suffix='.'+suffix) as file:
            if add_to_list:
                temp_files.append(self)
            self.path = Path(file.name)

    def __repr__(self):
        return f"<TempFile path={self.path}>"


    def write_bytes(self, data:bytes):
        with open(self.path, "wb") as f:
            f.write(data)

    def append_bytes(self, data: bytes):
        with open(self.path, "ab") as f:
            f.write(data)

    def delete(self):
        if self.path.exists():
            self.path.unlink()
        else:
            raise FileNotFoundError(f"File path does not exist (tried to unlink {self.path})")
        
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.delete()
        

def delete_all():
    global temp_files
    for f in temp_files:
        f.delete()
    temp_files.clear()

@contextlib.contextmanager
def zip_temps(files: List[TempFile], og_files: List[UploadFile]):
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".zip")
    zip_path = Path(temp_file.name)
    print('[ZIP] Zip path is', str(zip_path))
    temp_file.close()  # Close it so ZipFile can write to it

    try:
        with zipfile.ZipFile(zip_path, 'w', compression=zipfile.ZIP_DEFLATED) as zipf:
            for list_file, list_og_file in zip(files, og_files):
                zipf.write(list_file.path, arcname=Path(list_og_file.filename).stem + list_file.path.suffix)
        yield zip_path

    finally:
        try:
            # zip_path.unlink()
            # print('[ZIP] Cleanup successful')
            ...
        except FileNotFoundError:
            print('[ZIP] File', str(zip_path), 'not found on cleanup')