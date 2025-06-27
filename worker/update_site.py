import os
import shutil

# --- CONFIG ---
CURRENT_DIR = os.path.dirname(__file__)
COURSES_DIR = os.path.abspath(os.path.join(CURRENT_DIR, '..', 'courses'))

FILES_TO_COPY = ['index.html', 'script.js']  # filenames to replace

# --- MAIN ---
for folder_name in os.listdir(COURSES_DIR):
    folder_path = os.path.join(COURSES_DIR, folder_name)
    if os.path.isdir(folder_path):
        for filename in FILES_TO_COPY:
            src_file = os.path.join(CURRENT_DIR, filename)
            dst_file = os.path.join(folder_path, filename)
            try:
                shutil.copy2(src_file, dst_file)
                print(f"✔ Replaced {filename} in: {folder_name}")
            except Exception as e:
                print(f"✖ Failed to replace {filename} in {folder_name}: {e}")
