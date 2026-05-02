const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear");

const STORAGE_KEY = "expenses";

function loadExpenses() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveExpenses(expenses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
}

function formatMoney(value) {
  return `$${value.toFixed(2)}`;
}

function render() {
  const expenses = loadExpenses();
  list.innerHTML = "";

  if (expenses.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No expenses yet.";
    list.appendChild(li);
  } else {
    expenses.slice().reverse().forEach((exp, index) => {
      const li = document.createElement("li");
      li.innerHTML = `<span>${exp.category}</span><span>${formatMoney(exp.amount)}</span>`;
      list.appendChild(li);
    });
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = formatMoney(total);
  countEl.textContent = String(expenses.length);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();
  if (!category || isNaN(amount)) return;

  const expenses = loadExpenses();
  expenses.push({ amount, category, createdAt: new Date().toISOString() });
  saveExpenses(expenses);

  form.reset();
  render();
});

clearBtn.addEventListener("click", () => {
  saveExpenses([]);
  render();
});

render();