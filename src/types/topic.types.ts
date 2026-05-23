// Type cho Topic dùng để phân loại course/question/sample essay.

// Topic trả về từ GET /topics.
export interface Topic {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
