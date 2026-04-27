export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
