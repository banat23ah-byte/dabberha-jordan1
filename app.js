const listings = [
  {name:"مطعم هاشم",category:"مطاعم",city:"عمّان",description:"مطعم شعبي معروف في وسط البلد. اتصل للتأكد من التفاصيل قبل الزيارة.",emoji:"🧆",cover:"cover-food",badge:"معلومات دليل عام",kind:"مطعم",phone:"+96265858101",website:"https://www.facebook.com/Hashem.Rest.Jo",address:"شارع الملك فيصل، وسط البلد"},
  {name:"مطاعم جبري",category:"مطاعم",city:"عمّان",description:"مطاعم تقدم مأكولات أردنية وشرقية. الفروع وساعات العمل قد تختلف.",emoji:"🍽️",cover:"cover-food",badge:"معلومات دليل عام",kind:"مطعم",phone:"+96265681700",website:"https://www.jabri.com.jo/",address:"شارع وصفي التل، عمّان"},
  {name:"Rumi Café",category:"كافيهات",city:"عمّان",description:"كافيه في جبل اللويبدة يقدم القهوة والشاي وأصنافًا خفيفة.",emoji:"☕",cover:"cover-coffee",badge:"معلومات دليل عام",kind:"كافيه",phone:"+96264644131",website:"https://www.rumijordan.com/",address:"شارع كلية الشريعة 14، جبل اللويبدة"},
  {name:"Bahi Café",category:"كافيهات",city:"عمّان",description:"كافيه في الشميساني بأجواء مستوحاة من عمّان القديمة.",emoji:"🫖",cover:"cover-coffee",badge:"معلومات دليل عام",kind:"كافيه",phone:"+96264654700",website:"https://www.bahijordan.com/",address:"الشميساني، عمّان"}
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
        <p class="business-address">📍 ${escapeHTML(item.address)}</p>
        <div class="contact-actions">
          <a class="contact-button call-button" href="tel:${item.phone}" aria-label="اتصل بـ ${escapeHTML(item.name)}">☎ اتصال</a>
          <a class="contact-button whatsapp-button" href="https://wa.me/?text=${encodeURIComponent(`مرحبًا، أريد الاستفسار عن ${item.name}.`) }" target="_blank" rel="noopener noreferrer" aria-label="افتح واتساب للتواصل بشأن ${escapeHTML(item.name)}">☏ واتساب</a>
          <a class="contact-button site-button" href="${item.website}" target="_blank" rel="noopener noreferrer">الموقع/الصفحة ↗</a>
        </div>
        <div class="card-bottom"><span class="card-city">📍 ${item.city}</span><span class="card-link">دليل عام</span></div>
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
renderCards();
