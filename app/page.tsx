"use client"

import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLoginModal } from "@/components/providers/login-modal-provider";
import { useSearchParams } from "next/navigation";

function LoginHandler() {
  const { open } = useLoginModal();
  const searchParams = useSearchParams();
  
  // 检测URL中的showLogin参数，如果存在则自动打开登录对话框
  useEffect(() => {
    const showLogin = searchParams.get("showLogin");
    if (showLogin === "true") {
      open();
    }
  }, [searchParams, open]);
  
  return null;
}

export default function Home() {
  const { open } = useLoginModal();
  
  return (
    <>
      <Suspense fallback={null}>
        <LoginHandler />
      </Suspense>
      <div className="flex flex-col items-center justify-center p-8 gap-4">
        <h1 className="text-2xl font-bold">Welcome</h1>
        <Button onClick={open}>Open Login Dialog</Button>
      </div>
    </>
  );
}