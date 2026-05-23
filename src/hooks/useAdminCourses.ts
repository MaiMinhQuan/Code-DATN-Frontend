// React Query hooks cho admin CRUD courses và lessons.
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { coursesService } from "@/services/courses.service";
import type {
  CreateCourseDto,
  UpdateCourseDto,
  CreateLessonDto,
  UpdateLessonDto,
  AddVideoDto,
  UpdateVideoDto,
  AddVocabularyDto,
  UpdateVocabularyDto,
  AddGrammarDto,
  UpdateGrammarDto,
} from "@/types/admin.types";

export const adminCourseKeys = {
  all: ["admin", "courses"] as const,
  list: () => [...adminCourseKeys.all, "list"] as const,
  detail: (courseId: string) => [...adminCourseKeys.all, "detail", courseId] as const,
};

export const adminLessonKeys = {
  all: ["admin", "lessons"] as const,
  list: (courseId: string) => [...adminLessonKeys.all, "list", courseId] as const,
  detail: (lessonId: string) => [...adminLessonKeys.all, "detail", lessonId] as const,
};

export function useAdminCourse(courseId: string) {
  return useQuery({
    queryKey: adminCourseKeys.detail(courseId),
    queryFn: () => coursesService.getAdminCourse(courseId),
    enabled: !!courseId,
    staleTime: 0,
  });
}

export function useAdminCourses() {
  return useQuery({
    queryKey: adminCourseKeys.list(),
    queryFn: () => coursesService.getAdminCourses(),
    staleTime: 0,
  });
}

export function useAdminLessons(courseId: string) {
  return useQuery({
    queryKey: adminLessonKeys.list(courseId),
    queryFn: () => coursesService.getAdminLessons({ courseId }),
    enabled: !!courseId,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useAdminLessonDetail(lessonId: string) {
  return useQuery({
    queryKey: adminLessonKeys.detail(lessonId),
    queryFn: () => coursesService.getAdminLesson(lessonId),
    enabled: !!lessonId,
    staleTime: 0,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCourseDto) => coursesService.createCourse(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.all });
      toast.success("Tạo khóa học thành công");
    },
    onError: () => toast.error("Tạo khóa học thất bại"),
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateCourseDto }) =>
      coursesService.updateCourse(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.all });
      toast.success("Cập nhật khóa học thành công");
    },
    onError: () => toast.error("Cập nhật khóa học thất bại"),
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => coursesService.deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.all });
      toast.success("Xóa khóa học thành công");
    },
    onError: () => toast.error("Xóa khóa học thất bại"),
  });
}

export function useCreateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateLessonDto) => coursesService.createLesson(dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.list(vars.courseId) });
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.all });
      toast.success("Tạo bài học thành công");
    },
    onError: () => toast.error("Tạo bài học thất bại"),
  });
}

export function useUpdateLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateLessonDto; courseId: string }) =>
      coursesService.updateLesson(id, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.list(vars.courseId) });
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.id) });
      toast.success("Cập nhật bài học thành công");
    },
    onError: () => toast.error("Cập nhật bài học thất bại"),
  });
}

export function useDeleteLesson() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; courseId: string }) =>
      coursesService.deleteLesson(id),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.list(vars.courseId) });
      queryClient.invalidateQueries({ queryKey: adminCourseKeys.all });
      toast.success("Xóa bài học thành công");
    },
    onError: () => toast.error("Xóa bài học thất bại"),
  });
}

export function useAddVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, dto }: { lessonId: string; dto: AddVideoDto }) =>
      coursesService.addVideo(lessonId, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Thêm video thành công");
    },
    onError: () => toast.error("Thêm video thất bại"),
  });
}

export function useUpdateVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index, dto }: { lessonId: string; index: number; dto: UpdateVideoDto }) =>
      coursesService.updateVideo(lessonId, index, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Cập nhật video thành công");
    },
    onError: () => toast.error("Cập nhật video thất bại"),
  });
}

export function useRemoveVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index }: { lessonId: string; index: number }) =>
      coursesService.removeVideo(lessonId, index),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Xóa video thành công");
    },
    onError: () => toast.error("Xóa video thất bại"),
  });
}

export function useAddVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, dto }: { lessonId: string; dto: AddVocabularyDto }) =>
      coursesService.addVocabulary(lessonId, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Thêm từ vựng thành công");
    },
    onError: () => toast.error("Thêm từ vựng thất bại"),
  });
}

export function useUpdateVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index, dto }: { lessonId: string; index: number; dto: UpdateVocabularyDto }) =>
      coursesService.updateVocabulary(lessonId, index, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Cập nhật từ vựng thành công");
    },
    onError: () => toast.error("Cập nhật từ vựng thất bại"),
  });
}

export function useRemoveVocabulary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index }: { lessonId: string; index: number }) =>
      coursesService.removeVocabulary(lessonId, index),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Xóa từ vựng thành công");
    },
    onError: () => toast.error("Xóa từ vựng thất bại"),
  });
}

export function useAddGrammar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, dto }: { lessonId: string; dto: AddGrammarDto }) =>
      coursesService.addGrammar(lessonId, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Thêm ngữ pháp thành công");
    },
    onError: () => toast.error("Thêm ngữ pháp thất bại"),
  });
}

export function useUpdateGrammar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index, dto }: { lessonId: string; index: number; dto: UpdateGrammarDto }) =>
      coursesService.updateGrammar(lessonId, index, dto),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Cập nhật ngữ pháp thành công");
    },
    onError: () => toast.error("Cập nhật ngữ pháp thất bại"),
  });
}

export function useRemoveGrammar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ lessonId, index }: { lessonId: string; index: number }) =>
      coursesService.removeGrammar(lessonId, index),
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: adminLessonKeys.detail(vars.lessonId) });
      toast.success("Xóa ngữ pháp thành công");
    },
    onError: () => toast.error("Xóa ngữ pháp thất bại"),
  });
}
