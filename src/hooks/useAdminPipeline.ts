import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { pipelineService } from "@/services/pipeline.service";

export const pipelineKeys = {
  all: ["pipeline"] as const,
  jobs: () => [...pipelineKeys.all, "jobs"] as const,
  job: (id: string) => [...pipelineKeys.all, "job", id] as const,
  candidates: (id: string) => [...pipelineKeys.all, "candidates", id] as const,
  lessons: (id: string) => [...pipelineKeys.all, "lessons", id] as const,
};

export function usePipelineJobs() {
  return useQuery({
    queryKey: pipelineKeys.jobs(),
    queryFn: pipelineService.getJobs,
    staleTime: 30 * 1000,
  });
}

export function usePipelineJob(jobId: string | null) {
  return useQuery({
    queryKey: pipelineKeys.job(jobId ?? ""),
    queryFn: () => pipelineService.getJob(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const active = ["pending", "running", "analyzing", "seeding"].includes(status ?? "");
      return active ? 3000 : false;
    },
  });
}

export function usePipelineCandidates(jobId: string | null) {
  return useQuery({
    queryKey: pipelineKeys.candidates(jobId ?? ""),
    queryFn: () => pipelineService.getCandidates(jobId!),
    enabled: !!jobId,
    staleTime: 0,
  });
}

export function usePipelineLessons(jobId: string | null) {
  return useQuery({
    queryKey: pipelineKeys.lessons(jobId ?? ""),
    queryFn: () => pipelineService.getLessons(jobId!),
    enabled: !!jobId,
    staleTime: 0,
  });
}

export function useUpdateLessons(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (approvedIndexes: number[]) =>
      pipelineService.updateLessons(jobId, approvedIndexes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.lessons(jobId) });
      toast.success("Đã lưu lựa chọn lesson");
    },
    onError: () => toast.error("Lưu lựa chọn thất bại"),
  });
}

export function useCreatePipelineJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: pipelineService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.jobs() });
    },
    onError: () => toast.error("Không thể khởi động pipeline"),
  });
}

export function useUpdateCandidates(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (approvedIndexes: number[]) =>
      pipelineService.updateCandidates(jobId, approvedIndexes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.candidates(jobId) });
      toast.success("Đã lưu lựa chọn");
    },
    onError: () => toast.error("Lưu lựa chọn thất bại"),
  });
}

export function useAnalyzePipeline(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pipelineService.analyze(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.job(jobId) });
    },
    onError: () => toast.error("Không thể bắt đầu phân tích"),
  });
}

export function useSeedPipeline(jobId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => pipelineService.seed(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pipelineKeys.job(jobId) });
    },
    onError: () => toast.error("Không thể seed dữ liệu"),
  });
}
