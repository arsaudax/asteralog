#!/usr/bin/env python3
import re
import os
import sys

# Конфигурация - ЗАМЕНИТЕ НА СВОИ ДАННЫЕ!
GITHUB_USERNAME = "arsaudax"
REPO_NAME = "asteralog-images"
CDN_BASE_URL = f"https://cdn.jsdelivr.net/gh/{GITHUB_USERNAME}/{REPO_NAME}"
CONTENT_DIR = "content"

def convert_links(content):
    # Замена Markdown ссылок: ![alt](/images/file.jpg) -> ![alt](https://cdn.../images/file.jpg)
    pattern = r'(!\[.*?\]\()(/images/.*?)\)'
    replacement = rf'\1{CDN_BASE_URL}\2)'
    
    new_content, count = re.subn(pattern, replacement, content)
    
    if count > 0:
        print(f"  [OK] Заменено ссылок: {count}")
    
    return new_content

def process_files():
    print("[INFO] Поиск Markdown файлов...")
    files_processed = 0
    files_changed = 0
    
    for root, dirs, files in os.walk(CONTENT_DIR):
        for file in files:
            if file.endswith('.md'):
                filepath = os.path.join(root, file)
                files_processed += 1
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = convert_links(content)
                
                if new_content != content:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"[OK] Изменён: {filepath}")
                    files_changed += 1
    
    print(f"\n[INFO] Итого: обработано {files_processed} файлов, изменено {files_changed}")

if __name__ == "__main__":
    print("[INFO] Запуск замены ссылок на изображения...")
    process_files()
    print("[INFO] Готово!")