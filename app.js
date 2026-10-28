const listings = [
  {id:1,name:"سوق الخيرات",category:"عروض",city:"عمّان",description:"مثال تجريبي لعروض الخضار والفواكه. تحقق من الأسعار والتوفر مباشرةً.",price:"اسأل عن العرض",emoji:"🥑",theme:"green",badge:"مثال تجريبي"},
  {id:2,name:"لقمة طيبة",category:"مطاعم",city:"عمّان",description:"نموذج لمطعم محلي. القائمة والأسعار بحاجة إلى تأكيد من المطعم.",price:"قائمة الطعام",emoji:"🍔",theme:"orange",badge:"مطاعم"},
  {id:3,name:"قهوة ومزاج",category:"كافيهات",city:"إربد",description:"نموذج لكافيه محلي. تأكد من ساعات العمل والتفاصيل قبل الزيارة.",price:"تفاصيل المكان",emoji:"☕",theme:"blue",badge:"كافيهات"},
  {id:4,name:"صيانة البيت",category:"خدمات",city:"الزرقاء",description:"نموذج لخدمات الصيانة المنزلية. اتفق على التكلفة وتحقق من الخبرة.",price:"اطلب تسعيرة",emoji:"🛠️",theme:"green",badge:"خدمات"},
  {id:5,name:"بيت التوفير",category:"تسوق",city:"عمّان",description:"نموذج لمتجر محلي. المنتجات والعروض ليست مؤكدة بعد.",price:"شاهد المنتجات",emoji:"🛍️",theme:"orange",badge:"تسوق"},
  {id:6,name:"حلويات دارنا",category:"مطاعم",city:"السلط",description:"نموذج لمحل حلويات. تحقق من الأسعار والتوفر بشكل مباشر.",price:"اسأل عن الأسعار",emoji:"🧁",theme:"purple",badge:"مطاعم"},
  {id:7,name:"لمسة ورد",category:"تسوق",city:"مادبا",description:"مثال تجريبي لمتجر هدايا وورد محلي.",price:"تعرّف على المنتجات",emoji:"💐",theme:"purple",badge:"تسوق"},
  {id:8,name:"مركز العناية بالسيارة",category:"خدمات",city:"العقبة",description:"مثال تجريبي لخدمة سيارات. تأكد من الخدمات والأسعار قبل الحجز.",price:"استفسر عن الخدمة",emoji:"🚗",theme:"blue",badge:"خدمات"},
  {id:9,name:"مخبز الصباح",category:"عروض",city:"إربد",description:"مثال توضيحي لعرض مخبز. لا يعتبر عرضًا حقيقيًا أو مؤكدًا.",price:"تحقق من العرض",emoji:"🥐",theme:"orange",badge:"مثال تجريبي"}
];
const $ = id => document.getElementById(id);
const cardsEl = $("cards"), searchInput = $("searchInput"), citySelect = $("citySelect"), emptyState = $("emptyState"), resultsCount = $("resultsCount");
let activeCategory = "الكل", favoritesOnly = false;
let favorites = new Set();
try { favorites = new Set(JSON.parse(localStorage.getItem("dabberha-favorites") || "[]")); } catch {}
function escapeHtml(value) { return String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char])); }
function render() {
  const q = searchInput.value.trim().toLocaleLowerCase("ar"), city = citySelect.value;
  let filtered = listings.filter(item => {
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    const matchesCity = city === "الكل" || item.city === city;
    const matchesSearch = !q || [item.name,item.category,item.city,item.description].join(" ").toLocaleLowerCase("ar").includes(q);
    return matchesCategory && matchesCity && matchesSearch && (!favoritesOnly || favorites.has(item.id));
  });
  if ($("sortSelect").value === "name") filtered.sort((a,b) => a.name.localeCompare(b.name,"ar"));
  $("listHeading").textContent = favoritesOnly ? "إعلاناتك المحفوظة" : activeCategory === "الكل" ? "اختيارات ممكن تعجبك" : `تصفّح ${activeCategory}`;
  cardsEl.innerHTML = filtered.map(item => `<article class="card"><div class="card-art ${item.theme}"><span>${item.emoji}</span><span class="badge">${escapeHtml(item.badge)}</span><button class="favorite-btn ${favorites.has(item.id)?"saved":""}" type="button" data-favorite="${item.id}" aria-label="${favorites.has(item.id)?"إزالة من":"إضافة إلى"} المحفوظات" aria-pressed="${favorites.has(item.id)}">${favorites.has(item.id)?"♥":"♡"}</button></div><div class="card-body"><div class="card-top"><h3>${escapeHtml(item.name)}</h3><span class="tag">${escapeHtml(item.category)}</span></div><p>${escapeHtml(item.description)}</p><div class="card-meta"><span>📍 ${escapeHtml(item.city)}</span><strong>${escapeHtml(item.price)}</strong></div></div></article>`).join("");
  emptyState.classList.toggle("hidden", filtered.length > 0);
  resultsCount.textContent = `${filtered.length} ${filtered.length === 1 ? "نتيجة" : "نتائج"}`;
  $("favoritesToggle").setAttribute("aria-pressed", String(favoritesOnly));
}
function toast(message) { const el = $("toast"); el.textContent = message; el.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(()=>el.classList.remove("show"),2400); }
document.querySelectorAll(".category").forEach(button => button.addEventListener("click", () => { document.querySelectorAll(".category").forEach(b=>b.classList.remove("active")); button.classList.add("active"); activeCategory=button.dataset.category; favoritesOnly=false; render(); }));
searchInput.addEventListener("input", render); citySelect.addEventListener("change", render); $("sortSelect").addEventListener("change", render);
$("favoritesToggle").addEventListener("click",()=>{favoritesOnly=!favoritesOnly;render();if(favoritesOnly)toast("عرض المحفوظات على هذا الجهاز");});
cardsEl.addEventListener("click",event=>{const button=event.target.closest("[data-favorite]");if(!button)return;const id=Number(button.dataset.favorite);if(favorites.has(id)){favorites.delete(id);toast("تمت الإزالة من المحفوظات");}else{favorites.add(id);toast("انحفظ عندك على هذا الجهاز ♥");}try{localStorage.setItem("dabberha-favorites",JSON.stringify([...favorites]));}catch{}render();});
$("resetFilters").addEventListener("click",()=>{searchInput.value="";citySelect.value="الكل";activeCategory="الكل";favoritesOnly=false;document.querySelectorAll(".category").forEach(b=>b.classList.toggle("active",b.dataset.category==="الكل"));render();});
const dialog=$("listingDialog");const openDialog=()=>{ $("formStatus").textContent="";$("copyRequest").classList.add("hidden");dialog.showModal();};
$("addBtn").addEventListener("click",openDialog);$("ctaAddBtn").addEventListener("click",openDialog);$("closeDialog").addEventListener("click",()=>dialog.close());$("cancelDialog").addEventListener("click",()=>dialog.close());
let requestText="";
$("listingForm").addEventListener("submit",event=>{event.preventDefault();const data=new FormData(event.currentTarget);requestText=["طلب إضافة نشاط جديد — دبّرها الأردن",`اسم النشاط: ${data.get("name")}`,`التصنيف: ${data.get("category")}`,`المدينة: ${data.get("city")}`,`الوصف: ${data.get("description")}`,`الهاتف/واتساب: ${data.get("phone")||"لم يذكر"}`].join("\n");$("formStatus").textContent="تم تجهيز نص الطلب. الموقع لا يستقبل الطلبات تلقائيًا حتى الآن؛ انسخ النص واحتفظ فيه لإرساله لاحقًا.";$("copyRequest").classList.remove("hidden");});
$("copyRequest").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(requestText);toast("تم نسخ نص الطلب ✓");}catch{$("formStatus").textContent+="\nتعذّر النسخ التلقائي؛ يمكنك تحديد النص ونسخه يدويًا.";}});
render();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
