// /components/Admin/AdminUserTableColumns.ts
import { Column } from "@/components/Table/Table"
import { Trash, CheckCheck } from 'lucide-react'

const USER_TYPE_LABELS: Record<string, string> = {
  regular: "Normal",
  pharmacy: "Eczane",
  doctor: "Doktor",
  admin: "Admin"
}

export const userColumns: Column<any>[] = [
  { header: "Ad", accessor: "firstName", sortKey: "firstName" },
  { header: "Soyad", accessor: "lastName", sortKey: "lastName" },
  { header: "E-mail", accessor: "email", sortKey: "email" },
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
    header: "İşlemler",
    accessor: (row: any) => row._id,
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
