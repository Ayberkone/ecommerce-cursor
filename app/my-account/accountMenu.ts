import { ShoppingCart, MapPin, User, Key, LogOut, FileText, Send } from "lucide-react"

export const accountMenu = {
  doctor: [
    { key: "orders", label: "Siparişlerim", icon: ShoppingCart },
    { key: "docs", label: "Dökümanlar", icon: FileText },
    { key: "addresses", label: "Adreslerim", icon: MapPin },
    { key: "profile", label: "Hesap Bilgileri", icon: User },
    { key: "password", label: "Parola Ayarları", icon: Key },
    { key: "sample", label: "Numune Talebi", icon: Send },
    { key: "logout", label: "Çıkış", icon: LogOut }
  ],
  pharmacy: [
    { key: "orders", label: "Siparişlerim", icon: ShoppingCart },
    { key: "addresses", label: "Adreslerim", icon: MapPin },
    { key: "profile", label: "Hesap Bilgileri", icon: User },
    { key: "password", label: "Parola Ayarları", icon: Key },
    { key: "logout", label: "Çıkış", icon: LogOut }
  ],
  regular: [
    { key: "orders", label: "Siparişlerim", icon: ShoppingCart },
    { key: "addresses", label: "Adreslerim", icon: MapPin },
    { key: "profile", label: "Hesap Bilgileri", icon: User },
    { key: "password", label: "Parola Ayarları", icon: Key },
    { key: "logout", label: "Çıkış", icon: LogOut }
  ]
}
