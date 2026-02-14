"use client"

import { Home, Image, Newspaper, ListFilter, MessageCircle } from "lucide-react"
import { NavProjects } from "@/components/dashboard_component/nav-projects"
import { NavUser } from "@/components/dashboard_component/nav-user"
import { TeamSwitcher } from "@/components/dashboard_component/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Data sidebar khusus untuk PDD Sekolah
const dataPDD = {
  Dashboard: [
    { name: "Dashboard", url: "/dashboard-pdd", icon: Home },
  ],
  Galeri: [
    { name: "Manajemen Galeri", url: "/dashboard-pdd/ManajemenGaleri", icon: Image },
    { name: "Manajemen Kategori Galeri", url: "/dashboard-pdd/ManajemenKategoriFoto", icon: ListFilter },
    { name: "Manajemen Komentar Galeri", url: "/dashboard-pdd/ManajemenKomentarFoto", icon: MessageCircle },
  ],
  Berita: [
    { name: "Manajemen Berita", url: "/dashboard-pdd/ManajemenBerita", icon: Newspaper },
    { name: "Manajemen Kategori Berita", url: "/dashboard-pdd/ManajemenKategori", icon: ListFilter },
  ],
}

export function AppSidebarPDD(props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={dataPDD.Dashboard} />
        <NavProjects projects={dataPDD.Galeri} />
        <NavProjects projects={dataPDD.Berita} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={dataPDD.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}