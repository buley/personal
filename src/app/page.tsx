"use client";
import React from "react";
import Image from "next/image";
import { useEffect } from 'react';

export default function Home() {
  
  useEffect(() => {
    fetch('http://localhost:3000/api/hello')
    .then(response => response.json())
    .then(data => console.log(data))
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <Image
        src="/vercel.svg"
        alt="Vercel Logo"
        width={72}
        height={16}
      />
    </div>
  );
}
