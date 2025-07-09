import subprocess
from pathlib import Path
from io import BytesIO
import base64
from utils import get_image_format
from typing import List


class MagickBuffer:
    def __init__(self, input_file: str | Path, input_format: str | None = None, output_format: str | None = None, cmd_save: None | str | Path = None):

        with open(input_file, 'rb') as f:
            self._buffer = f.read()

        self.input_path = str(input_file)

        if cmd_save:
            assert Path(cmd_save).is_dir()

        if input_format:
            self._input_format = input_format
        else:
            self._input_format = get_image_format(input_file)

        if output_format:
            self._output_format = output_format
        else:
            self._output_format = self._input_format

        self.cmd_save = cmd_save
        self.history = []
        print('[BUFFER] Using input format', self._input_format)
        print('[BUFFER] Using output format', self._output_format)

    def cmd(self, args: List[str]):
        magick_command = ['magick', f'{self._input_format}:-',
                *args, f'{self._output_format}:-']

        proc = subprocess.Popen(
            magick_command,   
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        print(
            '[MAGICK] Running command:', ' '.join(magick_command)
        )

        out, err = proc.communicate(input=self._buffer)
        if proc.returncode != 0:
            raise RuntimeError(f"ImageMagick error: {err.decode('utf-8')}")
        self._buffer = out
        self.history.append(list(args))
        if self.cmd_save:
            self.save(Path(self.cmd_save) / ('&'.join(
                ['#'.join(command) for command in self.history]) + '.' + self._output_format))

        self._input_format = self._output_format
        return self

    def save(self, output_file: str | Path):
        with open(str(output_file), 'wb') as f:
            f.write(self._buffer)

    def get_bytes(self):
        return self._buffer

    def to_base64(self):
        return base64.b64encode(self._buffer).decode('utf-8')

    def to_bytesio(self):
        return BytesIO(self._buffer)

    def pipe_to(self, external_cmd):
        proc = subprocess.Popen(external_cmd, stdin=subprocess.PIPE)
        proc.communicate(input=self._buffer)
        return self

    def set_format(self, fmt):
        self._output_format = fmt
        return self
