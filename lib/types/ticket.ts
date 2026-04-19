export type TicketStatus = "ALL" | "PENDING" | "CANCELED" | "COMPLETED";

export interface TicketListItem {
  id: number;
  reference: string;
  title: string;
  orderDate: string;
  totalPaid: number;
  quantity: number;
  status: Exclude<TicketStatus, "ALL">;
}

export interface TicketsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface TicketsResponse {
  items: TicketListItem[];
  number: number;
  totalElements: number;
  totalPages: number;
}
