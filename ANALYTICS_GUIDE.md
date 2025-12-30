# 📊 Analytics 가이드

## 개요

이 프로젝트는 **PostHog**를 사용하여 사용자 행동을 추적합니다. 로컬 개발 시에는 콘솔에 로그만 출력되며, 실제 배포 시 PostHog 계정을 연결하면 강력한 분석 기능을 사용할 수 있습니다.

## 🚀 빠른 시작

### 로컬 개발 (현재)
별도 설정 없이 바로 작동합니다. 브라우저 콘솔(F12)에서 이벤트 로그를 확인할 수 있습니다:

```
📊 Analytics Event: quiz_started { timestamp: "..." }
📊 Analytics Event: question_viewed { question_id: 1, candidate_name: "김상욱" }
```

### 실제 배포 시 (나중에)
1. https://posthog.com 에서 무료 계정 생성
2. 프로젝트 생성 후 API 키 발급
3. `.env.local` 파일 생성:

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key_here
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

4. 배포 후 PostHog 대시보드에서 실시간 데이터 확인

## 📈 수집되는 데이터

### 1. quiz_started
- **언제**: 사용자가 첫 문제를 볼 때
- **데이터**: 타임스탬프

### 2. question_viewed
- **언제**: 새로운 문제가 표시될 때
- **데이터**:
  - `question_id`: 문제 ID
  - `candidate_name`: 정답 후보자 이름

### 3. answer_submitted
- **언제**: 사용자가 정답을 제출할 때
- **데이터**:
  - `question_id`: 문제 ID
  - `candidate_name`: 정답 후보자 이름
  - `user_answer`: 사용자가 입력한 답
  - `is_correct`: 정답 여부
  - `time_spent_seconds`: 문제 푸는데 걸린 시간

### 4. quiz_completed
- **언제**: 모든 문제를 풀고 결과 화면에 도달할 때
- **데이터**:
  - `score`: 맞춘 문제 수
  - `total_questions`: 전체 문제 수
  - `accuracy`: 정답률 (0~1)
  - `time_spent_seconds`: 전체 소요 시간

### 5. share_clicked
- **언제**: 공유 버튼을 클릭할 때
- **데이터**:
  - `platform`: 공유 플랫폼 (twitter, kakao, url_copy)
  - `score`: 최종 점수

### 6. quiz_restarted
- **언제**: "다시 도전하기" 버튼을 클릭할 때
- **데이터**:
  - `previous_score`: 이전 점수

## 💡 활용 방법

### PostHog에서 확인할 수 있는 인사이트:

1. **이탈률 분석**
   - 어떤 문제에서 사용자들이 가장 많이 이탈하는가?
   - → 난이도 조정 또는 힌트 추가

2. **오답 패턴**
   - "이언주" 문제에 "김종인"을 많이 쓴다?
   - → 다음 콘텐츠 소재 발굴!

3. **공유 전환율**
   - 점수가 높은 사람이 공유를 더 많이 하는가?
   - → 점수별 차별화된 공유 메시지

4. **문제 난이도**
   - 평균 정답률이 가장 낮은 문제는?
   - → 순서 조정 또는 힌트 강화

5. **소요 시간 분석**
   - 사용자들이 문제당 평균 몇 초를 쓰는가?
   - → UI/UX 개선 포인트

## 🔥 고급 분석 (PostHog)

PostHog 대시보드에서 Funnel 분석을 만들어보세요:

```
quiz_started (100%)
  ↓
question_viewed (문제1) (90%)
  ↓
answer_submitted (문제1) (85%)
  ↓
question_viewed (문제2) (80%)
  ↓
...
  ↓
quiz_completed (60%)
  ↓
share_clicked (20%)
```

이 퍼널에서 가장 큰 이탈이 어디서 발생하는지 확인하세요!

## 🛡️ 개인정보 보호

- 개인 식별 정보(이메일, 이름 등)는 수집하지 않습니다
- IP 주소는 익명화됩니다
- 사용자가 입력한 "오답"만 수집됩니다 (분석 목적)

## 📊 대시보드 추천 설정

PostHog 가입 후 다음 대시보드를 만드세요:

1. **일일 활성 사용자 (DAU)**
2. **평균 정답률 트렌드**
3. **문제별 난이도 (정답률)**
4. **공유 전환율**
5. **이탈률 퍼널**

---

**참고**: 로컬 개발 중에는 모든 이벤트가 브라우저 콘솔에 출력됩니다. F12를 눌러서 확인해보세요!

