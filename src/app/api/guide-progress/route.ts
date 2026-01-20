import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET - fetch user's completed chapters
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ completedChapters: [] });
    }

    const { data, error } = await supabase
      .from('guide_progress')
      .select('chapter_slug, completed_at')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching guide progress:', error);
      return NextResponse.json({ completedChapters: [] });
    }

    return NextResponse.json({
      completedChapters: data.map(d => d.chapter_slug),
      progress: data,
    });
  } catch (error) {
    console.error('Error in guide-progress GET:', error);
    return NextResponse.json({ completedChapters: [] });
  }
}

// POST - mark chapter as complete
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { chapterSlug } = await request.json();

    if (!chapterSlug) {
      return NextResponse.json(
        { error: 'Chapter slug is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('guide_progress')
      .insert({
        user_id: user.id,
        chapter_slug: chapterSlug,
      });

    if (error) {
      // If already exists, that's fine
      if (error.code === '23505') {
        return NextResponse.json({ success: true, alreadyCompleted: true });
      }
      console.error('Error marking chapter complete:', error);
      return NextResponse.json(
        { error: 'Failed to mark chapter complete' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in guide-progress POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - mark chapter as incomplete
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { chapterSlug } = await request.json();

    if (!chapterSlug) {
      return NextResponse.json(
        { error: 'Chapter slug is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('guide_progress')
      .delete()
      .eq('user_id', user.id)
      .eq('chapter_slug', chapterSlug);

    if (error) {
      console.error('Error marking chapter incomplete:', error);
      return NextResponse.json(
        { error: 'Failed to mark chapter incomplete' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in guide-progress DELETE:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
