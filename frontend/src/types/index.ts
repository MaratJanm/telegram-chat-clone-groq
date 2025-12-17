export interface Message {
  id: string;
  text: string;
  timestamp: string;
  is_outgoing: boolean;
}

export interface MessageCreate {
  text: string;
  is_outgoing?: boolean;
}

export interface MessagesResponse {
  messages: Message[];
}