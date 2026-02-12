"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Search, Filter } from "lucide-react"
import styles from "./dashboard.module.css"

interface Order {
  id: string
  customer_phone: string
  items: Array<{
    productId: string
    name: string
    quantity: number
    price: number
  }>
  total_amount: number
  status: "pending" | "confirmed" | "processing" | "completed" | "cancelled"
  notes: string
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [adminUser, setAdminUser] = useState<any>(null)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("adminToken")
    const user = localStorage.getItem("adminUser")

    if (!token || !user) {
      router.push("/admin/login")
      return
    }

    setAdminUser(JSON.parse(user))
    fetchOrders(token)
  }, [router])

  const fetchOrders = async (token: string) => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("adminToken")
          localStorage.removeItem("adminUser")
          router.push("/admin/login")
        }
        return
      }

      const data = await response.json()
      setOrders(data.orders || [])
      filterOrders(data.orders || [], searchQuery, statusFilter)
    } catch (error) {
      console.error("[v0] Failed to fetch orders:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrders = (allOrders: Order[], search: string, status: string) => {
    let filtered = allOrders

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status)
    }

    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.customer_phone.includes(search) ||
          order.id.includes(search) ||
          order.items.some((item) => item.name.toLowerCase().includes(search.toLowerCase()))
      )
    }

    setFilteredOrders(filtered)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterOrders(orders, query, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterOrders(orders, searchQuery, status)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    router.push("/admin/login")
  }

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!token) return

      const response = await fetch("/api/orders", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus as any } : order
        )
        setOrders(updatedOrders)
        filterOrders(updatedOrders, searchQuery, statusFilter)
      }
    } catch (error) {
      console.error("[v0] Failed to update order status:", error)
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>Sansai Admin</h1>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{adminUser?.name || "Admin"}</span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="text"
              placeholder="Search by phone, order ID, or product..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filters}>
            <Filter size={18} />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className={styles.ordersSection}>
          <h2 className={styles.sectionTitle}>Orders ({filteredOrders.length})</h2>

          {isLoading ? (
            <div className={styles.loading}>Loading orders...</div>
          ) : filteredOrders.length === 0 ? (
            <div className={styles.empty}>No orders found</div>
          ) : (
            <div className={styles.ordersGrid}>
              {filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3 className={styles.orderId}>Order #{order.id.slice(0, 8)}</h3>
                      <p className={styles.phone}>{order.customer_phone}</p>
                    </div>
                    <span className={`${styles.statusBadge} ${styles[order.status]}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className={styles.orderItems}>
                    <p className={styles.itemsLabel}>Items ({order.items.length}):</p>
                    <ul className={styles.itemsList}>
                      {order.items.map((item, idx) => (
                        <li key={idx} className={styles.item}>
                          {item.quantity}x {item.name}
                          <span className={styles.price}>₹{(item.price * item.quantity).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.total}>
                      <span>Total:</span>
                      <span className={styles.amount}>₹{order.total_amount.toLocaleString()}</span>
                    </div>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className={styles.statusSelect}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <p className={styles.timestamp}>
                    {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
