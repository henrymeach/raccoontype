import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export async function fetchLeaderboardData() {
    const { data, error } = await supabase
        .from('scores_view')
        .select()
        .order('wpm', { ascending: false });

    if (error) {
        console.error('Error fetching leaderboard data', error);
        return null;
    }

    return data;
}

export async function insertDataToLeaderboard({username, raw_wpm, accuracy}: {
    username: string;
    raw_wpm: number;
    accuracy: number;
}) {
    const { data, error } = await supabase
        .from('SCORES')
        .insert([
            {
                username: username,
                raw_wpm: raw_wpm,
                accuracy: accuracy,
                date: new Date(),
            }
        ]);

    if (error) {
        console.error('Error submitting score data to leaderboard.', error);
        return null;
    }

    return data;
}