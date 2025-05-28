import React from "react"
import styles from "./Table.module.scss"

type Column<T> = {
	header: React.ReactNode
	accessor: keyof T | ((row: T) => React.ReactNode)
	cell?: (value: any, row: T) => React.ReactNode
	className?: string
}

type TableProps<T> = {
	columns: Column<T>[]
	data: T[]
	rowKey: (row: T, idx: number) => React.Key
	className?: string
}

export function Table<T>({ columns, data, rowKey, className }: TableProps<T>) {
	return (
		<div className={`${styles.tableWrap} ${className || ""}`}>
			<table className={styles.table}>
				<thead>
					<tr>
						{columns.map((col, i) => (
							<th key={i} className={col.className}>{col.header}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((row, rowIdx) => (
						<tr key={rowKey(row, rowIdx)}>
							{columns.map((col, colIdx) => {
								let value: any
								if (typeof col.accessor === "function") {
									value = col.accessor(row)
								} else {
									value = row[col.accessor]
								}
								return (
									<td key={colIdx} className={col.className}>
										{col.cell ? col.cell(value, row) : value}
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}