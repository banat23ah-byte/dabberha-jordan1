const PROJECT_WHATSAPP = "962778224069";
const form = document.getElementById("listing-form");
const status = document.getElementById("form-status");
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    const filter = button.dataset.filter;
    document.querySelectorAll(".place-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const message = [
      "مرحبًا فريق دبّرها الأردن، عندي طلب لإضافة عرض:",
      `اسم المحل: ${data.get("business")}`,
      `المدينة/المنطقة: ${data.get("area")}`,
      `نوع النشاط: ${data.get("type")}`,
      `تفاصيل العرض: ${data.get("offer")}`,
      `رقم التواصل مع المحل: ${data.get("contact")}`,
      "",
      "أؤكد أن التفاصيل المذكورة صحيحة، وأتفهم أن النشر يخضع للمراجعة."
    ].join("\n");
    const url = `https://wa.me/${PROJECT_WHATSAPP}?text=${encodeURIComponent(message)}`;
    status.textContent = "تم تجهيز الرسالة. راجع التفاصيل في واتساب واضغط إرسال بنفسك.";
    window.open(url, "_blank", "noopener,noreferrer");
  });
}
