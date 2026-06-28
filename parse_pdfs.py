import pypdf
import os
import sys

# Set standard output encoding to utf-8 if possible
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

os.makedirs('scratch', exist_ok=True)

def extract_pdf_text(pdf_path, txt_path, max_pages=None):
    if not os.path.exists(pdf_path):
        print(f"File not found: {pdf_path.encode('ascii', 'ignore').decode('ascii')}")
        return
    print(f"Extracting to {txt_path}...")
    reader = pypdf.PdfReader(pdf_path)
    text = ""
    num_pages = len(reader.pages)
    limit = min(num_pages, max_pages) if max_pages else num_pages
    for i in range(limit):
        text += f"--- Page {i+1} ---\n"
        page_text = reader.pages[i].extract_text()
        if page_text:
            text += page_text + "\n"
        else:
            text += "[No text found on this page]\n"
    with open(txt_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print(f"Extracted {limit}/{num_pages} pages successfully.")

extract_pdf_text('Thông tư 02 - Tai lieu tap huan phat trien NLS.pdf', 'scratch/tt02_nls.txt')
extract_pdf_text('3439-khung-noi-dung-ai-thi-diem_155202614.pdf', 'scratch/ai_framework.txt', max_pages=40)
