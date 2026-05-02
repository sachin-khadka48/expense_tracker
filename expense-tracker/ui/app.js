const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const amountError = document.getElementById("amount-error");
const categoryError = document.getElementById("category-error");
const list = document.getElementById("expense-list");
const totalEl = document.getElementById("total");
const countEl = document.getElementById("count");
const clearBtn = document.getElementById("clear");
const sortSelect = document.getElementById("sort");
const filterCategory = document.getElementById("filter-category");
const exportJsonBtn = document.getElementById("export-json");
const exportCsvBtn = document.getElementById("export-csv");
const importFile = document.getElementById("import-file");

const STORAGE_KEY = "expenses";
let editId = null;
let chartCategory = null;
let chartMonth = null;

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

function validate() {
  let ok = true;
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();

  if (isNaN(amount) || amount <= 0) {
    amountError.textContent = "Enter a valid positive amount.";
    amountInput.setAttribute("aria-invalid", "true");
    ok = false;
  } else {
    amountError.textContent = "";
    amountInput.setAttribute("aria-invalid", "false");
  }

  if (!category) {
    categoryError.textContent = "Category is required.";
    categoryInput.setAttribute("aria-invalid", "true");
    ok = false;
  } else {
    categoryError.textContent = "";
    categoryInput.setAttribute("aria-invalid", "false");
  }

  return ok;
}

function applySortAndFilter(expenses) {
  const filter = filterCategory.value.trim().toLowerCase();
  let filtered = filter
    ? expenses.filter(e => e.category.toLowerCase().includes(filter))
    : expenses.slice();

  switch (sortSelect.value) {
    case "date-asc":
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "date-desc":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "amount-asc":
      filtered.sort((a, b) => a.amount - b.amount);
      break;
    case "amount-desc":
      filtered.sort((a, b) => b.amount - a.amount);
      break;
    case "category-asc":
      filtered.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case "category-desc":
      filtered.sort((a, b) => b.category.localeCompare(a.category));
      break;
  }
  return filtered;
}

function render() {
  const expenses = loadExpenses();
  const view = applySortAndFilter(expenses);
  list.innerHTML = "";

  if (view.length === 0) {
    const li = document.createElement("li");
    li.className = "empty";
    li.textContent = "No expenses yet.";
    list.appendChild(li);
  } else {
    view.forEach((exp) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${exp.category}</span>
        <span>${formatMoney(exp.amount)}</span>
        <div class="item-actions">
          <button class="ghost" data-edit="${exp.id}">Edit</button>
          <button class="ghost" data-delete="${exp.id}">Delete</button>
        </div>
      `;
      list.appendChild(li);
    });
  }

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  totalEl.textContent = formatMoney(total);
  countEl.textContent = String(expenses.length);

  renderCharts(expenses);
}

function addExpense(amount, category) {
  const expenses = loadExpenses();
  expenses.push({
    id: crypto.randomUUID(),
    amount,
    category,
    createdAt: new Date().toISOString()
  });
  saveExpenses(expenses);
}

function updateExpense(id, amount, category) {
  const expenses = loadExpenses();
  const idx = expenses.findIndex(e => e.id === id);
  if (idx >= 0) {
    expenses[idx].amount = amount;
    expenses[idx].category = category;
  }
  saveExpenses(expenses);
}

function deleteExpense(id) {
  const expenses = loadExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
}

function renderCharts(expenses) {
  const byCategory = {};
  const byMonth = {};

  expenses.forEach(e => {
    byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    const d = new Date(e.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    byMonth[key] = (byMonth[key] || 0) + e.amount;
  });

  const catLabels = Object.keys(byCategory);
  const catValues = Object.values(byCategory);
  const monthLabels = Object.keys(byMonth).sort();
  const monthValues = monthLabels.map(k => byMonth[k]);

  if (chartCategory) chartCategory.destroy();
  if (chartMonth) chartMonth.destroy();

  chartCategory = new Chart(document.getElementById("chart-category"), {
    type: "doughnut",
    data: { labels: catLabels, datasets: [{ data: catValues }] },
    options: { plugins: { legend: { labels: { color: "#e5e7eb" } } } }
  });

  chartMonth = new Chart(document.getElementById("chart-month"), {
    type: "bar",
    data: { labels: monthLabels, datasets: [{ data: monthValues, backgroundColor: "#22c55e" }] },
    options: { scales: { x: { ticks: { color: "#e5e7eb" } }, y: { ticks: { color: "#e5e7eb" } } } }
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!validate()) return;

  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value.trim();

  if (editId) {
    updateExpense(editId, amount, category);
    editId = null;
  } else {
    addExpense(amount, category);
  }

  form.reset();
  render();
});

list.addEventListener("click", (e) => {
  const edit = e.target.getAttribute("data-edit");
  const del = e.target.getAttribute("data-delete");
  if (edit) {
    const expenses = loadExpenses();
    const exp = expenses.find(x => x.id === edit);
    if (exp) {
      editId = exp.id;
      amountInput.value = exp.amount;
      categoryInput.value = exp.category;
      amountInput.focus();
    }
  }
  if (del) {
    deleteExpense(del);
    render();
  }
});

clearBtn.addEventListener("click", () => {
  saveExpenses([]);
  render();
});

sortSelect.addEventListener("change", render);
filterCategory.addEventListener("input", render);

exportJsonBtn.addEventListener("click", () => {
  const data = JSON.stringify(loadExpenses(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.json";
  a.click();
});

exportCsvBtn.addEventListener("click", () => {
  const expenses = loadExpenses();
  const lines = ["id,amount,category,createdAt"];
  expenses.forEach(e => {
    lines.push(`${e.id},${e.amount},"${e.category.replace(/"/g, '""')}",${e.createdAt}`);
  });
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "expenses.csv";
  a.click();
});

importFile.addEventListener("change", async () => {
  const file = importFile.files[0];
  if (!file) return;

  const text = await file.text();
  let data = [];

  if (file.name.endsWith(".json")) {
    data = JSON.parse(text);
  } else if (file.name.endsWith(".csv")) {
    const [_, ...rows] = text.split("\n");
    data = rows.filter(Boolean).map(row => {
      const [id, amount, category, createdAt] = row.split(",");
      return { id, amount: parseFloat(amount), category: category?.replace(/^"|"$/g, ""), createdAt };
    });
  }

  saveExpenses(data);
  render();
});

render();