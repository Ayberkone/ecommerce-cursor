import { Order } from "@/types/Order"

// columns/MyAccountOrdersColumns.ts
export const myAccountOrdersColumns = [
  {
    header: "Kod",
    accessor: (row: Order) => row._id,
    sortKey: "_id"
  },
  {
    header: "Tarih",
    accessor: (row: Order) => new Date(row.createdAt).toLocaleDateString("tr-TR"),
    sortKey: "createdAt"
  },
  {
    header: "Tutar",
    accessor: (row: Order) => `${row.total}₺`,
    sortKey: "total"
  },
  {
    header: "Durum",
    accessor: (row: Order) => row.status,
    sortKey: "status"
  },
  {
    header: "Ürün",
    accessor: (row: Order) => row.items?.length || 0
  },
  {
    header: "Görünüm",
    accessor: (row: Order) => row._id,
    cell: (id: string) => <a href={`/my-account/orders/${id}`}>Detay</a>
  }
]
