"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useLoginModal } from "@/components/providers/login-modal-provider";

export default function Home() {
  const { open } = useLoginModal();
  
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <h1 className="text-2xl font-bold">Welcome</h1>
      <Button onClick={open}>Open Login Dialog</Button>
    </div>
  );
}
