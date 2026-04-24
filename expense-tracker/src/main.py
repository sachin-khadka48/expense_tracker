# Entry point of the Expense Tracker application

from tracker import Tracker

def main():
    tracker = Tracker()
    
    while True:
        print("\nExpense Tracker Menu:")
        print("1. Add Expense")
        print("2. View Expenses")
        print("3. Show Total")
        print("4. Exit")
        
        choice = input("Select an option (1-4): ")
        
        if choice == '1':
            amount = float(input("Enter amount: "))
            category = input("Enter category: ")
            tracker.add_expense(amount, category)
            print("Expense added.")
        
        elif choice == '2':
            expenses = tracker.view_expenses()
            for expense in expenses:
                print(expense)
        
        elif choice == '3':
            total = tracker.calculate_total()
            print(f"Total Expense: {total}")
        
        elif choice == '4':
            print("Exiting the program.")
            break
        
        else:
            print("Invalid option. Please try again.")

if __name__ == "__main__":
    main()