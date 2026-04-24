import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/lib/constants";
import { useSubmissionStore } from "@/stores/submission.store";
import { submissionKeys } from "@/hooks/useSubmission";
import { SubmissionStatus } from "@/types/enums";

// ─── Payload types (khớp với backend WebSocket events) ───────────────────────

interface StatusUpdatedPayload {
  submissionId: string;
  status: SubmissionStatus;
  hasResult: boolean;
  overallBand?: number;
  errorMessage?: string;
  timestamp: string;
}

interface ProgressPayload {
  submissionId: string;
  progress: number;
  message: string;
  timestamp: string;
}

// ─── Hook options ─────────────────────────────────────────────────────────────

interface UseSubmissionSocketOptions {
  onCompleted?: (submissionId: string) => void;
  onFailed?: (submissionId: string, errorMessage?: string) => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSubmissionSocket(
  submissionId: string | null,
  options: UseSubmissionSocketOptions = {}
) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { setGradingStatus, setGradingProgress } = useSubmissionStore();
  const [isConnected, setIsConnected] = useState(false);

  // Dùng ref để event handlers có giá trị mới nhất
  // mà không trigger reconnect khi submissionId hoặc callbacks thay đổi
  const socketRef = useRef<Socket | null>(null);
  const submissionIdRef = useRef(submissionId);
  const optionsRef = useRef(options);

  useEffect(() => {
    submissionIdRef.current = submissionId;
  }, [submissionId]);

  useEffect(() => {
    optionsRef.current = options;
  });

  // ── Kết nối socket — chỉ chạy lại khi auth thay đổi ──────────────────────
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

    // ── connect ──────────────────────────────────────────────────────────────
    socket.on("connect", () => {
      setIsConnected(true);
      socket.emit("join_room", { room: `user:${session.user.id}` });
    });

    socket.on("disconnect", () => setIsConnected(false));

    // ── submission_status_updated ─────────────────────────────────────────────
    socket.on("submission_status_updated", (payload: StatusUpdatedPayload) => {
      if (!submissionIdRef.current) return;
      if (payload.submissionId !== submissionIdRef.current) return;

      setGradingStatus(payload.status);

      if (payload.status === SubmissionStatus.PROCESSING) {
        setGradingProgress(10, "AI đang chấm bài...");
      }

      if (payload.status === SubmissionStatus.COMPLETED) {
        setGradingProgress(100, "Chấm bài hoàn tất!");
        // Refetch để lấy aiResult đầy đủ — đây là lần duy nhất cần gọi server
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

    // ── submission_progress ───────────────────────────────────────────────────
    socket.on("submission_progress", (payload: ProgressPayload) => {
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
