"use client";

import React, { useRef, useEffect } from "react";
import { Camera } from "lucide-react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: 480,
          height: 480,
        },
      })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) =>
        console.error("Camera access blocked or unavailable:", err),
      );

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const size = Math.min(canvas.width, canvas.height);
    const sx = (canvas.width - size) / 2;
    const sy = (canvas.height - size) / 2;

    canvas.width = 500;
    canvas.height = 500;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, sx, sy, size, size, 0, 0, 500, 500);

    onCapture(canvas.toDataURL("image/jpeg"));
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-sm rounded-lg bg-black aspect-square object-cover"
      />
      <button
        onClick={capturePhoto}
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors"
      >
        <Camera size={20} /> Snap Puzzle Photo
      </button>
    </div>
  );
}
