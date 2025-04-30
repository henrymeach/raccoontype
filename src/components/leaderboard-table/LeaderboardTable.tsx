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
    page: number,
    pageSize: number,
    rowCount: number,
    handlePageChange: (page: number) => void
};

export function LeaderboardTable<TData, TValue>({
    columns,
    data,
    page,
    pageSize,
    rowCount,
    handlePageChange,
}: LeaderboardTableProps<TData, TValue>) {

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        autoResetPageIndex: true,
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
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className='bg-[#382f25] hover:bg-[#4f4334] leaderboard-row h-16'>
                                {row.getVisibleCells().map((cell, index) => {
                                    const isFirst = (index === 0)
                                    const isLast = (index === row.getVisibleCells().length - 1)

                                    return (
                                    <TableCell key={cell.id} className={clsx(
                                        '',
                                        isFirst
                                        ? 'rounded-l-md'
                                        : isLast
                                        ? 'rounded-r-md'
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
                            <TableCell colSpan={columns.length} className='bg-[#382f25] rounded-md h-64 leaderboard-row text-center'>
                                <p>No results found.</p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <div className='relative flex items-center md:justify-center space-x-2 py-4'>
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className='bg-[#6d5131] hover:bg-[#523d25] active:bg-[#40301d] disabled:opacity-20 disabled:cursor-not-allowed rounded cursor-pointer p-2'
                >
                    <img src='/icons/left.svg' />
                </button>
                <div className='px-2'>
                    <p className='leaderboard-row !text-xl font-bold'>
                        {page}
                    </p>
                </div>
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={(page)*pageSize >= rowCount}
                    className='bg-[#6d5131] hover:bg-[#523d25] active:bg-[#40301d] disabled:opacity-20 disabled:cursor-not-allowed rounded cursor-pointer p-2'
                >
                    <img src='/icons/right.svg' />
                </button>
                <div className='absolute right-4'>
                    <p className='leaderboard-row !text-sm'>
                        {`Showing ${(page-1)*pageSize+1}-${Math.min(page*pageSize, rowCount)} of ${rowCount} scores`}
                    </p>
                </div>
            </div>
        </div>
    )
}