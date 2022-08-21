const num_of_per_page = 50;
const rows = document.querySelector(".multi-page-table tbody").rows;
document.getElementById("sta-all-pages").innerText = rows.length;
for (var i = 1; i <= rows.length / num_of_per_page + 1; i++) {
  document.getElementById("table-pages-nav").innerHTML += `<button onclick="showTables(${i})">${i}</button>`;
}
function showTables(num_of_page) {
  // Update table resultes
  for (var i = 0; i < rows.length; i++) {
    if (i >= (num_of_page - 1) * num_of_per_page && i < num_of_page * num_of_per_page) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
  // Update current num of results
  if (num_of_page * num_of_per_page <= rows.length) {
    document.getElementById("sta-current-page").innerText = num_of_per_page;
  } else {
    document.getElementById("sta-current-page").innerText = rows.length - num_of_per_page * (num_of_page - 1);
  }
  // Return to top
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
showTables(1);
