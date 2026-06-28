import re

with open('scratch/nls_indicators.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Let's clean up formatting by joining lines inside table cells or detecting continuous text
# Actually, we can search for the core definitions.
# Domains are from 1 to 6. Let's find their full names.
# For example, "1. Khai thác dữ liệu và thông tin", "2. Giao tiếp và Hợp tác", "3. Sáng tạo nội dung số", "4. An toàn", "5. Giải quyết vấn đề", "6. Ứng dụng trí tuệ nhân tạo"
# Let's write a robust parser.

domains = {
    "1": "Khai thác dữ liệu và thông tin",
    "2": "Giao tiếp và hợp tác trong môi trường số",
    "3": "Sáng tạo nội dung số",
    "4": "An toàn",
    "5": "Giải quyết vấn đề",
    "6": "Ứng dụng trí tuệ nhân tạo"
}

# Now we want to find all unique component codes like X.Y (e.g., 1.1, 1.2, 2.1, etc.)
# and reconstruct their names by stitching the text that follows them.
# The component names are usually located after the code "X.Y" or "X.Y."
components = {}

# We will search the text for patterns like "\b(1\.\d)\b" or similar
# Let's scan lines and find component descriptions.
lines = text.split('\n')
for i, line in enumerate(lines):
    # Match component numbers: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3 etc.
    # Look for a line starting with something like: "1.1 Duyệt, tìm" or contains "6.1 Hiểu biết về"
    # Or matches code "1.1." or "1.1" followed by uppercase letters or words.
    m = re.search(r'\b(6\.[1-9]|5\.[1-9]|4\.[1-9]|3\.[1-9]|2\.[1-9]|1\.[1-9])\b', line)
    if m:
        comp_code = m.group(1)
        # Let's capture the text in this line and the next few lines to assemble the name
        # We look for where the name starts and clean it up.
        context = []
        for offset in range(0, 4):
            if i + offset < len(lines):
                l = lines[i + offset].strip()
                # Skip if it is an indicator code like 1.1.CB or contains page numbers
                if not re.search(r'\d\.\d\.(?:CB|TC|NC)', l) and "Page" not in l:
                    context.append(l)
        
        # Try to find the component name in the context
        context_str = " ".join(context)
        # Find the text after the component code
        comp_esc = comp_code.replace('.', r'\.')
        m_name = re.search(comp_esc + r'\s+([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝĂĐĨŨƠƯ\s\w,;()&./+-]+)', context_str)
        if m_name:
            comp_name = m_name.group(1).strip()
            # Clean up the name (truncate at next numbers or irrelevant terms)
            comp_name = re.split(r'\d\.\d|Mức độ|Lớp|Ở trình độ|Xác định được|Yêu cầu', comp_name)[0].strip()
            # Remove trailing dots, spaces
            comp_name = re.sub(r'[\s\.\-\,]+$', '', comp_name)
            if len(comp_name) > 4 and comp_code not in components:
                components[comp_code] = comp_name

with open('scratch/nls_full_structure.txt', 'w', encoding='utf-8') as f_out:
    f_out.write("==================================================\n")
    f_out.write("CẤU TRÚC PHÂN CẤP KHUNG NĂNG LỰC SỐ (THÔNG TƯ 02/2025)\n")
    f_out.write("==================================================\n\n")
    
    # We can pre-populate standard component names if parsing is partial, but let's see what was parsed first
    for d_num, d_name in sorted(domains.items()):
        f_out.write(f"Miền {d_num}: {d_name}\n")
        # Find components for this domain
        for c_code, c_name in sorted(components.items()):
            if c_code.startswith(d_num + "."):
                f_out.write(f"  - Thành phần {c_code}: {c_name}\n")
        f_out.write("\n")

print(f"Components found: {list(components.keys())}")
print("Hierarchy written to scratch/nls_full_structure.txt")
