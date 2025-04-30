import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

// fetches the row count of the leaderboard
export async function fetchLeaderboardRowCount() {
    const { count, error } = await supabase
        .from('scores_view')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching leaderboard row count', error);
        return null;
    }

    return count;
}

// fetches all leaderboard data
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

// fetches a range of data, not all of it
export async function fetchNextLeaderboardData({page, page_size}: {
    page: number;
    page_size: number;
}) {
    // Supabase's starts from the 0-th index
    const from = (page - 1) * page_size
    const to = from + page_size - 1

    const { data, error } = await supabase
        .from('scores_view')
        .select()
        .order('wpm', { ascending: false })
        .range(from, to);

    if (error) {
        console.error('Error fetching next leaderboard data', error);
        return null;
    }

    return data;
}

// inserts data into the leaderboard
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