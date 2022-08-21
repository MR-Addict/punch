const rows = document.querySelector(".multi-page-table tbody").rows;

const num_of_records_per_page = 50;
const num_of_all_records = rows.length;
const num_of_pages = parseInt(num_of_all_records / num_of_records_per_page + 1);

document.getElementById("sta-all-pages").innerText = num_of_pages;
document.getElementById("sta-all-records").innerText = num_of_all_records;
// Generate buttons
for (var i = 1; i <= num_of_pages; i++) {
  document.getElementById(
    "table-pages-nav"
  ).innerHTML += `<button onclick="showTables(${i})" id="button${i}">${i}</button>`;
}
function showTables(num_of_page) {
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
  for (var i = 1; i <= num_of_pages; i++) {
    if (i == num_of_page) document.getElementById(`button${i}`).style.background = "#ff0063";
    else document.getElementById(`button${i}`).style.background = "#5da68d";
  }
  // Return to top
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
showTables(1);
