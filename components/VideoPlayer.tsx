'use client';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

export default function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  // Auto-generate poster by adding #t=0.1 to video URL if no poster provided
  const videoPoster = poster || `${src}#t=0.1`;
  
  return (
    <div className="relative aspect-video bg-black overflow-hidden">
      <video
        className="w-full h-full object-contain"
        controls
        preload="metadata"
        poster={videoPoster}
        playsInline
        controlsList="nodownload"
      >
        <source src={src} type="video/mp4" />
        <source src={src} type="video/webm" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
