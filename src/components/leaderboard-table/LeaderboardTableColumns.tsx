'use client';

import { ColumnDef } from "@tanstack/react-table";
import { LeaderboardEntry } from "@/types/LeaderboardEntry";

export const LeaderboardTableColumns: ColumnDef<LeaderboardEntry>[] = [
    {
        accessorKey: ' ',
        header: () => <div className="flex items-center justify-center scale-85"><img src="/icons/trophy.svg" /></div>,
        cell: ({row}) => {
            const rank = row.index + 1
            return <div className="text-center">{rank}</div>
        }
    },
    {
        accessorKey: 'username',
        header: 'Username',
    },
    {
        header: 'WPM',
        cell: ({row}) => {
            const rawWpm: number = row.getValue('raw_wpm');
            const accuracy: number = row.getValue('accuracy');
            const wpm = Math.round((rawWpm * accuracy) * 100) / 100
            return <div className="font-black">{wpm}</div>
        }
    },
    {
        accessorKey: 'raw_wpm',
        header: 'Raw WPM',
        cell: ({row}) => {
            const rawWpm: number = row.getValue('raw_wpm');
            const formatted = Math.round(rawWpm * 100) / 100;
            return <div>{formatted}</div>
        }
    },
    {
        accessorKey: 'accuracy',
        header: 'Accuracy',
        cell: ({row}) => {
            const formatted = `${Math.round(row.getValue<number>('accuracy') * 10000) / 100}%`
            return <div>{formatted}</div>
        }
    },
    {
        accessorKey: 'date',
        header: () => <div>Date</div>,
        cell: ({row}) => {
            const dateString: string = row.getValue('date');
            const date: Date = new Date(dateString);

            const formatted = `${date.toLocaleString('default', {dateStyle: 'medium'})}`
            return <div>{formatted}</div>
        }
    },
]