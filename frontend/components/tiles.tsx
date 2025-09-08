"use client"

import { Icon } from "@iconify/react/dist/iconify.js";
import Image from "next/image";
import Link from "next/link";
import clx from "clsx";

export function ImageTile({ label, image, onClick }:
  Readonly<{ label: string, image?: string, onClick?: () => void }>) {
  return (
    <button className='relative w-full h-48 bg-primary-100 rounded-lg border border-primary-200 overflow-hidden'
      onClick={onClick}>
      <div className='w-full flex-1 bg-neutral-200 group'>
        {image && <Image
          src={image}
          alt={label}
          width={300}
          height={300}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
        />}
      </div>
      <span className='text-label-desktop-large text-neutral-100 bg-primary-500/70 p-2 absolute bottom-0 left-0 w-full'>{label}</span>
    </button>
  )
}

export function LinkListTile(props: {
  label: string;
  icon?: string;
  href?: string;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link href={props.href || "#"}
      onClick={props.onClick}
      className={`flex flex-row items-center justify-between gap-6 w-full py-2 px-2 transition-colors rounded hover:bg-primary-200 ${props.className}`}
    >
      <Icon icon={props.icon || "mdi:link"} className='h-6 w-6 text-primary-100' />
      <span className='flex-1 text-label-desktop-large text-primary-100 text-left'>{props.label}</span>
    </Link>
  )

}