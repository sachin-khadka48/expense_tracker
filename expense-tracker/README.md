# Expense Tracker

## Overview
The Expense Tracker is a simple Python application designed to help users record, manage, and analyze their daily spending. Instead of keeping track of expenses on paper, this application allows users to store their expenses digitally, providing features to add, view, and calculate total expenses.

## Purpose
The main goals of the Expense Tracker are to:
- Keep track of where your money goes
- Avoid overspending
- Understand spending habits
- Practice Python programming concepts

## Features
- Add Expense: Users can input the amount and category of their expenses.
- View Expenses: Displays all recorded expenses in a user-friendly format.
- Show Total: Calculates and displays the total amount of expenses.

## Project Structure
```
expense-tracker
├── src
│   ├── main.py         # Entry point of the application
│   ├── tracker.py      # Manages the list of expenses
│   ├── expense.py      # Defines the Expense class
│   └── storage.py      # Handles data storage
├── tests
│   └── test_tracker.py  # Unit tests for the Tracker class
├── requirements.txt     # Project dependencies
└── README.md            # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/expense-tracker.git
   ```
2. Navigate to the project directory:
   ```
   cd expense-tracker
   ```
3. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

## Usage
To run the Expense Tracker application, execute the following command:
```
python src/main.py
```

Follow the on-screen menu to add expenses, view your spending, and see your total expenses.

## Extra Features (Future Enhancements)
- Date tracking for each expense
- Monthly summary reports
- Graphical representation of expenses using libraries like matplotlib
- Options to delete or edit existing expenses
- Budget limit warnings to help manage spending

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.