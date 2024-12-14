from flask import session
from db import conn, cursor

def setSessionUserData():
    qd = cursor.execute("SELECT * FROM users WHERE name='" + session['username'] + "'")
    qd = qd.fetchone()
    session['money'] = qd[3]
    session['id'] = qd[0]
def log_out():
    session['username'] = ''
    session['money'] = ''
    session['id'] = ''
def setBalance(newBalance):
    cursor.execute("UPDATE users SET money=? WHERE id=?", (newBalance, session['id']))
    conn.commit()