import random as rr
from flask import session

def CreateFire():
    print('Creating fire')
    fsize = rr.randint(100, 200)
    fire = {
        'size':fsize,
        'x':rr.randint(0, 1000 - fsize),
        'y':rr.randint(0, 500 - fsize),
        'id':rr.randint(0, 99999999)
    }
    return fire

def btw(a, b, c):
    return a > b and a < c

def CheckResponse():
    print('Checking response')




