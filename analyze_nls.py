import re
import os

with open('scratch/nls_indicators.txt', 'r', encoding='utf-8') as f:
    lines = f.readlines()

output_path = 'scratch/nls_analysis_results.txt'

with open(output_path, 'w', encoding='utf-8') as out:
    out.write("--- DOMAINS AND COMPONENTS FOUND IN THE TEXT ---\n")
    
    domain_names = {}
    component_names = {}

    for i, line in enumerate(lines):
        # Search for domain names
        # Format: X. <domain name>
        m = re.search(r'(\d)\.\s+([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯ][a-zàáâãèéêìíòóôõùúýăđĩũơư\s&,]+)', line)
        if m:
            dom_num = m.group(1)
            name = m.group(2).strip()
            if len(name) > 5 and not name.startswith("CB") and not name.startswith("TC") and not name.startswith("NC"):
                domain_names[dom_num] = name

        # Search for components
        m_comp = re.search(r'(\d\.\d\.)\s+([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯ][a-zàáâãèéêìíòóôõùúýăđĩũơư\s&,]+)', line)
        if m_comp:
            comp_code = m_comp.group(1)
            name = m_comp.group(2).strip()
            if len(name) > 5:
                component_names[comp_code] = name

    out.write("Detected Domains:\n")
    for k, v in sorted(domain_names.items()):
        out.write(f"Domain {k}: {v}\n")

    out.write("\nDetected Components:\n")
    for k, v in sorted(component_names.items()):
        out.write(f"Component {k}: {v}\n")

    # Let's count indicators per domain
    # Code matching
    pattern = r'(\d\.\d\.(?:CB1|CB2|TC1|TC2|NC1)[a-z]?)'
    content_str = "".join(lines)
    matches = re.findall(pattern, content_str)
    unique_codes = sorted(list(set(matches)))

    out.write(f"\nTotal unique NLS codes found: {len(unique_codes)}\n")
    domains_count = {}
    for code in unique_codes:
        domain = code.split('.')[0]
        domains_count[domain] = domains_count.get(domain, 0) + 1

    out.write("\nDomain distribution:\n")
    for dom, count in sorted(domains_count.items()):
        out.write(f"Domain {dom}: {count} indicators\n")

    # Print sample lines containing Domain 6 codes
    out.write("\n--- SAMPLE DOMAIN 6 ENTRIES ---\n")
    d6_count = 0
    for i, line in enumerate(lines):
        if any(f"6.{sub}.CB" in line or f"6.{sub}.TC" in line or f"6.{sub}.NC" in line for sub in range(1, 9)):
            start = max(0, i - 2)
            end = min(len(lines), i + 12)
            out.write(f"Match at line {i+1}:\n")
            out.write("".join(lines[start:end]))
            out.write("-" * 40 + "\n")
            d6_count += 1
            if d6_count >= 10:
                break

print("Analysis run completed, output written to scratch/nls_analysis_results.txt")
