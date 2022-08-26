document.querySelectorAll(".help-content .code button").forEach((copy_but) => {
  copy_but.addEventListener("click", () => {
    navigator.clipboard.writeText(copy_but.closest(".code").querySelector(".code-block").innerText);
  });
});
