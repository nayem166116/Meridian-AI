document.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector("[data-auth-form]");
  if (!form) return;
  var submitBtn = form.querySelector("[data-auth-submit]");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (submitBtn) {
      submitBtn.classList.add("btn--loading");
      submitBtn.disabled = true;
    }
    setTimeout(function () {
      window.location.href = "loading.html";
    }, 900);
  });
});
