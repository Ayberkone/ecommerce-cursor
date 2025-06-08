// /components/Admin/AdminUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { Trash, CheckCheck, X, Check, Eye } from 'lucide-react'

const USER_TYPE_LABELS: Record<string, string> = {
  regular: "Normal",
  pharmacy: "Eczane",
  doctor: "Doktor",
  admin: "Admin"
}

export const userColumns: Column<any>[] = [
  { header: "Ad", accessor: "firstName", sortKey: "firstName" },
  { header: "Soyad", accessor: "lastName", sortKey: "lastName" },
  {
    header: "E-posta", accessor: "email", sortKey: "email",
    cell: (value, row, triggerAction) => (
      <span className="df-aic">
        {row?.emailVerified ? (
          <Check size={16} className="btn-success" style={{ marginLeft: 4 }} />
        ) : (
          <X size={16} className="btn-danger" style={{ marginLeft: 4 }} />
        )}
        <span className="ml-8">
          {value}
        </span>
      </span>
    )
  },
  { header: "Telefon", accessor: "phone" },
  {
    header: "Tür",
    accessor: (row: any) => USER_TYPE_LABELS[row.type] || row.type,
    sortKey: "type"
  },
  {
    header: "Kayıt Tarihi",
    accessor: (row: any) => new Date(row.createdAt).toLocaleDateString("tr-TR"),
    sortKey: "createdAt"
  },
  {
    header: "Durum",
    accessor: (row: any) => {
      switch (row.status) {
        case "banned":
          return "Yasaklı"
        case "disabled":
          return "Pasif"
        case "active":
          return "Aktif"
        default:
          return "Bilinmiyor"
      }
    },
    sortKey: "status",
    cell: (value, row, triggerAction) => (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <select
          style={{ minWidth: 120 }}
          aria-label="Durum değiştir"
          value={row.status}
          onChange={e => {
            const action = e.target.value
            if (!action || action === row.status) return
            if (action === "disabled") triggerAction("disable", row)
            if (action === "active") triggerAction("enable", row)
            if (action === "banned") triggerAction("ban", row)
          }}
        >
          <option value="active">Aktif</option>
          <option value="disabled">Pasif</option>
          <option value="banned">Yasaklı</option>
        </select>
      </div>
    )
  },
  {
    header: "İşlemler",
    accessor: (row: any) => row._id,
    className: "actions",
    cell: (value, row, triggerAction) => (
      <>
        <button
          className="btn btn-primary btn-small"
          onClick={() => triggerAction("view", row)}
          title="İncele"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={() => triggerAction("disable", row)}
          className="btn btn-danger"
          title="Sil"
        >
          <Trash size={16} />
        </button>
      </>
    )
  }
  // You can add action buttons, etc here as needed
]
