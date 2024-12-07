from flask import Flask, render_template
from gamble import CreateSlots
from flask import jsonify
app = Flask(__name__)


@app.route('/')
def hello_world():  # put application's code here
    return render_template('index.html', data=["Linus","Headset","Gpu","Energy","Camera","Card","Printer","Tysk"])

@app.route('/GetSlots')
def get_slots():

    # function to check balance

    res = CreateSlots()

    # function to Update database

    return jsonify(res)


if __name__ == '__main__':
    app.run()
