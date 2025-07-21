// +page.server.ts

import fs from 'fs';
import path from 'path';
import type { PageServerLoad } from './$types';

type LicenseFile = {
  filename: string;
  content: string;
};

export const load: PageServerLoad = async () => {
  const dirPath = path.resolve('src/lib/licenses');

  let files: LicenseFile[] = [];

  try {
    const filenames = fs.readdirSync(dirPath);

    files = filenames.map((filename) => {
      const fullPath = path.join(dirPath, filename);
      const content = fs.readFileSync(fullPath, 'utf-8');
      return { filename, content };
    });
  } catch (err) {
    console.error('Error reading license files:', err);
  }

  return {
    licenses: files
  };
};
