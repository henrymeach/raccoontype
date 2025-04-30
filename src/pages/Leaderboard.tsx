import { LeaderboardTable } from "@/components/leaderboard-table/LeaderboardTable";
import { LeaderboardTableColumns } from "@/components/leaderboard-table/LeaderboardTableColumns";
import { fetchLeaderboardRowCount, fetchNextLeaderboardData } from "@/data/LeaderboardDataActions";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

export default function Leaderboard() {
    // search params
    const [searchParams, setSearchParams] = useSearchParams();
    const pageParam = Number(searchParams.get('page'));

    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(pageParam ? pageParam : 1);
    const [rowCount, setRowCount] = useState<number>(0);
    const pageSize = 10;
    const columns = LeaderboardTableColumns({page: page, pageSize: pageSize});

    const handlePageChange = (page: number) => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            newParams.set('page', page.toString());
            return newParams;
        });
        setPage(page);
    }

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
            <LeaderboardTable columns={columns} data={data} page={page} pageSize={pageSize} handlePageChange={handlePageChange} rowCount={rowCount} />
        </div>
    )
}