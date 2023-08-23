import type { User } from "@clerk/nextjs/server"

import { Avatar, AvatarFallback, AvatarImage } from "@/ui/avatar"

interface AvatarProps {
  user: User | null
}

export default function UserAvatar({ user }: AvatarProps) {
  const initials = `${user?.firstName?.charAt(0) ?? ""} ${
    user?.lastName?.charAt(0) ?? ""
  }`
  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={user?.imageUrl} alt={user?.username ?? "avatar"} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  )
}
