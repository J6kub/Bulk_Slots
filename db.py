import sqlite3

conn = sqlite3.connect('userdata.db', check_same_thread=False)

cursor = conn.cursor()

# Create a table
cursor.execute('''
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    money INTEGER
)
''')
# Commit the changes
conn.commit()

