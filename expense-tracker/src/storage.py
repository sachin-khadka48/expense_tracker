def save_expenses(expenses, filename='expenses.txt'):
    with open(filename, 'w') as file:
        for expense in expenses:
            file.write(f"{expense.category},{expense.amount}\n")


def load_expenses(filename='expenses.txt'):
    expenses = []
    try:
        with open(filename, 'r') as file:
            for line in file:
                category, amount = line.strip().split(',')
                expenses.append(Expense(category, float(amount)))
    except FileNotFoundError:
        pass  # If the file does not exist, return an empty list
    return expenses