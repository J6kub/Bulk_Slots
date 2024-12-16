from flask import Flask, render_template, request, session, redirect, url_for
from jinja2 import Undefined

from fire import CreateFire, btw
from gamble import CreateSlots
from flask import jsonify
from db import cursor, conn
from sqlcoms import *
import xxhash
import copy
app = Flask(__name__)
app.secret_key = "iverymuchlikemcdonaldsandmanyotherpotatothings"

@app.route('/')
def main():  # put application's code here
    if 'username' in session:
        cursor.execute('SELECT * FROM users WHERE name=?',(session['username'],))
        if len(cursor.fetchall()) > 0:
            setSessionUserData()
            return render_template('index.html', data={'name':session['username'],'money':session['money']})
    if "ErrorCodeLogin" not in session:
        session['ErrorCodeLogin'] = ''
    return render_template('login.html', data=session['ErrorCodeLogin'])

    # if logged in render index
    # else render login page

@app.route('/register', methods=['POST'])
def register():
    regData = request.form;
    hashPass = xxhash.xxh64(regData['password']).hexdigest()
    #return hashPass

    cursor.execute('SELECT * FROM users WHERE name="' + regData['name'] + '"')
    if len(cursor.fetchall()) > 0:
        session['ErrorCodeLogin'] = "User already Exists"
        return redirect(url_for('main'))
        return "User already exists!"
    else:
        cursor.execute('INSERT INTO users (name, password, money) VALUES (?, ?, ?)',(regData['name'],hashPass,1000))
        conn.commit()
        session['username'] = regData['name']
        setSessionUserData()
        return redirect(url_for('main'))

@app.route('/login', methods=['POST'])
def login():
    regData = request.form;
    hashPass = xxhash.xxh64(regData['password']).hexdigest()

    cursor.execute('SELECT * FROM users WHERE name="' + regData['name'] + '" AND password="' + hashPass + '"')
    userData = cursor.fetchall();
    if len(userData) > 0:
        session['username'] = userData[0][1]
        return redirect(url_for('main'))
    else:
        session['ErrorCodeLogin'] = "Invalid Credentials"
        return redirect(url_for('main'))
        return 'wrong password or username'


@app.route('/bulkslots')
def bulkslots():
    return render_template('bulk.html',
                           data=["Linus", "Headset", "Gpu", "Energy", "Camera", "Card", "Printer", "Tysk"])

@app.route('/GetSlots', methods=['GET'])
def get_slots():
    setSessionUserData()
    # function to check balance
    betReq = int(request.args.get('bet'))
    if betReq <= 0:
        betReq = 1
    if session['money'] >= betReq:
        res = CreateSlots(betReq)
        session['money'] += (-betReq + res['winnings'])
        setBalance(session['money'])
    else:
        res = {"balance":0}
    #return jsonify(CheckWin(res['symbols']))

    # function to Update database

    return jsonify(res)

@app.route('/GetUserData')
def getUserData():
    setSessionUserData()
    userData = {
        'name': session['username'],
        'money': session['money']
    }
    return jsonify(userData)

@app.route('/logout')
def logout():
    log_out()
    return redirect(url_for('main'))

@app.route('/fire')
def fire():
    return render_template('firefighter.html')
@app.route('/GetFire', methods=['GET'])
def getFire():

    try:
        setSessionUserData()
    except:
        return redirect(url_for('main'))

    if 'fire' not in session:
        fire = CreateFire()
        session['fire'] = fire


    if request.args.get('x') and request.args.get('y'):
        RetFire = {
            "x": int(request.args.get('x')),
            "y": int(request.args.get('y'))
        }
        fire = session['fire']
        if btw(RetFire["x"], fire["x"], fire["x"] + fire["size"]) and btw(RetFire["y"], fire["y"], fire["y"] + fire["size"]):
            setBalance(session['money'] + fire["size"])
            fire = CreateFire()
            session['fire'] = fire

    output = {
        'userdata': {
            'name': session['username'],
            'money':session['money']
        },
        'firedata':session['fire']
    }

    return jsonify(output)

if __name__ == '__main__':
    app.run()
