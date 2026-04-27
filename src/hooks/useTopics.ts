import { useQuery } from "@tanstack/react-query";
import { topicsService } from "@/services/topics.service";

export const topicKeys = {
  all:  ["topics"] as const,
  list: () => [...topicKeys.all, "list"] as const,
};

export function useTopics() {
  return useQuery({
    queryKey: topicKeys.list(),
    queryFn:  () => topicsService.getTopics(),
    staleTime: 10 * 60 * 1000, // topics ít thay đổi — cache 10 phút
  });
}
