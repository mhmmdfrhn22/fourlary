"use client"

import * as React from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import Swal from "sweetalert2"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// API URL
const API_URL = "https://backend-fourlary-production.up.railway.app/api/user"

// 🔹 Helper: role name
const getRoleName = (role_id) => {
  switch (role_id) {
    case 2: return "Admin"
    case 3: return "Tim Publikasi"
    default: return "Guest"
  }
}

const getRoleId = (role) => {
  switch (role) {
    case "Admin": return 2
    case "Tim Publikasi": return 3
    default: return 1
  }
}

// 🔹 Hook cek mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth < 768) // < md
    checkScreen()
    window.addEventListener("resize", checkScreen)
    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  return isMobile
}

export default function ManajemenUser() {
  const [data, setData] = React.useState([])
  const [search, setSearch] = React.useState("")
  const [filterRole, setFilterRole] = React.useState("All")
  const [sortOption, setSortOption] = React.useState("joinedAt")
  const [editingUser, setEditingUser] = React.useState(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [openAddDialog, setOpenAddDialog] = React.useState(false)
  const usersPerPage = 8
  const isMobile = useIsMobile()

  // 🔹 Ambil data user
  React.useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const users = await res.json()
        if (Array.isArray(users)) {
          setData(
            users.map((u) => ({
              ...u,
              role: getRoleName(u.role_id),
              joinedAt: u.created_at,
              email: u.email,  // Menambahkan email ke data
            }))
          )
        }
      } catch (err) {
        console.error("Fetch error:", err.message)
      }
    }
    fetchUsers()
  }, [])

  // 🔎 Filter + Sort + Search
  const processedData = data
    .filter((user) => user.username.toLowerCase().includes(search.toLowerCase()))
    .filter((user) => filterRole === "All" ? true : user.role === filterRole)
    .sort((a, b) => {
      if (sortOption === "joinedAt") {
        return new Date(b.joinedAt) - new Date(a.joinedAt)
      }
      if (sortOption === "joinedAt-oldest") {
        return new Date(a.joinedAt) - new Date(b.joinedAt)
      }
      if (sortOption === "username-asc") {
        return a.username.localeCompare(b.username)
      }
      if (sortOption === "username-desc") {
        return b.username.localeCompare(a.username)
      }
      return 0
    })

  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = processedData.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(processedData.length / usersPerPage)

  // 🔹 Badge role
  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return <Badge className="bg-green-500/20 text-green-700">{role}</Badge>
      case "Tim Publikasi":
        return <Badge className="bg-orange-500/20 text-orange-700">{role}</Badge>
      default:
        return <Badge className="bg-blue-500/20 text-blue-700">{role}</Badge>
    }
  }

  // 🔹 Tambah User
  const handleAddSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newUser = {
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),  // Mengambil email dari form
      role_id: getRoleId(formData.get("role")),
    }

    // Check if the role is not Admin for the current user
    if (newUser.role_id === 2) {
      Swal.fire("Error", "Anda tidak dapat menambahkan Admin lainnya.", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(API_URL + "/register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      const savedUser = await res.json()
      setData([
        ...data,
        {
          ...savedUser,
          role: getRoleName(savedUser.role_id),
          joinedAt: savedUser.created_at || new Date().toISOString(),
        },
      ])
      setOpenAddDialog(false)
      Swal.fire("Berhasil!", "Pengguna baru berhasil ditambahkan.", "success")
    } catch (err) {
      console.error("Add user error:", err)
    }
  }

  // 🔹 Edit User
  const handleEditSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const updatedUser = {
      ...editingUser,
      username: formData.get("username"),
      email: editingUser.email,  // Menjaga agar email tidak bisa diubah
      role_id: getRoleId(formData.get("role")),
    }

    // Prevent Admin from changing to Admin role
    if (updatedUser.role_id === 2 && editingUser.role !== "Admin") {
      Swal.fire("Error", "Anda tidak dapat mengubah role menjadi Admin.", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      await fetch(`${API_URL}/${editingUser.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      })

      setData(
        data.map((u) =>
          u.id === updatedUser.id
            ? { ...updatedUser, role: getRoleName(updatedUser.role_id) }
            : u
        )
      )
      setEditingUser(null)
      Swal.fire("Tersimpan!", "Pengguna berhasil diperbarui.", "success")
    } catch (err) {
      console.error("Edit user error:", err)
    }
  }

  // 🔹 Hapus User
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin mau hapus?",
      text: "Data pengguna tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem("token")
          await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          })
          setData(data.filter((user) => user.id !== id))
          Swal.fire("Terhapus!", "Pengguna berhasil dihapus.", "success")
        } catch (err) {
          console.error("Delete user error:", err)
        }
      }
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-xl font-semibold">Tabel Manajemen User</h2>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tambah User */}
          <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus size={16} /> Tambahkan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Pengguna</DialogTitle>
                <DialogDescription>Masukkan data user baru.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" name="username" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" name="password" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" name="email" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      id="role"
                      name="role"
                      className="border rounded-md h-9 px-3"
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Role</SelectLabel>
                          <SelectItem value="Guest">Guest</SelectItem>
                          <SelectItem value="Tim Publikasi">Tim Publikasi</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Simpan</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          {/* 🔽 Filter Role pakai shadcn Select */}
          <Select
            value={filterRole}
            onValueChange={(value) => {
              setFilterRole(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <SelectValue placeholder="Filter Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Filter Role</SelectLabel>
                <SelectItem value="All">Semua Role</SelectItem>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Guest">Guest</SelectItem>
                <SelectItem value="Tim Publikasi">Tim Publikasi</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* 🔽 Sort Option pakai shadcn Select */}
          <Select
            value={sortOption}
            onValueChange={(value) => {
              setSortOption(value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="w-[220px] h-9 text-sm">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Urutkan</SelectLabel>
                <SelectItem value="joinedAt">Tanggal Bergabung (Terbaru)</SelectItem>
                <SelectItem value="joinedAt-oldest">Tanggal Bergabung (Terlama)</SelectItem>
                <SelectItem value="username-asc">Username (A-Z)</SelectItem>
                <SelectItem value="username-desc">Username (Z-A)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search user..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-8 h-9"
            />
          </div>
        </div>
      </div>

      {/* Table / Card */}
      {isMobile ? (
        <div className="grid gap-4">
          {currentUsers.map((user) => (
            <div key={user.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">{user.username}</h3>
                {getRoleBadge(user.role)}
              </div>
              <p className="text-sm text-gray-500">
                Email: {user.email} {/* Menampilkan email */}
              </p>
              <div className="flex gap-2 mt-3">
                {user.role !== "Admin" && (
                  <Dialog
                    open={editingUser?.id === user.id}
                    onOpenChange={(open) => setEditingUser(open ? user : null)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="link"
                        size="sm"
                        className="text-blue-600 p-0"
                        onClick={() => setEditingUser(user)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Pengguna</DialogTitle>
                        <DialogDescription>
                          Ubah username dan role.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleEditSubmit}>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              defaultValue={editingUser?.username}
                              required
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select
                              id="role"
                              name="role"
                              className="border rounded-md h-9 px-3"
                              defaultValue={editingUser?.role}
                              required
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih Role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Role</SelectLabel>
                                  <SelectItem value="Guest">Guest</SelectItem>
                                  <SelectItem value="Tim Publikasi">Tim Publikasi</SelectItem>
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter className="mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button type="submit">Simpan</Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                )}
                {user.role !== "Admin" && (
                  <Button
                    variant="link"
                    size="sm"
                    className="text-red-600"
                    onClick={() => handleDelete(user.id)}
                  >
                    Hapus
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No</TableHead>
                <TableHead className="text-left w-[350px]">Username</TableHead>
                <TableHead>Email</TableHead> {/* Menampilkan Email */}
                <TableHead>Tanggal Bergabung</TableHead>
                <TableHead>Role User</TableHead>
                <TableHead className="text-left w-[300px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>{indexOfFirstUser + index + 1}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell> {/* Menampilkan email */}
                  <TableCell>{user.joinedAt?.split("T")[0]}</TableCell>
                  <TableCell>{getRoleBadge(user.role)}</TableCell>
                  <TableCell className="text-left space-x-2">
                    {user.role !== "Admin" && (
                      <Dialog
                        open={editingUser?.id === user.id}
                        onOpenChange={(open) => setEditingUser(open ? user : null)}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-blue-600"
                            onClick={() => setEditingUser(user)}
                          >
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Pengguna</DialogTitle>
                            <DialogDescription>
                              Ubah username dan role.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleEditSubmit}>
                            <div className="grid gap-4">
                              <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                  id="username"
                                  name="username"
                                  defaultValue={editingUser?.username}
                                  required
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                  id="role"
                                  name="role"
                                  className="border rounded-md h-9 px-3"
                                  defaultValue={editingUser?.role}
                                  required
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih Role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Role</SelectLabel>
                                      <SelectItem value="Guest">Guest</SelectItem>
                                      <SelectItem value="Tim Publikasi">Tim Publikasi</SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <DialogFooter className="mt-4">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button type="submit">Simpan</Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    )}
                    {user.role !== "Admin" && (
                      <Button
                        variant="link"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(user.id)}
                      >
                        Hapus
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </Button>

        {isMobile ? (
          <>
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              const page = i + 1
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              )
            })}
          </>
        ) : (
          Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
