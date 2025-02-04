import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    
    // Get recording details
    const recording = await prisma.recording.findUnique({
      where: { id },
    });

    if (!recording) {
      return NextResponse.json(
        { success: false, error: 'Recording not found' },
        { status: 404 }
      );
    }

    // Delete the audio file
    const audioPath = path.join(process.cwd(), 'public', recording.audioUrl);
    try {
      await fs.unlink(audioPath);
    } catch (error) {
      console.error('Error deleting audio file:', error);
    }

    // Delete from database
    await prisma.recording.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}