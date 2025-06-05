// /components/Admin/AdminUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { Trash, CheckCheck, X, Check } from 'lucide-react'

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
      <span
        id={value}
        title={row?.emailVerified ? "E-posta doğrulandı" : "E-posta doğrulanmadı"}
        style={{ cursor: "help", display: "inline-flex", alignItems: "center", gap: 4 }}
        tabIndex={0}
        aria-label={row?.emailVerified ? "E-posta doğrulandı" : "E-posta doğrulanmadı"}
        onFocus={e => e.currentTarget.setAttribute("data-show-tooltip", "true")}
        onBlur={e => e.currentTarget.removeAttribute("data-show-tooltip")}
        onMouseEnter={e => e.currentTarget.setAttribute("data-show-tooltip", "true")}
        onMouseLeave={e => e.currentTarget.removeAttribute("data-show-tooltip")}
      >
        {value}
        {row?.emailVerified ? (
          <Check size={16} className="btn-success" style={{ marginLeft: 4 }} />
        ) : (
          <X size={16} className="btn-danger" style={{ marginLeft: 4 }} />
        )}
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
    cell: (value, row, triggerAction) => {
      // Status badge
      let badge;
      switch (row.status) {
        case "banned":
          badge = <span className="badge badge-danger">Yasaklı</span>
          break
        case "disabled":
          badge = <span className="badge badge-secondary">Pasif</span>
          break
        case "active":
          badge = <span className="badge badge-success">Aktif</span>
          break
        default:
          badge = <span className="badge badge-warning">Bilinmiyor</span>
      }

      // Dropdown for status actions
      return (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {badge}
          <select
            style={{ marginLeft: 8 }}
            aria-label="Durum değiştir"
            defaultValue=""
            onChange={e => {
              const action = e.target.value
              if (!action) return
              if (action === "disable") triggerAction("disable", row)
              if (action === "enable") triggerAction("enable", row)
              if (action === "ban") triggerAction("ban", row)
              e.target.value = ""
            }}
          >
            <option value="" disabled>Durum Değiştir</option>
            {row.status === "active" && (
              <option value="disable">Devre Dışı Bırak</option>
            )}
            {row.status === "disabled" && (
              <option value="enable">Etkinleştir</option>
            )}
            {row.status !== "banned" && (
              <option value="ban">Yasakla</option>
            )}
          </select>
        </div>
      )
    }
  },
  {
    header: "İşlemler",
    accessor: (row: any) => row._id,
    className: "actions",
    cell: (value, row, triggerAction) => (
      <>
        <button
          onClick={() => triggerAction("delete", row)}
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
