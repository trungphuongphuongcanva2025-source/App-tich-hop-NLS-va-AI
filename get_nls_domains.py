with open('scratch/tt02_nls.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's search for "1.2.2." in the text and print the surrounding lines
lines = text.split('\n')
start_line = -1
for i, line in enumerate(lines):
    if "1.2.2." in line:
        start_line = i
        break

if start_line != -1:
    print(f"Found 1.2.2. at line {start_line+1}")
    # Write surrounding 300 lines to output file
    with open('scratch/tt02_domain_definitions.txt', 'w', encoding='utf-8') as f_out:
        f_out.write("\n".join(lines[max(0, start_line-10):min(len(lines), start_line+200)]))
    print("Definitions written to scratch/tt02_domain_definitions.txt")
else:
    print("Could not find section 1.2.2.")
