import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";
import { WS_URL } from "@/lib/constants";

interface PipelineProgressPayload {
  jobId: string;
  step?: number;
  message: string;
}

export function usePipelineSocket(
  jobId: string | null,
  onMessage: (payload: PipelineProgressPayload) => void,
) {
  const { data: session } = useSession();
  const socketRef = useRef<Socket | null>(null);
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  });

  useEffect(() => {
    if (!session?.accessToken || !jobId) return;

    const socket = io(`${WS_URL}/ws/submissions`, {
      auth: { token: session.accessToken },
      transports: ["websocket"],
      reconnection: true,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_room", { room: `pipeline:${jobId}` });
    });

    socket.on("pipeline_progress", (payload: PipelineProgressPayload) => {
      onMessageRef.current(payload);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.accessToken, jobId]);
}
