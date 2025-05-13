export type ChatResponseProps = {
  messages: Array<{ role: string; content: string; createdAt: string }>;
  chatResponse: string;
  isLoading: boolean;
  chatName: string;
  input:any;
  handleInputChange:any;
  handleFormSubmit:any;
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
  role: string;
  content: string;
  createdAt: string;
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
};
