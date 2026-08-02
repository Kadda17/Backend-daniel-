import sqlite3, os

DB = r'C:\Users\KADDA 17\Documents\PV_Cloud-main\pvcloud\db.sqlite3'
if not os.path.exists(DB):
    print('db not found')
    raise SystemExit(1)
conn = sqlite3.connect(DB)
cur = conn.cursor()
cur.execute("SELECT app, name, applied FROM django_migrations ORDER BY applied")
for app, name, applied in cur.fetchall():
    print(f"{applied}\t{app}\t{name}")
conn.close()
