// React Query hook lấy danh sách topics IELTS Writing.

import { useQuery } from "@tanstack/react-query";
import { topicsService } from "@/services/topics.service";

// Factory query key cho cache topics.
export const topicKeys = {
  all:  ["topics"] as const,

  list: () => [...topicKeys.all, "list"] as const,
};

/*
Hook lấy danh sách topics.

Output:
- Kết quả useQuery chứa danh sách topics.
*/
export function useTopics() {
  return useQuery({
    queryKey: topicKeys.list(),
    queryFn:  () => topicsService.getTopics(),
    staleTime: 10 * 60 * 1000, // cache 10 phút
  });
}
