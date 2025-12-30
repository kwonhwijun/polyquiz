// components/PostHogProvider.tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect } from "react";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // PostHog 초기화
    // 로컬 개발 시에는 실제 키가 없어도 작동하도록 설정
    const isProduction = process.env.NODE_ENV === "production";
    
    if (typeof window !== "undefined") {
      // 환경변수가 있으면 초기화, 없으면 개발 모드로 작동
      const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

      if (apiKey) {
        posthog.init(apiKey, {
          api_host: host,
          loaded: (posthog) => {
            if (!isProduction) {
              console.log("✅ PostHog 활성화 (개발 모드)");
            }
          },
          capture_pageview: false, // 수동으로 pageview 관리
          capture_pageleave: true,
        });
      } else {
        // API 키가 없으면 로컬 모드 (콘솔에만 출력)
        console.log("ℹ️ PostHog: 개발 모드 (환경변수 없음)");
      }
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

