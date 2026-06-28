import sys

libs = ['pypdf', 'fitz', 'pdfplumber', 'pdfminer', 'reportlab']
for lib in libs:
    try:
        __import__(lib)
        print(f"{lib}: available")
    except ImportError:
        print(f"{lib}: not available")
