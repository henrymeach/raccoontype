import { LeaderboardTable } from "@/components/leaderboard-table/LeaderboardTable";
import { LeaderboardTableColumns } from "@/components/leaderboard-table/LeaderboardTableColumns";
import { fetchLeaderboardRowCount, fetchNextLeaderboardData } from "@/data/LeaderboardDataActions";
import { useEffect, useState } from "react";

export default function Leaderboard() {
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [rowCount, setRowCount] = useState<number>(0);
    const pageSize = 10;
    const columns = LeaderboardTableColumns({page: page, pageSize: pageSize});

    // get a range of data based on page and page size
    useEffect(() => {
        const loadData = async () => {
            const leaderboardData = await fetchNextLeaderboardData({page: page, page_size: pageSize});
            if (leaderboardData) setData(leaderboardData);
        }

        loadData();
    }, [page])

    // get the row count
    useEffect(() => {
        const loadRowCount = async () => {
            const leaderboardRowCount = await fetchLeaderboardRowCount();
            if (leaderboardRowCount) setRowCount(leaderboardRowCount);
        }

        loadRowCount();
    }, [])

    return (
        <div className="my-10 space-y-10">
            <h1 className="title-secondary text-5xl font-medium">
                Leaderboard
            </h1>
            <LeaderboardTable columns={columns} data={data} page={page} pageSize={pageSize} handlePageChange={(page:number) => setPage(page)} rowCount={rowCount} />
        </div>
    )
}