import { createAdminClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload a JPG, PNG, or WebP image.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${timestamp}-${randomId}.${extension}`;

    // Convert File to ArrayBuffer then to Buffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage
    const supabase = createAdminClient();
    const { data, error } = await supabase.storage
      .from('review-photos')
      .upload(filename, buffer, {
        contentType: file.type,
        cacheControl: '3600',
      });

    if (error) {
      console.error('Storage upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('review-photos')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
      path: data.path
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
