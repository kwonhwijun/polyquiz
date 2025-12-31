// components/QuizGame.tsx
"use client"; // 브라우저에서 작동

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { Candidate } from "@/app/types";
import ShareButtons from "./ShareButtons";
import { useAnalytics } from "@/hooks/useAnalytics";

interface Props {
  data: Candidate[]; // 부모에게서 받을 데이터의 타입 정의
}

export default function QuizGame({ data }: Props) {
  // Analytics
  const analytics = useAnalytics();

  // State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shake, setShake] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  const currentCandidate = data[currentIndex];
  const totalQuestions = data.length;

  // 퀴즈 시작 트래킹
  useEffect(() => {
    analytics.trackQuizStart();
  }, []);

  // 문제 변경 시 트래킹
  useEffect(() => {
    if (currentCandidate) {
      analytics.trackQuestionViewed(currentCandidate.id, currentCandidate.name);
      setQuestionStartTime(Date.now());
    }
  }, [currentIndex]);

  // 정답 체크 함수
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrect = currentCandidate.name.toLowerCase();
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    const correct = normalizedAnswer === normalizedCorrect;

    // Analytics 트래킹
    analytics.trackAnswerSubmitted(
      currentCandidate.id,
      currentCandidate.name,
      userAnswer,
      correct,
      timeSpent
    );

    if (correct) {
      // 정답!
      setIsCorrect(true);
      setScore(score + 1);
      setShowConfetti(true);
      
      // 3초 후 confetti 종료
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      // 오답!
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  // 다음 문제로
  const handleNext = () => {
    if (currentIndex + 1 < totalQuestions) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer("");
      setIsCorrect(null);
    } else {
      // 게임 종료
      const totalTime = Math.floor((Date.now() - startTime) / 1000);
      analytics.trackQuizCompleted(score, totalQuestions, totalTime);
      setIsGameOver(true);
    }
  };

  // 게임 재시작
  const handleRestart = () => {
    analytics.trackQuizRestarted(score);
    setCurrentIndex(0);
    setUserAnswer("");
    setIsCorrect(null);
    setScore(0);
    setIsGameOver(false);
    setStartTime(Date.now());
  };

  // 게임 종료 화면
  if (isGameOver) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center"
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-bold text-gray-800 mb-6"
          >
            🎉 게임 종료! 🎉
          </motion.h1>
          
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-8 mb-8"
          >
            <p className="text-white text-2xl md:text-3xl font-bold mb-2">
              당신의 정치력 점수는
            </p>
            <p className="text-white text-6xl md:text-7xl font-extrabold">
              {score}/{totalQuestions}
            </p>
            <p className="text-white text-xl mt-2">
              {score === totalQuestions
                ? "완벽합니다! 정치 박사님! 👑"
                : score >= totalQuestions * 0.7
                ? "대단해요! 정치 고수시네요! 🔥"
                : score >= totalQuestions * 0.4
                ? "괜찮아요! 조금만 더 공부하세요! 📚"
                : "아직 멀었어요! 뉴스 좀 보세요! 📰"}
            </p>
          </motion.div>

          {/* 소셜 공유 버튼 */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-6"
          >
            <ShareButtons score={score} totalQuestions={totalQuestions} />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRestart}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:shadow-xl transition-shadow"
          >
            🔄 다시 도전하기
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // 퀴즈 진행 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="w-full max-w-4xl">
        {/* 상단 정보 바 */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-6 flex justify-between items-center"
        >
          <div className="text-lg font-bold text-gray-700">
            문제 {currentIndex + 1} / {totalQuestions}
          </div>
          <div className="text-lg font-bold text-blue-600">
            점수: {score}점
          </div>
        </motion.div>

        {/* 메인 퀴즈 카드 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
              이 사람은 누구일까요? 🤔
            </h2>

            {/* 힌트 */}
            {currentCandidate.initialHint && (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
                <p className="text-yellow-800 font-semibold">
                  💡 힌트: {currentCandidate.initialHint}
                </p>
              </div>
            )}

            {/* 정당 이동 경로 */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4 text-center">
                🗳️ 정당 이동 경로
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {currentCandidate.partyPath.map((party, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="bg-white px-4 py-3 md:px-4 md:py-3 rounded-xl shadow-md border-2 border-blue-300 font-bold text-sm md:text-base text-gray-800 text-center min-w-[100px] md:min-w-[120px]">
                      {party}
                    </div>
                    {idx < currentCandidate.partyPath.length - 1 && (
                      <div className="text-3xl text-blue-500 font-bold">→</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 정답 입력 폼 */}
            {isCorrect === null ? (
              <motion.form
                onSubmit={handleSubmit}
                animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="정치인 이름을 입력하세요"
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-shadow"
                >
                  정답 제출하기 ✨
                </button>
              </motion.form>
            ) : (
              <div>
                {/* 정답/오답 표시 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className={`p-6 rounded-2xl mb-6 text-center ${
                    isCorrect
                      ? "bg-green-100 border-2 border-green-500"
                      : "bg-red-100 border-2 border-red-500"
                  }`}
                >
                  <p className={`text-2xl font-bold mb-2 ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}>
                    {isCorrect ? "🎉 정답입니다!" : "❌ 틀렸습니다!"}
                  </p>
                  <p className="text-xl text-gray-700">
                    정답: <span className="font-bold">{currentCandidate.name}</span>
                  </p>
                </motion.div>

                {/* 다음 문제 버튼 */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-shadow"
                >
                  {currentIndex + 1 < totalQuestions
                    ? "다음 문제로 →"
                    : "결과 보기 🏆"}
                </motion.button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}