// Elements
const department_select = document.getElementById("department_select");
const department_tables = document.querySelectorAll(".multi-page-table");
const records_per_page_select = document.getElementById("records_per_page");
let table_pages_nav_buttons = document.getElementById("table-pages-nav-buttons");

function showDepartment(num_of_depart) {
  for (let i = 0; i < department_tables.length; i++) {
    if (i === num_of_depart) department_tables[i].style.display = "";
    else department_tables[i].style.display = "none";
  }
}

function showTable(num_of_page) {
  // Read select value
  const num_of_records_per_page = Number(records_per_page_select.value);
  const current_department = Number(department_select.value);

  // Update tables
  showDepartment(current_department);

  // Update tables contents
  const rows = department_tables[current_department].rows;
  const num_of_all_records = rows.length;
  const num_of_pages = parseInt(num_of_all_records / num_of_records_per_page + 1);
  // Generate buttons
  table_pages_nav_buttons.innerHTML = "";
  for (let i = 1; i <= num_of_pages; i++) {
    table_pages_nav_buttons.innerHTML += `<button onclick="showTable(${i})">${i}</button>`;
  }

  // update status
  document.getElementById("sta-all-pages").innerText = num_of_pages;
  document.getElementById("sta-all-records").innerText = num_of_all_records;

  // Update table resultes
  for (let i = 0; i < num_of_all_records; i++) {
    if (i >= (num_of_page - 1) * num_of_records_per_page && i < num_of_page * num_of_records_per_page) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
  // Update current page
  document.getElementById("sta-current-page").innerText = num_of_page;
  // Update current num of results
  if (num_of_page * num_of_records_per_page <= num_of_all_records) {
    document.getElementById("sta-current-records").innerText = num_of_records_per_page;
  } else {
    document.getElementById("sta-current-records").innerText =
      num_of_all_records - num_of_records_per_page * (num_of_page - 1);
  }
  // Change button color
  table_pages_nav_buttons.querySelectorAll("button").forEach((button) => {
    if (button.innerText == num_of_page) button.style.background = "#ff0063";
    else button.style.background = "#5da68d";
  });
  // Return to top
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

department_select.addEventListener("change", () => {
  showTable(1);
});

records_per_page_select.addEventListener("change", () => {
  showTable(1);
});

showTable(1);
