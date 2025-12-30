// hooks/useAnalytics.ts
"use client";

import { usePostHog } from "posthog-js/react";

export function useAnalytics() {
  const posthog = usePostHog();

  // 로컬 개발 시 콘솔에 출력하는 fallback
  const logEvent = (eventName: string, properties?: Record<string, any>) => {
    if (posthog) {
      posthog.capture(eventName, properties);
    } else {
      console.log(`📊 Analytics Event: ${eventName}`, properties);
    }
  };

  return {
    // 퀴즈 시작
    trackQuizStart: () => {
      logEvent("quiz_started", {
        timestamp: new Date().toISOString(),
      });
    },

    // 문제 표시
    trackQuestionViewed: (questionId: number, candidateName: string) => {
      logEvent("question_viewed", {
        question_id: questionId,
        candidate_name: candidateName,
      });
    },

    // 정답 제출
    trackAnswerSubmitted: (
      questionId: number,
      candidateName: string,
      userAnswer: string,
      isCorrect: boolean,
      timeSpent?: number
    ) => {
      logEvent("answer_submitted", {
        question_id: questionId,
        candidate_name: candidateName,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_spent_seconds: timeSpent,
      });
    },

    // 게임 완료
    trackQuizCompleted: (
      score: number,
      totalQuestions: number,
      timeSpent?: number
    ) => {
      logEvent("quiz_completed", {
        score: score,
        total_questions: totalQuestions,
        accuracy: score / totalQuestions,
        time_spent_seconds: timeSpent,
      });
    },

    // 공유 버튼 클릭
    trackShareClicked: (platform: string, score: number) => {
      logEvent("share_clicked", {
        platform: platform,
        score: score,
      });
    },

    // 게임 재시작
    trackQuizRestarted: (score: number) => {
      logEvent("quiz_restarted", {
        previous_score: score,
      });
    },

    // 이탈 (특정 문제에서)
    trackDropOff: (questionId: number, candidateName: string) => {
      logEvent("quiz_drop_off", {
        question_id: questionId,
        candidate_name: candidateName,
      });
    },
  };
}

