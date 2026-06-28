import re
import json
import os

DOMAINS = {
    "1": "Khai thác dữ liệu và thông tin",
    "2": "Giao tiếp và hợp tác trong môi trường số",
    "3": "Sáng tạo nội dung số",
    "4": "An toàn",
    "5": "Giải quyết vấn đề",
    "6": "Ứng dụng trí tuệ nhân tạo"
}

COMPONENTS = {
    "1.1": "Duyệt, tìm kiếm và lọc dữ liệu, thông tin và nội dung số",
    "1.2": "Đánh giá dữ liệu, thông tin và nội dung số",
    "1.3": "Quản lý dữ liệu, thông tin và nội dung số",
    "2.1": "Tương tác thông qua công nghệ số",
    "2.2": "Chia sẻ thông tin và nội dung thông qua công nghệ số",
    "2.3": "Sử dụng công nghệ số để thực hiện trách nhiệm công dân",
    "2.4": "Hợp tác thông qua công nghệ số",
    "2.5": "Thực hiện quy tắc ứng xử trên mạng",
    "2.6": "Quản lý danh tính số",
    "3.1": "Phát triển nội dung số",
    "3.2": "Tích hợp và tạo lập lại nội dung số",
    "3.3": "Thực thi bản quyền và giấy phép",
    "3.4": "Lập trình",
    "4.1": "Bảo vệ thiết bị",
    "4.2": "Bảo vệ dữ liệu cá nhân và quyền riêng tư",
    "4.3": "Bảo vệ sức khỏe và an sinh số",
    "4.4": "Bảo vệ môi trường",
    "5.1": "Giải quyết các vấn đề kỹ thuật",
    "5.2": "Xác định nhu cầu và giải pháp công nghệ",
    "5.3": "Sử dụng sáng tạo công nghệ số",
    "5.4": "Xác định các vấn đề cần cải thiện về năng lực số",
    "6.1": "Hiểu biết về AI (trong đó có Gen AI)",
    "6.2": "Sử dụng AI có đạo đức và trách nhiệm",
    "6.3": "Đánh giá các công cụ AI"
}

LEVELS = {
    "CB1": "Lớp 1, 2, 3 (Cơ bản 1)",
    "CB2": "Lớp 4, 5 (Cơ bản 2)",
    "TC1": "Lớp 6, 7 (Trung cấp 1)",
    "TC2": "Lớp 8, 9 (Trung cấp 2)",
    "NC1": "Lớp 10, 11, 12 (Nâng cao 1)"
}

with open('scratch/nls_indicators.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'(\d\.\d\.(?:CB1|CB2|TC1|TC2|NC1)[a-z]?)'
matches = list(re.finditer(pattern, text))

indicators = []

for i in range(len(matches)):
    start_pos = matches[i].start()
    end_pos = matches[i+1].start() if i + 1 < len(matches) else len(text)
    
    code = matches[i].group(1)
    block = text[start_pos:end_pos].strip()
    
    # Parse domain and component from code
    parts = code.split('.')
    dom_code = parts[0]
    comp_code = f"{parts[0]}.{parts[1]}"
    
    # Parse level
    level_code = "CB1"
    for lvl in LEVELS.keys():
        if lvl in code:
            level_code = lvl
            break
            
    # Variant letter (last character if it is a letter)
    last_char = code[-1]
    variant = last_char if last_char.isalpha() else 'a'
    
    # Find the description: locate where the variant letter (e.g. "a. ", "b. ") starts
    # We look for lines in block starting with or containing "variant. "
    lines = block.split('\n')
    desc_lines = []
    found_start = False
    
    # We construct the target pattern like "a. " or "b. "
    target_start = f"{variant}."
    
    for line in lines:
        cleaned_line = line.strip()
        if not found_start:
            # We look for a line starting with target_start, or starting with variant after code
            # Example: "a. Xác định được..." or "a.  Xác định..."
            if cleaned_line.startswith(target_start) or re.match(r'^[a-z]\.\s+', cleaned_line):
                # Check if it matches our specific variant (sometimes OCR issues, so we verify)
                if cleaned_line.startswith(target_start):
                    found_start = True
                    desc_lines.append(cleaned_line)
        else:
            # Append subsequent lines, but stop if we hit another indicator code or page marker
            if re.search(r'\d\.\d\.(?:CB|TC|NC)', cleaned_line) or "Page" in cleaned_line:
                break
            desc_lines.append(cleaned_line)
            
    # Fallback if target_start not found at start of line
    if not found_start:
        for line in lines:
            cleaned_line = line.strip()
            # If line contains the target_start somewhere
            if target_start in cleaned_line:
                found_start = True
                # Extract starting from target_start
                idx = cleaned_line.find(target_start)
                desc_lines.append(cleaned_line[idx:])
            elif found_start:
                if re.search(r'\d\.\d\.(?:CB|TC|NC)', cleaned_line) or "Page" in cleaned_line:
                    break
                desc_lines.append(cleaned_line)
                
    # If still not found, fallback to taking the last 2 lines
    if not found_start and len(lines) >= 2:
        desc_lines = lines[-2:]
        
    description = " ".join(desc_lines).strip()
    # Clean description spaces and multiple dashes
    description = re.sub(r'\s+', ' ', description)
    # Remove leading variant code if present (e.g., "a. ") to standardize description, but keeping it is fine too.
    # Let's keep it as is, or clean it. Keeping it is fine.
    
    domain_name = DOMAINS.get(dom_code, "Miền năng lực khác")
    component_name = COMPONENTS.get(comp_code, "Thành phần năng lực khác")
    level_name = LEVELS.get(level_code, "Mức độ khác")
    
    indicators.append({
        "code": code,
        "domainCode": dom_code,
        "domainName": domain_name,
        "componentCode": comp_code,
        "componentName": component_name,
        "levelCode": level_code,
        "levelName": level_name,
        "description": description
    })

# Write to src/data/nls_indicators.json
os.makedirs('src/data', exist_ok=True)
output_file = 'src/data/nls_indicators.json'
with open(output_file, 'w', encoding='utf-8') as f_out:
    json.dump(indicators, f_out, ensure_ascii=False, indent=2)

print(f"Successfully parsed {len(indicators)} indicators.")
print(f"File saved to {output_file}")
