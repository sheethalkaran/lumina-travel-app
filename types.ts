
export interface Destination {
  id: string;
  name: string;
  location: string;
  description: string;
  popularReason: string;
  rating: number;
  tags: string[];
  // Food specific fields
  shortDescription?: string;
  placeType?: string;
}

// Added ChatMessage interface for the AI concierge
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: { uri: string; title: string }[];
}
