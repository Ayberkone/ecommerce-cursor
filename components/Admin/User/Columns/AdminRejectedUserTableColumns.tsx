// components/Admin/AdminRejectedUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { Eye, SquareActivity } from "lucide-react"

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
    cell: (_: any, row: any, triggerAction) => (
      <>
        <button
          className="btn btn-success btn-small"
          onClick={() => triggerAction("reactivate", row)}
          title="Tekrar Aktif Et"
        >
          <SquareActivity size={16} />
        </button>
        <button
          className="btn btn-primary btn-small"
          onClick={() => triggerAction("view", row)}
          title="İncele"
        >
          <Eye size={16} />
        </button>
      </>
    )
  }
]
