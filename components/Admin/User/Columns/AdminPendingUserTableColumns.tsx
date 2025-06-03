// components/Admin/AdminPendingUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { Check, CheckCheck, Eye, X } from "lucide-react"

const USER_TYPE_LABELS: Record<string, string> = {
  pharmacy: "Eczane",
  doctor: "Doktor"
}

export const pendingUserColumns: Column<any>[] = [
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
          <X size={16} />
        </button>
      </>
    )
  }
]
