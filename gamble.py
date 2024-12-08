import random

def CreateSlots():
    lines = [];
    symbols = []
    for i in range(5):
        line = createLine()
        lines.append(line)
        symbols.append(list(map(translator,line)))
    wins = CheckWin(symbols)

    randoms = {"lines": lines, "symbols": symbols, 'winnings': wins['winnings'], 'winlines':wins['lines']}

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
    return 'Camera'

PossibleSlots = ["Linus", "Headset", "Gpu", "Energy", "Camera", "Card", "Printer", "Tysk"]

def CheckWin(symbols):
    winnings = 0
    num_rows = len(symbols)
    num_cols = len(symbols[0]) if symbols else 0

    lines = [[0 for _ in range(num_cols)] for _ in range(num_rows)]

    for i, row in enumerate(symbols):
        for symbol in PossibleSlots:
            count = row.count(symbol)
            if count >= 3:
                winnings += count * 10
                for j in range(num_cols):
                    if row[j] == symbol:
                        lines[i][j] = 1

    for col in range(num_cols):
        col_symbols = [symbols[row][col] for row in range(num_rows)]
        for symbol in PossibleSlots:
            count = col_symbols.count(symbol)
            if count >= 3:
                winnings += count * 5
                for row in range(num_rows):
                    if symbols[row][col] == symbol:
                        lines[row][col] = 1

    return {'winnings': winnings, 'lines': lines}






