from flask import Flask, render_template
from gamble import CreateSlots
from flask import jsonify
app = Flask(__name__)


@app.route('/')
def main():  # put application's code here
    return render_template('index.html')

    # if logged in render index
    # else render login page

@app.route('/bulkslots')
def bulkslots():
    return render_template('bulk.html',
                           data=["Linus", "Headset", "Gpu", "Energy", "Camera", "Card", "Printer", "Tysk"])

@app.route('/GetSlots')
def get_slots():

    # function to check balance

    res = CreateSlots()
    #return jsonify(CheckWin(res['symbols']))

    # function to Update database

    return jsonify(res)

@app.route('/register')
def register():
    return ;

if __name__ == '__main__':
    app.run()
