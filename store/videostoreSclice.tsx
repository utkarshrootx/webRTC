import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface VideoCallState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  error: string | null;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setError: (error: string | null) => void;
  startLocalStream: () => Promise<void>;
}

export const useStore = create<VideoCallState>()(
  immer((set) => ({
    localStream: null,
    remoteStream: null,
    error: null,
    setLocalStream: (stream) =>
      set((state) => {
        state.localStream = stream;
      }),
    setRemoteStream: (stream) =>
      set((state) => {
        state.remoteStream = stream;
      }),
    setError: (error) =>
      set((state) => {
        state.error = error;
      }),
    startLocalStream: async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        set((state) => {
          state.localStream = stream;
        });
      } catch (error) {
        set((state) => {});
      }
    },
  }))
);
