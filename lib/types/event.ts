export interface Ticket {
  id?: number;
  type: "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  price: number;
  quantity: number;
  soldCount?: number;
  available?: number;
  description: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Organizer {
  uuid: string;
  username: string;
  orgName: string;
  socialUrl: string | null;
  orgBio: string | null;
}

export interface EventResponse {
  id: number;
  title: string;
  description: string;
  thumbnailPath: string;
  thumbnailUrl: string;
  rating: number;
  status: "UPCOMING" | "COMPLETED" | "CANCELLED" | "SOLD_OUT";
  startDate: string;
  endDate: string;
  location: string;
  isAvailable: boolean;
  isDeleted: boolean;
  category: Category;
  organizer: Organizer;
  tickets: Ticket[];
}

export interface PageEventResponse {
  content: EventResponse[];
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface CreateTicketRequest {
  type: "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND";
  price: number;
  quantity: number;
  description: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  thumbnailPath: string;
  startDate: string;
  endDate: string;
  location: string;
  categoryId: number;
  tickets: CreateTicketRequest[];
}