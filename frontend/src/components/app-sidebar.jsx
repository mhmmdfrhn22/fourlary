"use client"

import { Home, Users, Image, Newspaper, UserCog, ListFilter, Presentation, MessageCircle, Book, BriefcaseBusiness } from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Data sidebar
const data = {
  Dashboard: [
    { name: "Dashboard", url: "/dashboard", icon: Home },
    { name: "Manajemen User", url: "/dashboard/ManajemenUser", icon: Users },
    { name: "Manajemen Guru", url: "/dashboard/ManajemenGuru", icon: Presentation },
  ],
  Berita: [
    { name: "Manajemen Berita", url: "/dashboard/ManajemenBerita", icon: Newspaper },
    { name: "Manajemen Kategori Berita", url: "/dashboard/ManajemenKategori", icon: ListFilter },
  ],
  Galeri: [
    { name: "Manajemen Galeri", url: "/dashboard/ManajemenGaleri", icon: Image },
    { name: "Manajemen Kategori Galeri", url: "/dashboard/ManajemenKategoriFoto", icon: ListFilter },
    { name: "Manajemen Komentar Galeri", url: "/dashboard/ManajemenKomentarFoto", icon: MessageCircle },
  ],
  Pembinat: [
    { name: "Manajemen Pembinat", url: "/dashboard/ManajemenPembinat", icon: BriefcaseBusiness },
    { name: "Manajemen Jurusan", url: "/dashboard/ManajemenJurusan", icon: Book },
    { name: "Manajemen Pembimbing", url: "/dashboard/ManajemenPembimbing", icon: UserCog },
  ],
}

export function AppSidebar(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* Team switcher hanya jadi tombol redirect ke home */}
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.Dashboard} />
        <NavProjects projects={data.Galeri} />
        <NavProjects projects={data.Berita} />
        <NavProjects projects={data.Pembinat} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}