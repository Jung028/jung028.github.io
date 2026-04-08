import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Home, User, Briefcase, FolderKanban, Mail } from "lucide-react";

const items = [
  {
    title: "Home",
    description: "Artist spotlight",
    url: "#",
    icon: Home,
  },
  {
    title: "About",
    description: "The story",
    url: "#about",
    icon: User,
  },
  {
    title: "Experience",
    description: "Career tracks",
    url: "#experience",
    icon: Briefcase,
  },
  {
    title: "Projects",
    description: "Featured playlists",
    url: "#projects",
    icon: FolderKanban,
  },
  {
    title: "Contact",
    description: "Get in touch",
    url: "#contact",
    icon: Mail,
  },
];

export function AppSidebar() {
  const { setOpenMobile, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon" className="border-none bg-black">
      <SidebarHeader className="p-6">
        <a href="#" className="text-xl font-bold text-white tracking-tight group-data-[collapsible=icon]:hidden">
          Adam Lim
        </a>
        <div className="hidden group-data-[collapsible=icon]:block">
           <span className="text-lg font-bold text-white font-mono italic">AL</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 bg-black">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-bold uppercase tracking-widest text-subdued mb-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-1">
                  <SidebarMenuButton asChild tooltip={item.title} className="h-auto py-2 px-3 hover:bg-white/10 rounded-md transition-all group/btn">
                    <a href={item.url} onClick={handleLinkClick} className="flex items-center gap-4">
                      <item.icon className="size-5 text-subdued group-hover/btn:text-white transition-colors" />
                      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                        <span className="text-[15px] font-bold text-white leading-tight">{item.title}</span>
                        <span className="text-[11px] text-subdued font-medium">{item.description}</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-6 text-[10px] text-subdued group-data-[collapsible=icon]:hidden bg-black">
        <div className="flex flex-col gap-1 font-medium">
          <span>aedamjung@gmail.com</span>
          <span>+61 481782129</span>
          <span className="mt-2 text-white/20">&copy; 2026 Adam Lim</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
