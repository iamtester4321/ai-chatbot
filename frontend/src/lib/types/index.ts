export type ChatResponseProps = {
  messages: Message[];
  chatResponse: string;
  isLoading: boolean;
  chatName: string;
  input:string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
  chatId:string;
};

export type PromptInputProps = {
  input: string;
  isLoading: boolean;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleFormSubmit: (e: React.FormEvent) => void;
};

export type SidebarItemProps = {
  icon: React.ReactNode;
  label: string;
};

export type Message = {
  id?:string
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
  }>;
  isArchived: boolean;
};
