// components/Admin/AdminRejectedUserTableColumns.ts
import { Column } from "@/components/Table/Table"

export const rejectedUserColumns: Column<any>[] = [
  { header: "İsim", accessor: "name", sortKey: "name" },
  { header: "E-posta", accessor: "email", sortKey: "email" },
  { header: "Telefon", accessor: "phone" },
  { header: "Reddetme Notu", accessor: "adminNote" },
  {
    header: "Reddedilme Tarihi",
    accessor: (row) => new Date(row.approvalDate).toLocaleString("tr-TR"),
    sortKey: "approvalDate"
  },
  {
    header: "İşlem",
    accessor: () => "",
    className: "actions",
    cell: (_: any, row: any) => (
      <button className="btn btn-primary btn-small" onClick={() => window.dispatchEvent(new CustomEvent("admin:reactivate", { detail: row }))}>
        Tekrar İncele
      </button>
    )
  }
]
