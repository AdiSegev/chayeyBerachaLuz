import os

files = {
    r"C:\Users\adi.CLOUD\.gemini\antigravity\brain\04a654b3-31f8-4ea7-a651-5ce40f86014c\.system_generated\steps\116\content.md": "docx.js",
    r"C:\Users\adi.CLOUD\.gemini\antigravity\brain\04a654b3-31f8-4ea7-a651-5ce40f86014c\.system_generated\steps\117\content.md": "FileSaver.js",
    r"C:\Users\adi.CLOUD\.gemini\antigravity\brain\04a654b3-31f8-4ea7-a651-5ce40f86014c\.system_generated\steps\118\content.md": "html2canvas.min.js",
    r"C:\Users\adi.CLOUD\.gemini\antigravity\brain\04a654b3-31f8-4ea7-a651-5ce40f86014c\.system_generated\steps\119\content.md": "bootstrap.min.css"
}

for md_path, target_name in files.items():
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = content.split('\n---\n\n', 1)
    if len(parts) > 1:
        actual_content = parts[1]
    else:
        actual_content = content
        
    with open(target_name, 'w', encoding='utf-8') as f:
        f.write(actual_content)
        
print("Extracted all files!")
