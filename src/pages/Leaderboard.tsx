import { LeaderboardTable } from "@/components/leaderboard-table/LeaderboardTable";
import { LeaderboardTableColumns } from "@/components/leaderboard-table/LeaderboardTableColumns";
import { fetchLeaderboardData } from "@/data/LeaderboardDataActions";
import { useEffect, useState } from "react";

export default function Leaderboard() {
    const columns = LeaderboardTableColumns;
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const loadData = async () => {
            const leaderboardData = await fetchLeaderboardData();
            if (leaderboardData) setData(leaderboardData);
        }
        
        loadData();
    }, [])

    return (
        <div className="my-10 space-y-10">
            <h1 className="title-secondary text-5xl font-medium">
                Leaderboard
            </h1>
            <LeaderboardTable columns={columns} data={data} />
        </div>
    )
}