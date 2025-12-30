import json
import os

cur_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(cur_dir, "..", "public", "data", "candidates.json")
# 1. 데이터를 딕셔너리 리스트로 정리 (여기는 엑셀에서 긁어오든, 손으로 치든 상관없음)
raw_data = [
    {
        "name" : "김상욱",
        "path_string" : "국민의힘 -> 무소속 -> 더불어민주당",
        "hint" : "울산"

    },
    {
        "name" : "한동훈",
        "path_string" : "국민의힘", 
        "hint" : "검사"

    },
    {
        "name" : "박찬대",
        "path_string" : "민주통합당 -> 민주당 -> 새정치민주연합 -> 더불어민주당",
        "hint" : ""
    },
    {
        "name" : "이언주",
        "path_string" : "민주통합당 -> 민주당 -> 새정치민주연합 -> 더불어민주당 -> 무소속 -> 국민의당 -> 바른미래당 -> 무소속 -> 미래를향한전진4.0 -> 미래통합당 -> 국민의힘 -> 무소속 -> 더불어민주당",
        "hint" : ""
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