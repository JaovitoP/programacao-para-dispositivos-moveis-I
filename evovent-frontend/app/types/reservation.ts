export interface Reservation {
    id: string;
    user_id: number;
    status: string;
    ticket_id: string;
    amount: string;
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
  }