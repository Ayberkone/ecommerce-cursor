// components/Admin/AdminPendingUserTableColumns.ts
import { Column } from "@/components/Table/Table"

const USER_TYPE_LABELS: Record<string, string> = {
  pharmacy: "Eczane",
  doctor: "Doktor"
}

export const pendingUserColumns: Column<any>[] = [
  { header: "İsim", accessor: "name", sortKey: "name" },
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
    cell: (_: any, row: any) => (
      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn btn-primary btn-small" onClick={() => window.dispatchEvent(new CustomEvent("admin:approve", { detail: row }))}>
          Onayla
        </button>
        <button className="btn btn-danger btn-small" onClick={() => window.dispatchEvent(new CustomEvent("admin:reject", { detail: row }))}>
          Reddet
        </button>
      </div>
    )
  }
]
