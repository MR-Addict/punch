const rows = document.querySelector(".multi-page-table tbody").rows;
const sel_element = document.getElementById("records_per_page");

let num_of_records_per_page = Number(sel_element.value);
let table_pages_nav_buttons = document.getElementById("table-pages-nav-buttons");

function showTables(num_of_page) {
  const num_of_all_records = rows.length;
  const num_of_pages = parseInt(num_of_all_records / num_of_records_per_page + 1);
  // Generate buttons
  table_pages_nav_buttons.innerHTML = "";
  for (var i = 1; i <= num_of_pages; i++) {
    table_pages_nav_buttons.innerHTML += `<button onclick="showTables(${i})">${i}</button>`;
  }

  // update status
  document.getElementById("sta-all-pages").innerText = num_of_pages;
  document.getElementById("sta-all-records").innerText = num_of_all_records;

  // Update table resultes
  for (var i = 0; i < num_of_all_records; i++) {
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

sel_element.addEventListener("change", () => {
  num_of_records_per_page = Number(sel_element.value);
  showTables(1);
});

showTables(1);
