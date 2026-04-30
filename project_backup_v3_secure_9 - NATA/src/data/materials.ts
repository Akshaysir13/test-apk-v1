// src/data/materials.ts
// Foundation-only study materials (PDFs, docs) via Google Drive links

export interface Material {
  id: string;
  title: string;
  description?: string;
  url: string; // Google Drive share link (Anyone with link can view)
  type: 'pdf' | 'document' | 'video';
}

/**
 * Materials for Foundation students only.
 * Add your Google Drive links here:
 * 1. Upload PDF to Google Drive
 * 2. Right-click → Share → "Anyone with the link" → Copy link
 * 3. Paste the link in the url field
 */
export const foundationMaterials: Material[] = [
  {
    id: '1',
    title: 'July Batch Study Notes',
    description: 'Hand written notes of Foundation Batch',
    url: 'https://drive.google.com/file/d/17eJgabt9CLjX4q05CBJy5zBGM9ZYCFPJ/view?usp=drive_link',
    type: 'pdf'
  },
  {
    id: '2',
    title: 'Study Material',
    description: 'Course study material',
    url: 'https://drive.google.com/file/d/1LIPolw7cTriN6Tlg0oC8Vc6bAkTjDSd4/view?usp=drive_link',
    type: 'pdf'
  },
  {
    id: '3',
    title: 'Chemistry Formula Sheet',
    description: 'Quick reference for exam',
    url: 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing',
    type: 'pdf'
  },
  {
    id: '4',
    title: 'Mathematics PYQ Solutions',
    description: 'Previous year question solutions',
    url: 'https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing',
    type: 'pdf'
  }
];
