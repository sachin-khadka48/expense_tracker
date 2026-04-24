class Tracker:
    def __init__(self):
        self.expenses = []

    def add_expense(self, amount, category):
        expense = Expense(amount, category)
        self.expenses.append(expense)

    def view_expenses(self):
        return [str(expense) for expense in self.expenses]

    def calculate_total(self):
        return sum(expense.amount for expense in self.expenses)


class Expense:
    def __init__(self, amount, category):
        self.amount = amount
        self.category = category

    def __str__(self):
        return f"{self.category} - {self.amount}"