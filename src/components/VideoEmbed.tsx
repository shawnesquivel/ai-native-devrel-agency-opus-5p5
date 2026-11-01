"use client";

import Image from "next/image";
import { useState } from "react";

export default function VideoEmbed({ id, title, thumb }: { id: string; title: string; thumb: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-line bg-ink">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          className="group absolute inset-0 size-full cursor-pointer"
        >
          <Image
            src={thumb}
            alt=""
            fill
            sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
          <span className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/10" />
          <span className="absolute bottom-3 left-3 grid size-11 place-items-center rounded-full bg-paper text-ink shadow-[0_4px_16px_rgb(0_0_0/0.25)] transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95">
            <svg viewBox="0 0 16 16" className="ml-0.5 size-4" aria-hidden="true">
              <path d="M4.5 2.8v10.4a.6.6 0 0 0 .9.5l8.2-5.2a.6.6 0 0 0 0-1L5.4 2.3a.6.6 0 0 0-.9.5Z" fill="currentColor" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
