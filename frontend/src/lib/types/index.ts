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
};

export type PromptInputProps = {
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  chatId?:string;
};

export type SidebarProps = {
  isLogoutModalOpen: boolean;
  setIsLogoutModalOpen: (isOpen: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
  chatList: ChatState["chatList"];
  setIsRenameModalOpen: (isOpen: boolean) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setSelectedChatId: (id: string | null) => void;
  setSelectedChat: (chat: { id: string; name: string } | null) => void;
};

export type Message = {
  id?: string;
  role: string;
  content: string;
  createdAt: string;
  isLiked?: boolean;
  isDisliked?: boolean;
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
};

export type ChartType =
  | "line"
  | "area"
  | "bar"
  | "composed"
  | "scatter"
  | "pie";

export interface ChatHookProps {
  chatId?: string;
  onResponseUpdate?: (text: string) => void;
}

export interface DeleteChatResponse {
  success: boolean;
  message?: string;
}
