import json
import os

cur_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(cur_dir, "..", "public", "data", "candidates.json")
# 1. 데이터를 딕셔너리 리스트로 정리 (여기는 엑셀에서 긁어오든, 손으로 치든 상관없음)
# 1. 데이터를 딕셔너리 리스트로 정리
raw_data = [
    # --- 기존 데이터 ---
    {
        "name": "김상욱",
        "path_string": "국민의힘 -> 무소속 -> 더불어민주당",
        "hint": "울산"
    },
    {
        "name": "한동훈",
        "path_string": "국민의힘",
        "hint": "검사"
    },
    {
        "name": "박찬대",
        "path_string": "민주통합당 -> 민주당 -> 새정치민주연합 -> 더불어민주당",
        "hint": ""
    },
    {
        "name": "이언주",
        "path_string": "민주통합당 -> 민주당 -> 새정치민주연합 -> 더불어민주당 -> 무소속 -> 국민의당 -> 바른미래당 -> 무소속 -> 미래를향한전진4.0 -> 미래통합당 -> 국민의힘 -> 무소속 -> 더불어민주당",
        "hint": ""
    },
    # --- 추가된 데이터 (변환 완료) ---
    {
        "name": "이재명",
        "path_string": "열린우리당 -> 대통합민주신당 -> 통합민주당 -> 민주당 -> 민주통합당 -> 새정치민주연합 -> 더불어민주당",
        "hint": "성남시장 출신, 경기도지사 역임, 대선 후보, 사이다 발언, 험지 안동"
    },
    {
        "name": "윤석열",
        "path_string": "무소속 -> 국민의힘",
        "hint": "검찰총장 출신, 사람에 충성하지 않는다, 9수 끝에 사법시험 합격, 제20대 대통령"
    },
    {
        "name": "이준석",
        "path_string": "새누리당 -> 바른정당 -> 바른미래당 -> 새로운보수당 -> 미래통합당 -> 국민의힘 -> 개혁신당",
        "hint": "하버드대 졸업, 박근혜 키즈, 30대 제1야당 대표, 0선 중진, 경기 화성 을"
    },
    {
        "name": "안철수",
        "path_string": "새정치민주연합 -> 국민의당 -> 바른미래당 -> 국민의당 -> 국민의힘",
        "hint": "의사 출신 벤처기업가, V3 개발, 새정치, 마라톤, 대선 단일화"
    },
    {
        "name": "심상정",
        "path_string": "민주노동당 -> 진보신당 -> 통합진보당 -> 정의당 -> 녹색정의당 -> 정의당",
        "hint": "진보 정당 최초 4선, 철의 여인, 경기 고양갑, 노동운동가, 대선 후보"
    },
    {
        "name": "이낙연",
        "path_string": "새천년민주당 -> 민주당 -> 민주통합당 -> 새정치민주연합 -> 더불어민주당 -> 새로운미래 -> 새미래민주당",
        "hint": "동아일보 기자, 전라남도지사, 최장수 국무총리, 엄중하다, NY"
    },
    {
        "name": "황교안",
        "path_string": "자유한국당 -> 미래통합당 -> 국민의힘 -> 자유와혁신",
        "hint": "공안 검사 출신, 법무부장관, 국무총리, 대통령 권한대행, 부정선거 이슈 제기"
    },
    {
        "name": "김기현",
        "path_string": "한나라당 -> 새누리당 -> 자유한국당 -> 미래통합당 -> 국민의힘",
        "hint": "판사 출신, 울산광역시장, 보수 정당 원내대표 및 당대표, 고래고기 사건 의혹 무혐의"
    },
    {
        "name": "박지원",
        "path_string": "민주당 -> 새정치국민회의 -> 새천년민주당 -> 대통합민주신당 -> 민주당 -> 민주통합당 -> 국민의당 -> 민주평화당 -> 민생당 -> 더불어민주당",
        "hint": "DJ의 영원한 비서실장, 정치 9단, 국정원장, 전남 목포 및 해남완도진도"
    },
    {
        "name": "정세균",
        "path_string": "새정치국민회의 -> 새천년민주당 -> 열린우리당 -> 대통합민주신당 -> 통합민주당 -> 민주당 -> 민주통합당 -> 새정치민주연합 -> 더불어민주당",
        "hint": "쌍용그룹 상무 출신, 산업자원부 장관, 국회의장, 국무총리, 미스터 스마일"
    }
]
# 2. 가공 (ETL)
processed_data = []
for idx, person in enumerate(raw_data):
    # 화살표로 문자열 쪼개서 리스트로 변환 (공백 제거)
    path_list = [p.strip() for p in person["path_string"].split("->")]
    
    processed_data.append({
        "id": idx + 1,
        "name": person["name"],
        "partyPath": path_list, # 배열로 변환됨! ["통일민주당", "민주자유당", ...]
        "currentParty": path_list[-1], # 마지막 당이 현재 당
        "initialHint": person["hint"]
    })
os.makedirs(os.path.dirname(output_path), exist_ok=True)
# 3. 파일로 저장 (public 폴더로 바로 쏘기)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(processed_data, f, ensure_ascii=False, indent=2)

print("✅ JSON 생성 완료!")