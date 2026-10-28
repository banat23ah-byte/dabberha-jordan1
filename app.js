const listings = [
  {id:1,name:"عرض خضار وفواكه",category:"عروض",city:"عمّان",description:"مثال تجريبي: تشكيلة موسمية بأسعار مناسبة. اتصل للتأكد من الأسعار.",price:"تحقّق من السعر",emoji:"🥑",theme:"",badge:"عرض تجريبي",contact:""},
  {id:2,name:"مطعم لقمة طيبة",category:"مطاعم",city:"عمّان",description:"مثال تجريبي لمطعم محلي. أضف تفاصيل القائمة والأسعار بعد التحقق.",price:"قائمة الطعام",emoji:"🍔",theme:"orange",badge:"مطاعم",contact:""},
  {id:3,name:"قهوة ومزاج",category:"كافيهات",city:"إربد",description:"مثال تجريبي لكافيه. تواصل مع المكان للتأكد من ساعات العمل.",price:"تفاصيل المكان",emoji:"☕",theme:"blue",badge:"كافيهات",contact:""},
  {id:4,name:"صيانة البيت",category:"خدمات",city:"الزرقاء",description:"مثال تجريبي لخدمات الصيانة المنزلية. تحقق من الترخيص والتكلفة قبل الاتفاق.",price:"اطلب تسعيرة",emoji:"🛠️",theme:"",badge:"خدمات",contact:""},
  {id:5,name:"متجر البيت",category:"تسوق",city:"عمّان",description:"مثال تجريبي لمتجر محلي. أضف المنتجات والعروض الحقيقية بعد موافقة المتجر.",price:"شاهد المنتجات",emoji:"🛍️",theme:"orange",badge:"تسوق",contact:""},
  {id:6,name:"حلويات دارنا",category:"مطاعم",city:"السلط",description:"مثال تجريبي لمحل حلويات. الأسعار والتوفر بحاجة لتأكيد مباشر.",price:"اسأل عن الأسعار",emoji:"🧁",theme:"blue",badge:"مطاعم",contact:""}
];
const cardsEl = document.getElementById("cards");
const searchInput = document.getElementById("searchInput");
const citySelect = document.getElementById("citySelect");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
let activeCategory = "الكل";

function render() {
  const q = searchInput.value.trim().toLowerCase();
  const city = citySelect.value;
  const filtered = listings.filter(item => {
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory || (activeCategory === "عروض" && item.badge.includes("عرض"));
    const matchesCity = city === "الكل" || item.city === city;
    const matchesSearch = !q || [item.name,item.category,item.city,item.description].join(" ").toLowerCase().includes(q);
    return matchesCategory && matchesCity && matchesSearch;
  });
  cardsEl.innerHTML = filtered.map(item => `
    <article class="card">
      <div class="card-art ${item.theme}"><span>${item.emoji}</span><span class="badge">${item.badge}</span></div>
      <div class="card-body">
        <div class="card-top"><h3>${escapeHtml(item.name)}</h3><span class="tag">${escapeHtml(item.category)}</span></div>
        <p>${escapeHtml(item.description)}</p>
        <div class="card-meta"><span>📍 ${escapeHtml(item.city)}</span><strong>${escapeHtml(item.price)}</strong></div>
      </div>
    </article>`).join("");
  emptyState.classList.toggle("hidden", filtered.length > 0);
  resultsCount.textContent = `${filtered.length} نتيجة`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
}
document.querySelectorAll(".category").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".category").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  activeCategory = button.dataset.category;
  render();
}));
searchInput.addEventListener("input", render);
citySelect.addEventListener("change", render);

const dialog = document.getElementById("listingDialog");
const openDialog = () => { document.getElementById("formStatus").textContent = ""; dialog.showModal(); };
document.getElementById("addBtn").addEventListener("click", openDialog);
document.getElementById("ctaAddBtn").addEventListener("click", openDialog);
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
document.getElementById("cancelDialog").addEventListener("click", () => dialog.close());
document.getElementById("listingForm").addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const message = [
    "طلب إضافة إعلان جديد - دبّرها الأردن",
    `اسم النشاط: ${data.get("name")}`,
    `التصنيف: ${data.get("category")}`,
    `المدينة: ${data.get("city")}`,
    `الوصف: ${data.get("description")}`,
    `الهاتف/واتساب: ${data.get("phone") || "لم يذكر"}`
  ].join("\n");
  const status = document.getElementById("formStatus");
  status.textContent = "تم تجهيز نص الطلب. انسخه واحتفظ فيه، أو أرسله عبر البريد/واتساب بعد تحديد وسيلة التواصل الرسمية للمشروع:\n\n" + message;
  let copyBtn = document.getElementById("copyRequest");
  if (!copyBtn) {
    copyBtn = document.createElement("button");
    copyBtn.id = "copyRequest";
    copyBtn.className = "outline-btn";
    copyBtn.type = "button";
    copyBtn.textContent = "نسخ نص الطلب";
    status.insertAdjacentElement("afterend", copyBtn);
  }
  copyBtn.onclick = async () => {
    try { await navigator.clipboard.writeText(message); copyBtn.textContent = "تم النسخ ✓"; }
    catch { status.textContent = message + "\n\nحدّد النص وانسخه يدوياً."; }
  };
});
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}
