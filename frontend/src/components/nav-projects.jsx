"use client"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavProjects({ projects }) {
  // Hilangkan duplikasi berdasarkan nama/url
  const uniqueProjects = projects.filter(
    (value, index, self) =>
      index === self.findIndex((p) => p.name === value.name)
  )

  // Bagi grup manual
  const umum = uniqueProjects.filter((item) =>
    ["Dashboard", "User", "Guru"].some((kw) =>
      item.name.includes(kw)
    )
  )

  const berita = uniqueProjects.filter((item) =>
    ["Berita"].some(
      (kw) => item.name.includes(kw) && !item.name.includes("Galeri")
    )
  )

  const galeri = uniqueProjects.filter((item) =>
    ["Galeri", "Komentar"].some((kw) => item.name.includes(kw))
  )

  const pembinat = uniqueProjects.filter((item) =>
    ["Pembinat", "Jurusan", "Pembimbing"].some((kw) => item.name.includes(kw))
  )

  const renderGroup = (label, items) =>
    items.length > 0 && (
      <SidebarGroup key={label} className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>{label}</SidebarGroupLabel>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    )

  return (
    <>
      {/* Urutan yang diinginkan */}
      {renderGroup("Manajemen Umum", umum)}
      {renderGroup("Manajemen Galeri", galeri)}
      {renderGroup("Manajemen Berita", berita)}
      {renderGroup("Manajemen Pembinat", pembinat)}
    </>
  )
}
