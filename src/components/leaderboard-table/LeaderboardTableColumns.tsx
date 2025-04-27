'use client';

import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "@/types/LeaderboardEntry";

export const LeaderboardTableColumns: ColumnDef<LeaderboardEntry>[] = [
    {
        accessorKey: 'username',
        header: 'Username',
    },
    {
        accessorKey: 'rawWpm',
        header: 'WPM',
    },
    {
        accessorKey: 'accuracy',
        header: 'Accuracy',
    },
    {
        accessorKey: 'date',
        header: 'Date',
    },
]