// Your booking inbox and base nightly rate (used for the estimate).
const BOOKING_EMAIL = "stay@juniperhouse.example";
const MIDWEEK_RATE = 420;
const WEEKEND_RATE = 540;

document.documentElement.classList.add("js");
document.getElementById("year").textContent = String(new Date().getFullYear());

// Mobile navigation
const toggle = document.querySelector(".menu-toggle");
const nav = document.getElementById("primary-nav");
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Reveal sections as they scroll in
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("visible"); io.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
  io.observe(el);
});

// Booking enquiry: estimate and email draft
const form = document.getElementById("booking-form");
const estimate = document.getElementById("estimate");
const error = document.getElementById("form-error");
const today = new Date().toISOString().slice(0, 10);
form.checkin.min = today;
form.checkout.min = today;

function nightsBetween(a, b) {
  const nights = [];
  const d = new Date(a + "T12:00:00");
  const end = new Date(b + "T12:00:00");
  while (d < end) { nights.push(d.getDay()); d.setDate(d.getDate() + 1); }
  return nights;
}

function updateEstimate() {
  const { checkin, checkout } = form;
  if (checkin.value) checkout.min = checkin.value;
  if (!checkin.value || !checkout.value || checkout.value <= checkin.value) {
    estimate.textContent = "Choose your dates to see an estimate.";
    return null;
  }
  const nights = nightsBetween(checkin.value, checkout.value);
  const total = nights.reduce((sum, day) => sum + (day === 5 || day === 6 ? WEEKEND_RATE : MIDWEEK_RATE), 0);
  const fmt = total.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  estimate.innerHTML = `<strong>${nights.length} night${nights.length > 1 ? "s" : ""}</strong> · about <strong>${fmt}</strong>, cleaning included`;
  return { nights: nights.length, fmt };
}
form.checkin.addEventListener("change", updateEstimate);
form.checkout.addEventListener("change", updateEstimate);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  error.textContent = "";
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  const invalid = [...form.elements].filter((el) => el.willValidate && !el.checkValidity());
  if (invalid.length) {
    invalid.forEach((el) => el.setAttribute("aria-invalid", "true"));
    invalid[0].focus();
    error.textContent = "Please fill in your dates, name and a valid email.";
    return;
  }
  const stay = updateEstimate();
  if (!stay) { form.checkout.setAttribute("aria-invalid", "true"); error.textContent = "Checkout must be after check-in."; return; }
  if (stay.nights < 2) { form.checkout.setAttribute("aria-invalid", "true"); error.textContent = "Stays are a minimum of 2 nights."; return; }
  const body = [
    `Name: ${form.name.value}`, `Email: ${form.email.value}`,
    `Dates: ${form.checkin.value} to ${form.checkout.value} (${stay.nights} nights)`,
    `Guests: ${form.guests.value}`, `Estimate: ${stay.fmt}`, "", form.message.value,
  ].join("\n");
  const subject = `Stay enquiry: ${form.checkin.value} to ${form.checkout.value}`;
  window.location.href = `mailto:${BOOKING_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  estimate.innerHTML = "<strong>Your email is ready to send.</strong> We usually reply within a few hours.";
});
