"use client";
import React from "react";
import Image from "next/image";
import { useEffect } from 'react';

export default function Home() {
  
  const triangle = <Image
    src="/vercel.svg"
    alt="Vercel Logo"
    width={72}
    height={16}
  />

  return (
    <div>
      {triangle}
      <h1>Hello, World!</h1>
    </div>
  );
}
