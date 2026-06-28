import re

with open('scratch/nls_indicators.txt', 'r', encoding='utf-8') as f:
    text = f.read()

pattern = r'(\d\.\d\.(?:CB1|CB2|TC1|TC2|NC1)[a-z]?)'
matches = list(re.finditer(pattern, text))

output_path = 'scratch/test_nls_parser_output.txt'
with open(output_path, 'w', encoding='utf-8') as out:
    out.write(f"Total indicator matches found: {len(matches)}\n\n")
    
    for i in range(min(5, len(matches))):
        start_pos = matches[i].start()
        end_pos = matches[i+1].start() if i + 1 < len(matches) else len(text)
        
        code = matches[i].group(1)
        block = text[start_pos:end_pos].strip()
        
        out.write(f"BLOCK {i+1} ({code}):\n")
        out.write(block + "\n")
        out.write("="*50 + "\n\n")

print("Output written to scratch/test_nls_parser_output.txt")
