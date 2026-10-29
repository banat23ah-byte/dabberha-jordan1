const PROJECT_WHATSAPP = "962778224069";

const SUPABASE_URL = "https://vrfehbzrufemcpntscmh.supabase.co";
const SUPABASE_KEY = "sb_publishable_P8jsDN1OuoZyvOM4bvDzpA_hRDcS9Sf";

const form = document.getElementById("listing-form");
const status = document.getElementById("form-status");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// نموذج إرسال طلب إضافة عرض عبر واتساب
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

    const url =
      `https://wa.me/${PROJECT_WHATSAPP}?text=${encodeURIComponent(message)}`;

    if (status) {
      status.textContent =
        "تم تجهيز الرسالة. راجع التفاصيل في واتساب واضغط إرسال بنفسك.";
    }

    window.open(url, "_blank", "noopener,noreferrer");
  });
}

// أدوات إنشاء العناصر بأمان
function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

// جلب الأماكن المنشورة
async function loadPlaces() {
  const grid = document.getElementById("places-grid");
  const placesStatus = document.getElementById("places-status");

  if (!grid) return;

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/places?select=*&is_published=eq.true&order=name.asc`,
      {
        headers: {
          apikey: SUPABASE_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error("تعذّر تحميل الأماكن");
    }

    const places = await response.json();

    grid.replaceChildren();

    const governorateFilter =
      document.getElementById("governorate-filter");

    const cityFilter = document.getElementById("city-filter");
    const categoryFilter = document.getElementById("category-filter");

    function fillCities() {
      if (!cityFilter) return;

      const selectedGovernorate = governorateFilter
        ? governorateFilter.value
        : "";

      const previousCity = cityFilter.value;

      const cities = [
        ...new Set(
          places
            .filter((place) =>
              !selectedGovernorate ||
              place.governorate === selectedGovernorate
            )
            .map((place) => place.city)
            .filter(Boolean)
        )
      ].sort((a, b) => a.localeCompare(b, "ar"));

      cityFilter.replaceChildren();

      cityFilter.appendChild(
        createElement("option", "", "كل المدن والمناطق")
      );
      cityFilter.options[0].value = "";

      cities.forEach((city) => {
        const option = createElement("option", "", city);
        option.value = city;
        cityFilter.appendChild(option);
      });

      if (cities.includes(previousCity)) {
        cityFilter.value = previousCity;
      }
    }

    function renderPlaces() {
      const governorate = governorateFilter
        ? governorateFilter.value
        : "";

      const city = cityFilter ? cityFilter.value : "";

      const category = categoryFilter
        ? categoryFilter.value
        : "";

      const filteredPlaces = places.filter((place) => {
        return (
          (!governorate || place.governorate === governorate) &&
          (!city || place.city === city) &&
          (!category || place.category === category)
        );
      });

      grid.replaceChildren();

      if (filteredPlaces.length === 0) {
        if (placesStatus) {
          placesStatus.textContent =
            places.length === 0
              ? "لا توجد أماكن منشورة حاليًا. تابعنا قريبًا!"
              : "ما لقينا أماكن تطابق اختياراتك.";
        }
        return;
      }

      if (placesStatus) {
        placesStatus.textContent =
          `عدد الأماكن: ${filteredPlaces.length}`;
      }

      filteredPlaces.forEach((place) => {
        const card = createElement("article", "place-card");
        card.dataset.category = place.category || "";

        const cover = createElement("div", "place-cover cover-food");

        const emoji = createElement(
          "span",
          "place-emoji",
          place.category === "restaurant"
            ? "🍽️"
            : place.category === "cafe"
              ? "☕"
              : "🛒"
        );

        cover.appendChild(emoji);

        const body = createElement("div", "place-body");

        const heading = createElement("div", "place-title");

        heading.appendChild(
          createElement("h3", "", place.name || "مكان")
        );

        heading.appendChild(
          createElement(
            "span",
            "area",
            `${place.city || ""}${place.governorate ? "، " + place.governorate : ""}`
          )
        );

        body.appendChild(heading);

        const categoryNames = {
          restaurant: "مطعم",
          cafe: "كافيه",
          supermarket: "سوبرماركت"
        };

        body.appendChild(
          createElement(
            "p",
            "",
            categoryNames[place.category] || "مكان"
          )
        );

        if (place.address) {
          body.appendChild(
            createElement("p", "", `العنوان: ${place.address}`)
          );
        }

        if (place.description) {
          body.appendChild(
            createElement("p", "", place.description)
          );
        }

        const actions = createElement("div", "place-actions");

        if (place.phone) {
          const phone = createElement(
            "a",
            "small-button",
            "📞 اتصال"
          );

          phone.href = `tel:${place.phone}`;
          actions.appendChild(phone);
        }

        if (place.maps_url) {
          const map = createElement(
            "a",
            "small-button",
            "📍 الموقع على الخريطة"
          );

          map.href = place.maps_url;
          map.target = "_blank";
          map.rel = "noopener noreferrer";
          actions.appendChild(map);
        }

        if (actions.children.length > 0) {
          body.appendChild(actions);
        }

        card.append(cover, body);
        grid.appendChild(card);
      });
    }

    fillCities();
    renderPlaces();

    if (governorateFilter) {
      governorateFilter.addEventListener("change", () => {
        fillCities();
        renderPlaces();
      });
    }

    if (cityFilter) {
      cityFilter.addEventListener("change", renderPlaces);
    }

    if (categoryFilter) {
      categoryFilter.addEventListener("change", renderPlaces);
    }

  } catch (error) {
    console.error(error);

    if (placesStatus) {
      placesStatus.textContent =
        "تعذّر تحميل الأماكن حاليًا. حاول مرة ثانية لاحقًا.";
    }
  }
}

// جلب العروض المنشورة
async function loadOffers() {
  const grid = document.getElementById("offers-grid");

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
      throw new Error("تعذّر تحميل العروض");
    }

    const offers = await response.json();

    grid.replaceChildren();

    if (offers.length === 0) {
      grid.appendChild(
        createElement(
          "p",
          "",
          "لا توجد عروض منشورة حاليًا. تابعنا قريبًا!"
        )
      );
      return;
    }

    offers.forEach((offer) => {
      const card = createElement("article", "place-card");

      const cover = createElement("div", "place-cover cover-food");

      if (offer.image_url) {
        const image = createElement("img");

        image.src = offer.image_url;
        image.alt = offer.title || "صورة العرض";
        image.loading = "lazy";
        image.style.width = "100%";
        image.style.height = "100%";
        image.style.objectFit = "cover";

        cover.appendChild(image);
      } else {
        cover.appendChild(
          createElement("span", "place-emoji", "🎁")
        );
      }

      cover.appendChild(
        createElement("span", "category-tag", "عرض جديد")
      );

      const body = createElement("div", "place-body");
      const heading = createElement("div", "place-title");

      heading.appendChild(
        createElement("h3", "", offer.title || "عرض")
      );

      heading.appendChild(
        createElement("span", "area", offer.shop_name || "")
      );

      body.appendChild(heading);

      let description =
        offer.description || "تواصل مع المحل لمعرفة تفاصيل العرض.";

      if (offer.price !== null && offer.price !== undefined) {
        description += ` السعر: ${offer.price} دينار.`;
      }

      body.appendChild(createElement("p", "", description));

      if (offer.whatsapp) {
        const actions = createElement("div", "place-actions");
        const whatsapp = createElement(
          "a",
          "small-button whatsapp",
          "💬 تواصل عبر واتساب"
        );

        whatsapp.href =
          `https://wa.me/${String(offer.whatsapp).replace(/\D/g, "")}`;

        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";

        actions.appendChild(whatsapp);
        body.appendChild(actions);
      }

      card.append(cover, body);
      grid.appendChild(card);
    });

  } catch (error) {
    console.error(error);

    grid.textContent = "تعذّر تحميل العروض حاليًا.";
  }
}

loadPlaces();
loadOffers();
