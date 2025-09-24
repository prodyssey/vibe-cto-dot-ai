import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/integrations/supabase/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get("difficulty") || "easy";

    const { data, error } = await supabase
      .from("breakout_leaderboard" as any)
      .select("*")
      .eq("difficulty", difficulty)
      .order("score", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching leaderboard:", error);
      return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error("Error in leaderboard GET:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { initials, score, difficulty, linkedin_username } = body;

    // Validate input
    if (!initials || initials.length !== 3) {
      return NextResponse.json({ error: "Initials must be exactly 3 characters" }, { status: 400 });
    }

    if (!score || score <= 0 || score > 50000) {
      return NextResponse.json({ error: "Invalid score" }, { status: 400 });
    }

    if (difficulty !== "easy" && difficulty !== "hard") {
      return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
    }

    // Extract LinkedIn username from various formats
    let cleanUsername = "";
    if (linkedin_username) {
      let username = linkedin_username.trim();
      if (username.includes("linkedin.com/in/")) {
        username = username.split("linkedin.com/in/")[1].split("/")[0].split("?")[0];
      } else if (username.startsWith("@")) {
        username = username.substring(1);
      }
      cleanUsername = username;
    }

    // Save to database
    const { data, error } = await supabase
      .from("breakout_leaderboard" as any)
      .insert({
        initials: initials.toUpperCase(),
        score: score,
        difficulty: difficulty,
        linkedin_username: cleanUsername || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving to leaderboard:", error);
      return NextResponse.json({ error: "Failed to save score" }, { status: 500 });
    }

    // Send Slack notification using centralized system (fire and forget)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXTAUTH_URL || 'http://localhost:3000';
    
    fetch(`${baseUrl}/api/slack-notify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'breakout_score',
        additionalData: {
          initials: initials.toUpperCase(),
          score: score,
          difficulty: difficulty,
          linkedin_username: cleanUsername,
        },
      }),
    }).catch(slackError => {
      console.error("Error sending Slack notification:", slackError);
      // Fire and forget - don't block the main response
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in leaderboard POST:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}