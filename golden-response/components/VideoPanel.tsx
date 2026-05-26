"use client";

import { Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { RefObject, useEffect, useRef, useState } from "react";
import type { Socket } from "socket.io-client";

export function VideoPanel({ roomId, socketRef }: { roomId: string; socketRef: RefObject<Socket | null> }) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(true);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;
    socket.on("webrtc:offer", async ({ offer }) => {
      await ensureCall(false);
      await peerRef.current?.setRemoteDescription(offer);
      const answer = await peerRef.current?.createAnswer();
      if (answer) {
        await peerRef.current?.setLocalDescription(answer);
        socket.emit("webrtc:answer", { roomId, answer });
      }
    });
    socket.on("webrtc:answer", async ({ answer }) => peerRef.current?.setRemoteDescription(answer));
    socket.on("webrtc:ice", async ({ candidate }) => {
      if (candidate) await peerRef.current?.addIceCandidate(candidate);
    });
    return () => {
      socket.off("webrtc:offer");
      socket.off("webrtc:answer");
      socket.off("webrtc:ice");
    };
  }, [roomId, socketRef]);

  async function ensureCall(createOffer = true) {
    if (!streamRef.current) {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localRef.current) localRef.current.srcObject = streamRef.current;
      } catch {
        setError("Camera or microphone permission was denied. Coding still works.");
        return;
      }
    }
    if (!peerRef.current) {
      const peer = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }] });
      peer.onicecandidate = (event) => socketRef.current?.emit("webrtc:ice", { roomId, candidate: event.candidate });
      peer.ontrack = (event) => {
        if (remoteRef.current) remoteRef.current.srcObject = event.streams[0];
      };
      streamRef.current.getTracks().forEach((track) => peer.addTrack(track, streamRef.current!));
      peerRef.current = peer;
    }
    setEnabled(true);
    if (createOffer) {
      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      socketRef.current?.emit("webrtc:offer", { roomId, offer });
    }
  }

  function toggle(kind: "audio" | "video") {
    streamRef.current?.getTracks().filter((track) => track.kind === kind).forEach((track) => (track.enabled = !track.enabled));
    if (kind === "audio") setMic((v) => !v);
    if (kind === "video") setCam((v) => !v);
  }

  function leave() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    streamRef.current = null;
    peerRef.current = null;
    setEnabled(false);
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-3 sm:grid-cols-2">
        <video ref={localRef} autoPlay muted playsInline className="aspect-video w-full rounded-md bg-slate-950 object-cover" />
        <video ref={remoteRef} autoPlay playsInline className="aspect-video w-full rounded-md bg-slate-950 object-cover" />
      </div>
      {error && <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button onClick={() => ensureCall(true)} className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white"><Video size={16} /> Join</button>
        <button disabled={!enabled} onClick={() => toggle("audio")} className="focus-ring rounded-md border border-slate-200 p-2 disabled:opacity-50 dark:border-slate-700" aria-label="Toggle microphone">{mic ? <Mic size={17} /> : <MicOff size={17} />}</button>
        <button disabled={!enabled} onClick={() => toggle("video")} className="focus-ring rounded-md border border-slate-200 p-2 disabled:opacity-50 dark:border-slate-700" aria-label="Toggle camera">{cam ? <Video size={17} /> : <VideoOff size={17} />}</button>
        <button disabled={!enabled} onClick={leave} className="focus-ring rounded-md border border-slate-200 p-2 text-red-600 disabled:opacity-50 dark:border-slate-700" aria-label="Leave call"><PhoneOff size={17} /></button>
      </div>
    </div>
  );
}
