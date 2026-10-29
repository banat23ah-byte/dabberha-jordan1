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
```javascript
// جلب العروض المنشورة من قاعدة بيانات Supabase
(async function loadPublishedOffers() {
  const SUPABASE_URL = "https://vrfehbzrufemcpntscmh.supabase.co";
  const SUPABASE_KEY = "sb_publishable_P8jsDN1OuoZyvOM4bvDzpA_hRDcS9Sf";

  const grid = document.getElementById("places-grid");
  if (!grid) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/offers?select=id,shop_name,title,description,price,category,image_url,whatsapp&is_published=eq.true&order=created_at.desc`,
      {
        headers: {
          apikey: SUPABASE_KEY
        }
      }
    );

    if (!response.ok) {
      console.error("تعذّر تحميل العروض من قاعدة البيانات.");
      return;
    }

    const offers = await response.json();

    offers.forEach((offer) => {
      const card = document.createElement("article");
      card.className = "place-card";
      card.dataset.category = offer.category || "other";

      const cover = document.createElement("div");
      cover.className = "place-cover cover-food";

      if (offer.image_url) {
        const image = document.createElement("img");
        image.src = offer.image_url;
        image.alt = offer.title;
        image.loading = "lazy";
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";
        cover.appendChild(image);
      } else {
        const emoji = document.createElement("span");
        emoji.className = "place-emoji";
        emoji.textContent = "🎁";
        cover.appendChild(emoji);
      }

      const tag = document.createElement("span");
      tag.className = "category-tag";
      tag.textContent = "عرض جديد";
      cover.appendChild(tag);

      const body = document.createElement("div");
      body.className = "place-body";

      const heading = document.createElement("div");
      heading.className = "place-title";

      const title = document.createElement("h3");
      title.textContent = offer.title;

      const shop = document.createElement("span");
      shop.className = "area";
      shop.textContent = offer.shop_name;

      heading.append(title, shop);

      const description = document.createElement("p");
      description.textContent = offer.description || "تواصل مع المحل لمعرفة تفاصيل العرض.";

      if (offer.price !== null) {
        description.textContent += ` السعر: ${offer.price} دينار.`;
      }

      body.append(heading, description);

      if (offer.whatsapp) {
        const actions = document.createElement("div");
        actions.className = "place-actions";

        const whatsapp = document.createElement("a");
        whatsapp.className = "small-button whatsapp";
        whatsapp.href = `https://wa.me/${offer.whatsapp.replace(/\D/g, "")}`;
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
        whatsapp.textContent = "💬 تواصل عبر واتساب";

        actions.appendChild(whatsapp);
        body.appendChild(actions);
      }

      card.append(cover, body);
      grid.prepend(card);
    });

  } catch (error) {
    console.error("حدث خطأ أثناء تحميل العروض:", error);
  }
})();
```
