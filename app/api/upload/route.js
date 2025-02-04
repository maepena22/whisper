import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadsDir() {
  try {
    await fs.access(uploadsDir);
  } catch {
    await fs.mkdir(uploadsDir, { recursive: true });
  }
}

export async function POST(req) {
  try {
    await ensureUploadsDir();

    const formData = await req.formData();
    const file = formData.get('audio');
    const uploaderName = formData.get('uploaderName');
    const description = formData.get('description');

    if (!file || !uploaderName || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a safe filename
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = path.join(uploadsDir, fileName);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(filePath, buffer);

    // Create a File object for OpenAI
    const audioFile = new File([buffer], fileName, { type: file.type });

    // Get transcript using Whisper
    const transcript = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "ja",
      response_format: "verbose_json",
    });

    // Get summary and evaluation using GPT-4
    const summary = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Summarize this Japanese sales pitch transcript"
        },
        {
          role: "user",
          content: transcript.text
        }
      ]
    });

    const evaluation = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Evaluate this Japanese sales pitch transcript. Consider tone, persuasiveness, clarity, and structure. Provide constructive feedback in Japanese."
        },
        {
          role: "user",
          content: transcript.text
        }
      ]
    });

    // Save to database
    const recording = await prisma.recording.create({
      data: {
        uploaderName,
        description,
        audioUrl: `/uploads/${fileName}`,
        transcript: JSON.stringify(transcript),
        summary: summary.choices[0].message.content,
        evaluation: evaluation.choices[0].message.content,
      },
    });

    return NextResponse.json({ success: true, recording });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}