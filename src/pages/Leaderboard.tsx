import { LeaderboardTable } from "@/components/leaderboard-table/LeaderboardTable";
import { LeaderboardTableColumns } from "@/components/leaderboard-table/LeaderboardTableColumns";
import { entries } from "@/data/LeaderboardEntries";

export default function Leaderboard() {
    const columns = LeaderboardTableColumns;
    const data = entries;

    return (
        <div className="my-10 space-y-10">
            <h1 className="title-secondary text-5xl font-medium">
                Leaderboard
            </h1>
            <LeaderboardTable columns={columns} data={data} />
        </div>
    )
}