import { Order } from "@/types/Order"
import { refundOrder } from "@/utils/ordersApi"
import { toast } from "sonner"

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
  },
  {
    header: "İşlem",
    accessor: (row: any) => row, // Tam satırı gönderiyoruz
    cell: (_: any, row: any, triggerAction: any) => {
      // Yalnızca “pending” veya “paid” durumunda göster
      const canRefund = row.paymentStatus === "paid" && !row.cancelled && !row.refunded
      return canRefund ? (
        <button
          className="btn btn-danger btn-sm"
          onClick={async () => {
            if (!window.confirm("Bu siparişi iade etmek istediğinize emin misiniz?")) return
            try {
              await refundOrder(row.merchant_oid, Math.round(row.total * 100))
              toast.success("İade başlatıldı!")
              if (triggerAction) triggerAction("refresh", row)
            } catch (err: any) {
              toast.error(err.message || "İade başarısız!")
            }
          }}
        >
          İade Et
        </button>
      ) : null
    },
  },
]
