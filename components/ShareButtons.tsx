// components/ShareButtons.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAnalytics } from "@/hooks/useAnalytics";

interface ShareButtonsProps {
  score: number;
  totalQuestions: number;
}

export default function ShareButtons({ score, totalQuestions }: ShareButtonsProps) {
  const analytics = useAnalytics();
  const [copied, setCopied] = useState(false);

  // 점수 평가 메시지
  const getScoreMessage = () => {
    if (score === totalQuestions) return "완벽합니다! 정치 박사님! 👑";
    if (score >= totalQuestions * 0.7) return "대단해요! 정치 고수시네요! 🔥";
    if (score >= totalQuestions * 0.4) return "괜찮아요! 조금만 더 공부하세요! 📚";
    return "아직 멀었어요! 뉴스 좀 보세요! 📰";
  };

  // 공유 텍스트 생성
  const getShareText = () => {
    return `한국 정치인 정당 이동 퀴즈 결과\n\n🎯 내 점수: ${score}/${totalQuestions}점\n${getScoreMessage()}\n\n당신도 도전해보세요!`;
  };

  // 현재 URL (나중에 실제 도메인으로 변경)
  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href.split("?")[0]; // 쿼리스트링 제거
    }
    return "http://localhost:3000";
  };

  // URL 복사
  const copyUrl = async () => {
    analytics.trackShareClicked("url_copy", score);
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  // 트위터 공유
  const shareToTwitter = () => {
    analytics.trackShareClicked("twitter", score);
    const text = encodeURIComponent(getShareText());
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
      "width=550,height=420"
    );
  };

  // 카카오톡 공유 (서버 배포 후 활성화)
  const shareToKakao = () => {
    analytics.trackShareClicked("kakao", score);
    alert("카카오톡 공유는 웹사이트를 서버에 배포한 후 사용할 수 있습니다! 🚀\n지금은 'URL 복사'를 이용해주세요.");
    // 실제 배포 후에는 Kakao SDK를 사용하여 구현
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">
        📢 친구들에게 자랑하기
      </h3>
      
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* 카카오톡 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToKakao}
          className="bg-[#FEE500] text-[#000000] px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-2xl">💬</span>
          카카오톡
        </motion.button>

        {/* 트위터 */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareToTwitter}
          className="bg-[#1DA1F2] text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-shadow"
        >
          <span className="text-2xl">𝕏</span>
          트위터
        </motion.button>
      </div>

      {/* URL 복사 버튼 */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={copyUrl}
        className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all ${
          copied
            ? "bg-green-500 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <span className="text-xl">{copied ? "✅" : "🔗"}</span>
        {copied ? "URL 복사 완료!" : "URL 복사하기"}
      </motion.button>

      <p className="text-sm text-gray-500 text-center mt-3">
        💡 링크를 복사해서 다른 SNS에도 공유하세요!
      </p>
    </div>
  );
}

