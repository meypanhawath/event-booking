export interface Category {
  id: number
  name: string
}

export interface Organizer {
  uuid: string
  username: string
  orgName: string
  socialUrl: string | null
  orgBio: string | null
}

export interface Ticket {
  id: number
  type: string
  price: number
  quantity: number
  soldCount: number
  available: number
  description: string
}

export interface Event {
  id: number
  title: string
  description: string
  thumbnailPath: string
  thumbnailUrl: string
  rating: number
  status: string
  startDate: string
  endDate: string
  isAvailable: boolean
  category: Category
  organizer: Organizer | null
  tickets: Ticket[]
}

export interface PaginatedResponse<T> {
  content: T[]
  empty: boolean
  first: boolean
  last: boolean
  number: number
  numberOfElements: number
  pageable: {
    offset: number
    pageNumber: number
    pageSize: number
    paged: boolean
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    unpaged: boolean
  }
  size: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  totalElements: number
  totalPages: number
}