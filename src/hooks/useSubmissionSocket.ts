// Hook WebSocket nhận tiến trình chấm AI realtime cho submission.

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/lib/constants";
import { useSubmissionStore } from "@/stores/submission.store";
import { submissionKeys } from "@/hooks/useSubmission";
import { SubmissionStatus } from "@/types/enums";

// Payload event submission_status_updated từ backend.
interface StatusUpdatedPayload {
  submissionId: string;
  status: SubmissionStatus;
  hasResult: boolean;
  overallBand?: number;
  errorMessage?: string;
  timestamp: string;
}

// Payload event submission_progress từ backend.
interface ProgressPayload {
  submissionId: string;
  progress: number; // 0–100
  message: string;
  timestamp: string;
}

// Options truyền vào useSubmissionSocket để xử lý trạng thái kết thúc.
interface UseSubmissionSocketOptions {
  // Callback khi submission chuyển sang COMPLETED.
  onCompleted?: (submissionId: string) => void;
  // Callback khi submission chuyển sang FAILED.
  onFailed?: (submissionId: string, errorMessage?: string) => void;
}

/*
Hook tạo kết nối Socket.io theo user hiện tại và lắng nghe event chấm AI.

Input:
- submissionId — submission cần theo dõi (null nếu chưa chọn cụ thể).
- options — callback cho trạng thái COMPLETED/FAILED.

Output:
- { isConnected } cho biết socket có đang kết nối hay không.
*/
export function useSubmissionSocket(
  submissionId: string | null,
  options: UseSubmissionSocketOptions = {}
) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { setGradingStatus, setGradingProgress } = useSubmissionStore();
  const [isConnected, setIsConnected] = useState(false);

  // Dùng ref để handler luôn đọc được giá trị mới nhất mà không reconnect socket
  const socketRef = useRef<Socket | null>(null);
  const submissionIdRef = useRef(submissionId);
  const optionsRef = useRef(options);

  // Đồng bộ ref với props mới nhất
  useEffect(() => {
    submissionIdRef.current = submissionId;
  }, [submissionId]);

  useEffect(() => {
    optionsRef.current = options;
  });

  // Tạo socket theo session hiện tại và cleanup khi unmount
  useEffect(() => {
    if (!session?.accessToken || !session?.user?.id) return;

    const socket = io(`${WS_URL}/ws/submissions`, {
      auth: { token: session.accessToken },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      // Join room theo user để server emit đúng người nhận
      socket.emit("join_room", { room: `user:${session.user.id}` });
    });

    socket.on("disconnect", () => setIsConnected(false));

    socket.on("submission_status_updated", (payload: StatusUpdatedPayload) => {
      // Bỏ qua event của submission khác
      if (!submissionIdRef.current) return;
      if (payload.submissionId !== submissionIdRef.current) return;

      setGradingStatus(payload.status);

      if (payload.status === SubmissionStatus.PROCESSING) {
        setGradingProgress(10, "AI đang chấm bài...");
      }

      if (payload.status === SubmissionStatus.COMPLETED) {
        setGradingProgress(100, "Chấm bài hoàn tất!");
        // Refetch chi tiết submission để lấy aiResult mới nhất
        queryClient.refetchQueries({
          queryKey: submissionKeys.detail(payload.submissionId),
        });
        optionsRef.current.onCompleted?.(payload.submissionId);
      }

      if (payload.status === SubmissionStatus.FAILED) {
        setGradingProgress(0, payload.errorMessage ?? "Có lỗi xảy ra.");
        optionsRef.current.onFailed?.(
          payload.submissionId,
          payload.errorMessage
        );
      }
    });

    socket.on("submission_progress", (payload: ProgressPayload) => {
      // Bỏ qua progress event của submission khác
      if (!submissionIdRef.current) return;
      if (payload.submissionId !== submissionIdRef.current) return;

      setGradingProgress(payload.progress, payload.message);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [
    session?.accessToken,
    session?.user?.id,
    queryClient,
    setGradingStatus,
    setGradingProgress,
  ]);

  return { isConnected };
}
