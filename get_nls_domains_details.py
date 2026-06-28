with open('scratch/tt02_nls.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Write lines 211 to 600 to a temporary file in scratch
with open('scratch/tt02_domain_details_2.txt', 'w', encoding='utf-8') as f_out:
    f_out.write("".join(lines[210:600]))

print("Details written to scratch/tt02_domain_details_2.txt")
