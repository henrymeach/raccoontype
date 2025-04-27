import { LeaderboardTable } from "@/components/leaderboard-table/LeaderboardTable";
import { LeaderboardTableColumns } from "@/components/leaderboard-table/LeaderboardTableColumns";
import { entries } from "@/data/LeaderboardEntries";

export default function Leaderboard() {
    const columns = LeaderboardTableColumns;
    const data = entries;

    return (
        <>
            <LeaderboardTable columns={columns} data={data} />
        </>
    )
}