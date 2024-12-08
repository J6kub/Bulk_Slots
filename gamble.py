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

def CheckWin(slots):
    Money = 0
    '''
    for col,i in slots["symbols"]: // First check of rows
        print(col)
        for symbol in col:
            for index,col in slots["symbols"]:
                if symbol == col:
    
    '''
# PossibleSlots
PossibleSlots = ["Linus", "Headset", "Gpu", "Energy", "Camera", "Card", "Printer", "Tysk"]

def CheckWin(symbols):
    winnings = 0
    num_rows = len(symbols)
    num_cols = len(symbols[0]) if symbols else 0

    # Initialize the lines array with zeros
    lines = [[0 for _ in range(num_cols)] for _ in range(num_rows)]

    # Traverse through the symbols to calculate winnings and update lines
    for i, row in enumerate(symbols):
        for symbol in PossibleSlots:
            count = row.count(symbol)
            if count >= 3:  # Example rule: 3 or more same symbols in a row win
                winnings += count * 10  # Each symbol has a value of 10 (example)
                for j in range(num_cols):
                    if row[j] == symbol:
                        lines[i][j] = 1

    # Check vertical lines (columns)
    for col in range(num_cols):
        col_symbols = [symbols[row][col] for row in range(num_rows)]
        for symbol in PossibleSlots:
            count = col_symbols.count(symbol)
            if count >= 3:
                winnings += count * 10
                for row in range(num_rows):
                    if symbols[row][col] == symbol:
                        lines[row][col] = 1

    return {'winnings': winnings, 'lines': lines}






