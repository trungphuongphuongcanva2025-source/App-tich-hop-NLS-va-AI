import re

with open('scratch/ai_framework.txt', 'r', encoding='utf-8') as f:
    text = f.read()

lines = text.split('\n')
output_path = 'scratch/ai_summary.txt'

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("--- AI FRAMEWORK ANALYSIS (QĐ 3439) ---\n")
    
    # Search for codes NLa, NLb, NLc, NLd
    patterns = [r'NL[a-d]', r'NLa', r'NLb', r'NLc', r'NLd']
    out.write("Code occurrences:\n")
    for pat in patterns:
        matches = re.findall(pat, text)
        out.write(f"- Pattern '{pat}': {len(matches)} matches\n")
        
    out.write("\nFinding lines with NL codes:\n")
    found_lines = 0
    for i, line in enumerate(lines):
        if any(code in line for code in ["NLa", "NLb", "NLc", "NLd"]):
            start = max(0, i - 2)
            end = min(len(lines), i + 8)
            out.write(f"[Line {i+1}]:\n")
            out.write("\n".join(lines[start:end]) + "\n")
            out.write("-" * 50 + "\n")
            found_lines += 1
            if found_lines >= 30:
                break
                
    # Search for grade levels e.g. "Tieu hoc", "Trung hoc co so", "Trung hoc pho thong"
    out.write("\nSearch for levels:\n")
    for lvl in ["tieu hoc", "trung hoc co so", "trung hoc pho thong"]:
        matches = [i for i, line in enumerate(lines) if lvl in line.lower()]
        out.write(f"- '{lvl}': {len(matches)} occurrences\n")

print("AI framework analysis completed, output written to scratch/ai_summary.txt")
