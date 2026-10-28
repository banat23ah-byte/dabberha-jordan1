const listings = [
  {name:"لقمة طيبة",category:"مطاعم",city:"عمّان",description:"وجبات سريعة بطعم بيتي وخيارات مناسبة للغداء.",emoji:"🍔",cover:"cover-food",badge:"اختيار محلي",kind:"مطعم"},
  {name:"بنّ وراحة",category:"كافيهات",city:"إربد",description:"قهوة مختصة وأجواء هادئة للدراسة واللقاءات.",emoji:"☕",cover:"cover-coffee",badge:"أجواء رايقة",kind:"كافيه"},
  {name:"لمسة ستايل",category:"تسوق",city:"الزرقاء",description:"إكسسوارات وهدايا وأفكار لطيفة للمناسبات.",emoji:"🛍️",cover:"cover-shop",badge:"أفكار هدايا",kind:"متجر"},
  {name:"صيانة بلمح البصر",category:"خدمات",city:"عمّان",description:"خدمات صيانة منزلية عامة — تواصل للتفاصيل.",emoji:"🛠️",cover:"cover-service",badge:"خدمات",kind:"خدمة"},
  {name:"لقطة الأسبوع",category:"عروض",city:"العقبة",description:"مساحة لاكتشاف العروض المحلية المعلنة من أصحاب الأنشطة.",emoji:"🏷️",cover:"cover-deal",badge:"مثال توضيحي",kind:"عرض"},
  {name:"سوق البلد",category:"تسوق",city:"السلط",description:"منتجات محلية وأغراض يومية من مشاريع صغيرة.",emoji:"🧺",cover:"cover-market",badge:"مشروع محلي",kind:"متجر"}
];
const cards = document.getElementById("cards");
const emptyState = document.getElementById("emptyState");
const count = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const citySelect = document.getElementById("citySelect");
let activeCategory = "الكل";

function renderCards() {
  const query = searchInput.value.trim().toLowerCase();
  const city = citySelect.value;
  const filtered = listings.filter(item => {
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    const matchesCity = city === "الكل" || item.city === city;
    const text = `${item.name} ${item.category} ${item.city} ${item.description}`.toLowerCase();
    return matchesCategory && matchesCity && text.includes(query);
  });
  cards.innerHTML = filtered.map(item => `
    <article class="listing-card">
      <div class="card-cover ${item.cover}">
        <span class="card-badge">${item.badge}</span><span class="cover-emoji" aria-hidden="true">${item.emoji}</span>
      </div>
      <div class="card-body">
        <div class="card-meta"><span class="category-label">${item.category}</span><span>${item.kind}</span></div>
        <h3>${escapeHTML(item.name)}</h3>
        <p>${escapeHTML(item.description)}</p>
        <div class="card-bottom"><span class="card-city">📍 ${item.city}</span><button class="card-link" type="button" data-details="${escapeHTML(item.name)}">التفاصيل ←</button></div>
      </div>
    </article>`).join("");
  count.textContent = `${filtered.length} نتائج`;
  emptyState.classList.toggle("hidden", filtered.length !== 0);
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
document.querySelectorAll(".category").forEach(button => button.addEventListener("click", () => {
  activeCategory = button.dataset.category;
  document.querySelectorAll(".category").forEach(item => item.classList.toggle("active", item === button));
  renderCards();
}));
searchInput.addEventListener("input", renderCards);
citySelect.addEventListener("change", renderCards);
document.getElementById("searchBtn").addEventListener("click", () => document.getElementById("discover").scrollIntoView({behavior:"smooth"}));

const dialog = document.getElementById("listingDialog");
const form = document.getElementById("listingForm");
const status = document.getElementById("formStatus");
const generated = document.getElementById("generatedMessage");
const copyButton = document.getElementById("copyMessage");
function openDialog() { dialog.showModal(); }
document.getElementById("addBtn").addEventListener("click", openDialog);
document.getElementById("ctaAddBtn").addEventListener("click", openDialog);
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("cancelDialog").addEventListener("click", () => dialog.close());
form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const message = `طلب إضافة نشاط إلى دبّرها الأردن\nاسم النشاط: ${data.get("name")}\nالتصنيف: ${data.get("category")}\nالمدينة: ${data.get("city")}\nالوصف: ${data.get("description")}\nرقم التواصل: ${data.get("phone") || "لم يُذكر"}\n\nأرغب بمعرفة خطوات نشر النشاط.`;
  generated.value = message;
  generated.classList.remove("hidden");
  copyButton.classList.remove("hidden");
  status.textContent = "جهّزنا الرسالة! انسخها واحتفظ فيها لإرسالها عند توفر قناة التواصل.";
});
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(generated.value);
    status.textContent = "تم نسخ الرسالة. الصقها في رسالة أو مستند لحفظها.";
  } catch {
    generated.select();
    document.execCommand("copy");
    status.textContent = "حددنا الرسالة للنسخ؛ اضغط Ctrl+C إذا لزم الأمر.";
  }
});
cards.addEventListener("click", event => {
  const button = event.target.closest("[data-details]");
  if (!button) return;
  const item = listings.find(entry => entry.name === button.dataset.details);
  if (item) alert(`${item.name}\n${item.category} · ${item.city}\n\n${item.description}\n\nتنبيه: هذا مثال تجريبي، وليس إعلاناً مؤكداً.`);
});
renderCards();
