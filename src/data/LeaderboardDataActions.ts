import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

export async function fetchLeaderboardData() {
    const { data, error } = await supabase
        .from('SCORES')
        .select()
        .order('raw_wpm', { ascending: false });

    if (error) {
        console.error('Error fetching leaderboard data', error);
        return null;
    }

    return data;
}

