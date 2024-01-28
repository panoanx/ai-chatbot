import { getChats, removeChat, shareChat } from '@/app/actions'
import { SidebarActions } from '@/components/nav/sidebar-actions'
import { SidebarItem } from '@/components/nav/sidebar-item'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

export interface SidebarListProps {
  userId?: string
}

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await getChats(userId)

  return (
    <div className="flex-1 h-full">
      <ScrollArea className="h-full w-full">
        {chats?.length ? (
          <div className="space-y-2 px-2">
            {chats.map(
              chat =>
                chat && (
                  <SidebarItem key={chat?.id} chat={chat}>
                    <SidebarActions
                      chat={chat}
                      removeChat={removeChat}
                      shareChat={shareChat}
                    />
                  </SidebarItem>
                )
            )}
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No chat history</p>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
