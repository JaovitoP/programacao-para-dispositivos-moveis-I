import { Feedback } from "./feedback";
import { Ticket } from "./ticket";

export interface Event {
  id: string;
  title: string;
  date: Date;
  location: string;
  image: string;
  averageRating?: number; // Adicione esta linha
}

export interface EventDetails {
  category: string;
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  image?: string;
  attendees?: number;
  color?: string;
  tickets?: Ticket[];
  feedbacks?: Feedback[];
}