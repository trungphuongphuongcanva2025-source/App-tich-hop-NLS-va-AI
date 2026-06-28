import re

with open('scratch/tt02_nls.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for mentions of "Miền" or "năng lực thành phần" in the text
# and write findings to scratch/tt02_summary.txt.
lines = text.split('\n')
output_path = 'scratch/tt02_summary.txt'

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("--- TT02 NLS SUMMARY RESEARCH ---\n")
    
    # Search for keywords
    keywords = ["Khung năng lực số", "miền năng lực", "Miền 1", "Miền 2", "Miền 3", "Miền 4", "Miền 5", "Miền 6"]
    out.write("Keywords occurrences:\n")
    for kw in keywords:
        matches = [i for i, line in enumerate(lines) if kw.lower() in line.lower()]
        out.write(f"- '{kw}': {len(matches)} occurrences\n")
    
    out.write("\nSample paragraphs containing domain names:\n")
    for i, line in enumerate(lines):
        if any(kw in line for kw in ["Miền 1", "Miền 2", "Miền 3", "Miền 4", "Miền 5", "Miền 6", "Năng lực thành phần"]):
            start = max(0, i - 2)
            end = min(len(lines), i + 8)
            out.write(f"[Line {i+1}]:\n")
            out.write("\n".join(lines[start:end]) + "\n")
            out.write("-" * 50 + "\n")

print("TT02 summary research completed, output written to scratch/tt02_summary.txt")
