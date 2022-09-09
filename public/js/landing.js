const body = document.querySelector("body");
const div = document.getElementById("food-logo-div");
const img = document.querySelectorAll("img")[1];
const p = document.getElementById("landing-p");
const nav = document.querySelector("nav");

img.addEventListener("mouseover", function () {
  img.setAttribute("src", "/img/FoodLogoWhite.png");
  body.style.backgroundColor = "black";
  p.classList.add("landing-p-dark");
  nav.classList.add("navbar-dark", "bg-dark");
});

img.addEventListener("mouseleave", function () {
  img.setAttribute("src", "/img/FoodLogo.png");
  body.style.backgroundColor = "white";
  p.classList.remove("landing-p-dark");
  nav.classList.remove("navbar-dark", "bg-dark");
});
