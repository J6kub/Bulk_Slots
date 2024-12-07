import random

def CreateSlots():
    lines = [];
    symbols = []
    for i in range(5):
        line = createLine()
        lines.append(line)
        symbols.append(list(map(translator,line)))

    randoms = {"lines": lines, "symbols": symbols}

    return randoms


maxDraw = 1000
def createLine():
    a = random.randint(1, maxDraw)
    b = random.randint(1, maxDraw)
    c = random.randint(1, maxDraw)
    return [a,b,c]

def translator(a):
    match a:
        case _ if a in range(0,100):
            return 'Linus'
        case _ if a in range(101,200):
            return "Headset"
        case _ if a in range(201, 300):
            return 'Gpu'
        case _ if a in range(301, 400):
            return "Energy"
        case _ if a in range(401, 500):
            return 'Camera'
        case _ if a in range(501, 600):
            return "Card"
        case _ if a in range(601, 700):
            return 'Printer'
        case _ if a in range(701, 1000):
            return "Tysk"

def CheckWin(slots):
    Money = 0
    '''
    for col,i in slots["symbols"]: // First check of rows
        print(col)
        for symbol in col:
            for index,col in slots["symbols"]:
                if symbol == col:
    
    '''


