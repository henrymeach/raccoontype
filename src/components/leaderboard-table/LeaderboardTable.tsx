'use client';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/Table'
import clsx from 'clsx';

interface LeaderboardTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
};

export function LeaderboardTable<TData, TValue>({
    columns,
    data,
}: LeaderboardTableProps<TData, TValue>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div>
            <Table className='border-separate border-spacing-y-1'>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className='leaderboard-header'>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='bg-[#3b3228] leaderboard-row h-16'>
                                {row.getVisibleCells().map((cell, index) => {
                                    const isFirst = (index === 0)
                                    const isLast = (index === row.getVisibleCells().length - 1)

                                    return (
                                    <TableCell key={cell.id} className={clsx(
                                        '',
                                        isFirst
                                        ? 'rounded-l-xl'
                                        : isLast
                                        ? 'rounded-r-xl'
                                        : ''
                                    )}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                    )
                                })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className='h-24 text-center'>
                                No results found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}