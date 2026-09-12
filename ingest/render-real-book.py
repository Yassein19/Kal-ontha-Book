import fitz  # PyMuPDF
import os
import sys

if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PDF_PATH = r"C:\Users\yassein ahmed\Downloads\عيشي كأنثي.pdf"
OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend/storage/pages"))

os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Opening PDF...")
doc = fitz.open(PDF_PATH)
total_pages = len(doc)
print(f"Total pages in book: {total_pages}")

# Matrix 1.5 gives great balance between crisp text (approx 1000px wide) and fast loading
zoom_matrix = fitz.Matrix(1.5, 1.5)

for i in range(total_pages):
    page_num = i + 1
    page = doc[i]
    pix = page.get_pixmap(matrix=zoom_matrix, alpha=False)
    
    out_file = os.path.join(OUTPUT_DIR, f"page_{page_num}.png")
    pix.save(out_file)
    
    if page_num % 30 == 0 or page_num == total_pages:
        print(f"Rendered {page_num}/{total_pages} pages...")

print("SUCCESS: All pages rendered into backend/storage/pages!")
