class Expense:
    def __init__(self, amount, category):
        self.amount = amount
        self.category = category

    def __str__(self):
        return f"{self.category} - {self.amount}"