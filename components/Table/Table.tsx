// components/Table/Table.tsx

import React, { useEffect, useState, useCallback, useRef, useMemo } from "react"
import styles from "./Table.module.scss"
import { api } from "@/utils/api"
import { ChevronDown, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react"

export type Column<T> = {
	header: React.ReactNode | string
	accessor: keyof T | ((row: T) => React.ReactNode)
	cell?: (value: any, row: T, triggerAction?: any) => React.ReactNode
	className?: string
	sortKey?: string  // used for API sortField
}

export type TableProps<T> = {
	endpoint: string // API endpoint to fetch data (must return {data, count})
	params?: string // additional query params to append to the endpoint
	columns: Column<T>[]
	rowKey: (row: T, idx: number) => React.Key
	className?: string
	noDataMessage?: string
	pageSizeOptions?: number[]
	initialSortField?: string
	initialSortOrder?: "asc" | "desc"
	searchPlaceholder?: string
	onAction?: (action: string, row: T) => void
	refresh?: boolean // prop to trigger data refresh
	children?: React.ReactNode
}

const DEBOUNCE_DELAY = 500

export function Table<T>({
	endpoint,
	params = "",
	columns,
	rowKey,
	className,
	noDataMessage,
	pageSizeOptions = [10, 20, 50, 100],
	initialSortField = "createdAt",
	initialSortOrder = "desc",
	searchPlaceholder = "Ara...",
	onAction,
	refresh,
	children
}: TableProps<T>) {
	const [data, setData] = useState<T[]>([])
	const [count, setCount] = useState(0)
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(pageSizeOptions[2])
	const [search, setSearch] = useState("")
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
	const [sortField, setSortField] = useState(initialSortField)
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder)
	const [loading, setLoading] = useState(true)

	const timeoutRef = useRef<NodeJS.Timeout | null>(null)

	// Fetch data
	const fetchData = useCallback(() => {
		setLoading(true)
		api<{ users?: T[], data?: T[], count: number }>(
			`${endpoint}?page=${page}&limit=${limit}&search=${encodeURIComponent(debouncedSearchTerm)}&sortField=${sortField}&sortOrder=${sortOrder}${params ? `&${params}` : ""}`,
		).then(res => {
			// If API returns users or data array (be flexible)
			setData((res.data || res.users || []) as T[])
			setCount(res.count || 0)
		}).finally(() => setLoading(false))
	}, [endpoint, params, page, limit, debouncedSearchTerm, sortField, sortOrder])

	useEffect(() => {
		fetchData()
	}, [fetchData, refresh])

	// Sorting
	function handleSort(col: Column<T>) {
		if (!col.sortKey) return
		if (sortField === col.sortKey) {
			setSortOrder(o => o === "asc" ? "desc" : "asc")
		} else {
			setSortField(col.sortKey)
			setSortOrder("asc")
		}
	}

	function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
		const value = e.target.value
		setSearch(value)
		setPage(1)
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current)
		}
		timeoutRef.current = setTimeout(() => {
			setDebouncedSearchTerm(value)
		}, DEBOUNCE_DELAY)
	}

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}
		}
	}, [debouncedSearchTerm, page])

	// Pagination controls
	const totalPages = Math.ceil(count / limit)

	const funtionsDisabled = useMemo(() => !data || data.length === 0, [data])

	const checkFunctionsDisabled = (func: any) => {
		if (funtionsDisabled) {
			return
		}
		return func()
	}

	return (
		<div className={`${styles.tableWrap} ${className || ""}`}>
			{/* Search and limit selector */}
			<div className={styles.tableControls}>
				{children && <div className={styles.tableToolbar}>{children}</div>}
				<input
					type="text"
					placeholder={searchPlaceholder}
					value={search}
					onChange={funtionsDisabled ? handleSearch : undefined}
					className={styles.searchInput}
					disabled={funtionsDisabled}
				/>
			</div>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map((col, i) => (
							<th
								key={i}
								className={col.className}
								onClick={() => !funtionsDisabled && col.sortKey && handleSort(col)}
								style={col.sortKey ? { cursor: "pointer" } : {}}
							>
								{col.header}
								{col.sortKey === sortField && (
									<span style={{ marginLeft: 6, display: "inline-flex", alignItems: "center" }}>
										{sortOrder === "asc" ? (
											<ChevronUp size={16} />
										) : (
											<ChevronDown size={16} />
										)}
									</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={columns.length} className={styles.noData}>Yükleniyor...</td>
						</tr>
					) : data.length === 0 ? (
						<tr>
							<td colSpan={columns.length} className={styles.noData}>{noDataMessage || "Kayıt yok"}</td>
						</tr>
					) : (
						data.map((row, rowIdx) => (
							<tr key={rowKey(row, rowIdx)}>
								{columns.map((col, colIdx) => {
									let value: any
									if (typeof col.accessor === "function") value = col.accessor(row)
									else value = row[col.accessor]
									return (
										<td key={colIdx} className={col.className}>
											{col.cell
												? col.cell(value, row, (action: string) => onAction?.(action, row))
												: value}
										</td>
									)
								})}
							</tr>
						))
					)}
				</tbody>
			</table>
			{/* Pagination */}
			<div className={styles.pagination}>
				<button className="btn btn-small" disabled={page === 1} onClick={() => checkFunctionsDisabled(setPage(1))}>
					<ChevronFirst size={18} />
				</button>
				<button className="btn btn-small" disabled={page === 1} onClick={() => checkFunctionsDisabled(setPage(p => Math.max(1, p - 1)))}>
					<ChevronLeft size={18} />
				</button>
				<input
					type="number"
					min={1}
					max={totalPages || 1}
					value={page}
					disabled={funtionsDisabled}
					onChange={e => {
						if (funtionsDisabled) return
						let val = Number(e.target.value)
						if (isNaN(val)) val = 1
						val = Math.max(1, Math.min(totalPages || 1, val))
						setPage(val)
					}}
					style={{ width: 30, textAlign: "center", marginRight: 8 }}
				/>
				<span> / {totalPages || 1}</span>
				<button className="btn btn-small" disabled={page === totalPages} onClick={() => checkFunctionsDisabled(setPage(p => Math.min(totalPages, p + 1)))}>
					<ChevronRight size={18} />
				</button>
				<button className="btn btn-small" disabled={page === totalPages} onClick={() => checkFunctionsDisabled(setPage(totalPages))}>
					<ChevronLast size={18} />
				</button>
				<select
					value={limit}
					disabled={funtionsDisabled}
					onChange={e => {
						if (funtionsDisabled) return
						setLimit(Number(e.target.value))
						setPage(1)
					}}
				>
					{pageSizeOptions.map(val => <option key={val} value={val}>{val}</option>)}
				</select>
			</div>
		</div>
	)
}