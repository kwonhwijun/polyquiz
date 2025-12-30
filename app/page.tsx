import path from "path";
import fs from "fs";
import QuizGame from "@/components/QuizGame";

// 1. 비동기 컴포넌트 선언 (파일 읽기는 시간이 걸리므로 async 사용)
export default async function Home() {
  
  // [1단계: 경로 찾기] 
  // process.cwd()는 현재 프로젝트의 루트 폴더를 말합니다.
  // Python의 os.path.join(os.getcwd(), "public", ...) 와 똑같습니다.
  const filePath = path.join(process.cwd(), "public", "data", "candidates.json");

  // [2단계: 파일 읽기]
  // fs.readFileSync: 파일을 열어서 텍스트 전체를 읽어옵니다. (Python의 open().read())
  const fileContents = fs.readFileSync(filePath, "utf8");

  // [3단계: 파싱]
  // 읽어온 텍스트(String)를 자바스크립트 객체/배열(List/Dict)로 변환합니다.
  // Python의 json.loads() 와 똑같습니다.
  const data = JSON.parse(fileContents);

  // [4단계: 배달]
  // QuizGame 컴포넌트(알바생)에게 data라는 이름으로 준비한 데이터를 넘겨줍니다.
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <QuizGame data={data} />
    </main>
  );
}