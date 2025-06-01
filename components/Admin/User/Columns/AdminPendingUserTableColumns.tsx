// components/Admin/AdminPendingUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { CheckCheck, Eye, Trash } from "lucide-react"

const USER_TYPE_LABELS: Record<string, string> = {
  pharmacy: "Eczane",
  doctor: "Doktor"
}

export const pendingUserColumns: Column<any>[] = [
  { header: "Ad", accessor: "firstName", sortKey: "firstName" },
  { header: "Soyad", accessor: "lastName", sortKey: "lastName" },
  { header: "E-posta", accessor: "email", sortKey: "email" },
  { header: "Telefon", accessor: "phone" },
  {
    header: "Tür",
    accessor: (row) => USER_TYPE_LABELS[row.type] || row.type,
    sortKey: "type"
  },
  {
    header: "Başvuru Tarihi",
    accessor: (row) => new Date(row.createdAt).toLocaleString("tr-TR"),
    sortKey: "createdAt"
  },
  {
    header: "İşlem",
    accessor: () => "", // No data, just actions
    className: "actions",
    cell: (value, row, triggerAction) => (
      <>
        <button
          onClick={() => triggerAction("approve", row)}
          className="btn btn-success"
          title="Onayla"
        >
          <CheckCheck size={16} />
        </button>
        <button
          onClick={() => triggerAction("view", row)}
          className="btn btn-primary"
          title="İncele"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => triggerAction("reject", row)}
          className="btn btn-danger"
          title="Reddet"
        >
          <Trash size={16} />
        </button>
      </>
    )
  }
]
