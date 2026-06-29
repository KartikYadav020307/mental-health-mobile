import re
import os
import uuid
import sys

# Paths
MIGRATIONS_DIR = r"C:\Users\yamle\OneDrive\Desktop\Mental Health App\serenova-mobile\supabase\migrations"
SEED_FILE_PATH = os.path.join(MIGRATIONS_DIR, "20260627000004_seed_data.sql")
SCHEMA_FILE_PATH = os.path.join(MIGRATIONS_DIR, "20260627000001_create_core_tables.sql")

def check_uuid_v4_compliance():
    print("=== Checking UUID v4 Compliance ===")
    
    # Regex to find any UUID in SQL files
    uuid_pattern = re.compile(r'\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b')
    
    violations = []
    total_checked = 0
    
    for filename in os.listdir(MIGRATIONS_DIR):
        if not filename.endswith('.sql'):
            continue
        
        file_path = os.path.join(MIGRATIONS_DIR, filename)
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        uuids = uuid_pattern.findall(content)
        for u in uuids:
            total_checked += 1
            try:
                parsed_uuid = uuid.UUID(u)
                if parsed_uuid.version != 4:
                    violations.append((filename, u, f"Parsed version is {parsed_uuid.version} instead of 4"))
            except ValueError as e:
                violations.append((filename, u, f"Invalid UUID format: {str(e)}"))
                
    print(f"Total UUIDs checked: {total_checked}")
    if violations:
        print(f"FAIL: Found {len(violations)} non-compliant UUIDs!")
        for file, u, reason in violations:
            print(f"  - In {file}: {u} ({reason})")
        return False
    else:
        print("PASS: All checked UUIDs are strictly RFC 4122 v4 compliant!")
        return True

def check_course_session_count_alignment():
    print("\n=== Checking Course Session Count Alignment ===")
    if not os.path.exists(SEED_FILE_PATH):
        print(f"Seed file not found at {SEED_FILE_PATH}")
        return False
        
    with open(SEED_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Let's extract course definitions and their session_count
    # Example course insert values format:
    # (
    #   'c0a0c0a0-c0a0-4c0a-ac0a-c0a0c0a0c0a0', 
    #   'Introduction to Mindfulness', 
    #   ..., 
    #   10,
    #   ...
    # )
    
    # We will write a simple parser to parse INSERT INTO public.courses
    # and INSERT INTO public.sessions
    
    courses = {}
    sessions = []
    
    # Find block of courses insert
    courses_match = re.search(r'INSERT INTO public\.courses\s*\([^)]*\)\s*VALUES\s*(.*?);', content, re.DOTALL | re.IGNORECASE)
    if courses_match:
        values_str = courses_match.group(1)
        # Parse individual tuples: (id, title, description, category, session_count, xp_reward, icon)
        # We can extract values using regular expressions on items inside parentheses
        items = re.findall(r'\(\s*(.*?)\s*\)', values_str, re.DOTALL)
        for item in items:
            # Split by comma but handle single quotes and newlines
            # Since the fields are simple, we can clean up:
            parts = [p.strip().strip("'") for p in re.split(r',\s*(?![^\']*\'(,\s*|$))', item)]
            if len(parts) >= 7:
                c_id = parts[0]
                c_title = parts[1]
                try:
                    c_session_count = int(parts[4])
                except ValueError:
                    c_session_count = 0
                courses[c_id] = {
                    'title': c_title,
                    'session_count': c_session_count,
                    'actual_sessions_count': 0
                }
    else:
        print("WARNING: Could not parse courses INSERT block using regex.")
        
    # Find block of sessions insert
    sessions_match = re.search(r'INSERT INTO public\.sessions\s*\([^)]*\)\s*VALUES\s*(.*?);', content, re.DOTALL | re.IGNORECASE)
    if sessions_match:
        values_str = sessions_match.group(1)
        items = re.findall(r'\(\s*(.*?)\s*\)', values_str, re.DOTALL)
        for item in items:
            parts = [p.strip().strip("'") for p in re.split(r',\s*(?![^\']*\'(,\s*|$))', item)]
            # In sessions INSERT:
            # (id, title, category, type, duration_sec, audio_url, narrator, order_in_course, xp_reward, icon, course_id)
            if len(parts) >= 11:
                s_id = parts[0]
                s_title = parts[1]
                s_course_id = parts[10]
                if s_course_id and s_course_id != 'NULL':
                    sessions.append({
                        'id': s_id,
                        'title': s_title,
                        'course_id': s_course_id
                    })
    else:
        print("WARNING: Could not parse sessions INSERT block using regex.")
        
    # Count sessions for each course
    for s in sessions:
        cid = s['course_id']
        if cid in courses:
            courses[cid]['actual_sessions_count'] += 1
        else:
            print(f"WARNING: Session {s['title']} ({s['id']}) references non-existent course_id {cid}")
            
    # Check alignment
    mismatches = []
    print(f"Found {len(courses)} courses and {len(sessions)} sessions referencing courses in seed data.")
    for cid, info in courses.items():
        expected = info['session_count']
        actual = info['actual_sessions_count']
        print(f"Course: '{info['title']}' ({cid})")
        print(f"  - Expected Session Count (from column): {expected}")
        print(f"  - Actual Seeded Sessions: {actual}")
        if expected != actual:
            mismatches.append((cid, info['title'], expected, actual))
            
    if mismatches:
        print("\nFAIL: Found course session count mismatches!")
        for cid, title, exp, act in mismatches:
            print(f"  - Course '{title}' ({cid}) has expected {exp} but {act} seeded.")
        return False
    else:
        print("\nPASS: All course session counts are aligned with the seeded sessions!")
        return True

if __name__ == "__main__":
    uuid_ok = check_uuid_v4_compliance()
    alignment_ok = check_course_session_count_alignment()
    if uuid_ok and alignment_ok:
        print("\nAll database checks PASSED.")
        sys.exit(0)
    else:
        print("\nSome database checks FAILED.")
        sys.exit(1)
