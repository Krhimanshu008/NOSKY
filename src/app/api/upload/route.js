import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const isAuthenticated = await verifyAuth();
    if (!isAuthenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const finalName = `${uniqueSuffix}-${filename}`;
    
    // Save to public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filepath = path.join(uploadDir, finalName);
    
    // Ensure the directory exists (we can rely on Node.js fs/promises to create it if we wanted, but we'll try catching error if missing)
    try {
      await writeFile(filepath, buffer);
    } catch (e) {
      if (e.code === 'ENOENT') {
        const fs = require('fs');
        fs.mkdirSync(uploadDir, { recursive: true });
        await writeFile(filepath, buffer);
      } else {
        throw e;
      }
    }

    return NextResponse.json({ url: `/uploads/${finalName}` });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
