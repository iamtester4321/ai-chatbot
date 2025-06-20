// Header -------------------------------------------------------------------------------------------------------------------------------
export interface HeaderProps {
  toggleSidebar: () => void;
  isLogoutModalOpen: boolean;
}

export interface HeaderTitleProps {
  toggleSidebar: () => void;
}

export interface MobileMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  toggleFavorite: () => void;
  isFavorite: boolean;
  isArchive: boolean;
  toggleArchiveChat: () => void;
  openDeleteModal: () => void;
  setShareOpen: (state: boolean) => void;
  chatId: string;
  favoriteLoading: boolean;
  archiveLoading: boolean;
}

export interface DesktopMenuProps {
  isOpen: boolean;
  toggleMenu: () => void;
  toggleArchiveChat: () => void;
  openDeleteModal: () => void;
  isArchive: boolean;
  chatId: string;
  archiveLoading: boolean;
}

export interface ChatActionsProps {
  chatId: string;
  isFavorite: boolean;
  isArchive: boolean;
  toggleFavorite: () => void;
  setShareOpen: (state: boolean) => void;
  favoriteLoading: boolean;
}

// Sidebar -------------------------------------------------------------------------------------------------------------------------------
export type SidebarProps = {
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  chatList: ChatState["chatList"];
  setIsRenameModalOpen: (isOpen: boolean) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setSelectedChatId: (id: string | null) => void;
  setSelectedChat: (chat: { id: string; name: string } | null) => void;
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
};

export interface UserDetailProps {
  onClick: () => void;
}

export interface FavoriteChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  isFavoritesOpen: boolean;
  setIsFavoritesOpen: (value: boolean) => void;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: {
    id: string | null;
    section: "favorite" | "all" | "spark" | null;
  };
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
  isMobile: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface FavoriteChatsSettingsProps {
  favoriteChats?: ChatState["chatList"];
  onClose?: () => void;
}

export interface ShareChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  isShareOpen: boolean;
  setIsShareOpen: (value: boolean) => void;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: {
    id: string | null;
    section: "favorite" | "spark" | "all" | null;
  };
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
  isMobile: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface AllChatsProps {
  chats: ChatState["chatList"];
  chatId: string | undefined;
  toggleDropdown: (chatId: string) => void;
  activeDropdown: {
    id: string | null;
    section: "favorite" | "spark" | "all" | null;
  };
  handleRename: (chatId: string) => void;
  handleDelete: (chatId: string) => void;
  isMobile: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// ChatSection -------------------------------------------------------------------------------------------------------------------------------
export type ChatResponseProps = {
  messages: Message[];
  chatResponse: string;
  isLoading: boolean;
  chatName: string;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  chatId: string;
  shareId: string;
  isMobile: boolean;
  sourceChatId: string | null;
};

export type ChatMessageThreadProps = {
  messages: Message[];
  isMobile: boolean;
  onCopy: (msg: string, index: number, msgId?: string) => Promise<void>;
  copiedIndex: number | null;
  likedMessages: { [key: string]: boolean };
  dislikedMessages: { [key: string]: boolean };
  onLike: (id: string | undefined) => void;
  onDislike: (id: string | undefined) => void;
};

export type PromptInputProps = {
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  chatId?: string;
  shareId?: string;
  sourceChatId?: string | null;
  isSharedChat?: boolean;
  onInteractWithSharedChat?: () => void;
};

export type Message = {
  for: string;
  id?: string;
  role: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  encryptedContent?: string;
};

export type ChatState = {
  messages: Message[];
  currentResponse: string;
  isLoading: boolean;
  chatName: string;
  chatList: Array<{
    id: string;
    name: string;
    isFavorite: boolean;
    isArchived: boolean;
    isShare: boolean;
  }>;
  isArchived: boolean;
  isFavorite: boolean;
  isShare: boolean;
  mode: "chat" | "chart";
  chatNameLoading: boolean;
  actionLoadingId: string | null;
};

export interface ChatHookProps {
  chatId?: string;
  shareId?: string;
  onResponseUpdate?: (text: string) => void;
  sourceChatId?: string | null;
}

export interface DeleteChatResponse {
  success: boolean;
  message?: string;
}

// Modals --------------------------------------------------------------------------------------------------------------------------------
export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}

export interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentName: string;
}

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
}
export interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatList: ChatState["chatList"];
}

export interface ArchivedChatsProps {
  archivedChats: ChatState["chatList"];
  onClose: () => void;
}

// Chart -------------------------------------------------------------------------------------------------------------------------------
export type ChartType =
  | "line"
  | "area"
  | "bar"
  | "composed"
  | "scatter"
  | "pie";

// Error -------------------------------------------------------------------------------------------------------------------------------
export interface ErrorProps {
  message: string;
  onNewChat: () => void;
}

// Theme -------------------------------------------------------------------------------------------------------------------------------
export interface ThemeToggleButtonProps {
  isDarkMode: boolean;
  mode: "light" | "dark" | "system";
  toggleTheme: () => void;
}