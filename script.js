const data = {
    ru: [
        {
            title: "Пицца",
            items: [
                { name: "Маргарита", desc: "Сыр, томаты, базилик", price: "250₴", img: "images/pizza.jpg" },
                { name: "Пепперони", desc: "Острая колбаса, сыр", price: "300₴", img: "images/pepperoni.jpg" }
            ]
        },
        {
            title: "Супы",
            items: [
                { name: "Борщ", desc: "Классический украинский", price: "150₴", img: "images/borscht.jpg" },
                { name: "Крем-суп грибной", desc: "Нежный, сливочный", price: "170₴", img: "images/mushroom_soup.jpg" }
            ]
        }
    ]
};

let currentLang = "ru";
let cart = {};

function setLanguage(lang) {
    currentLang = lang;
    renderMenu();
    renderCart(); // обновляем корзину после смены языка
}

// ====== Рисуем меню один раз ======
function renderMenu() {
    const menu = document.getElementById("menu");
    menu.innerHTML = "";

    data[currentLang].forEach(category => {
        const cat = document.createElement("div");
        cat.className = "category";

        const h2 = document.createElement("h2");
        h2.textContent = category.title;
        h2.className = "category-title";

        const itemsWrap = document.createElement("div");
        itemsWrap.className = "items";

        h2.addEventListener("click", () => {
            itemsWrap.classList.toggle("open");
            h2.classList.toggle("open");
        });

        cat.appendChild(h2);
        cat.appendChild(itemsWrap);

        category.items.forEach(item => {
            const div = document.createElement("div");
            div.className = "item";

            const img = document.createElement("img");
            img.src = item.img;

            const info = document.createElement("div");
            info.className = "info";

            const h3 = document.createElement("h3");
            h3.textContent = item.name;

            const p = document.createElement("p");
            p.textContent = item.desc;

            const price = document.createElement("div");
            price.className = "price";
            price.textContent = item.price;

            const controls = document.createElement("div");
            controls.className = "item-controls";

            const minus = document.createElement("button");
            minus.textContent = "-";

            const plus = document.createElement("button");
            plus.textContent = "+";

            const count = document.createElement("span");
            count.className = "item-count";
            count.dataset.item = item.name;
            count.textContent = cart[item.name] ? cart[item.name].count : 0;

            minus.addEventListener("click", (e) => {
                e.stopPropagation();
                decreaseItem(item.name);
            });

            plus.addEventListener("click", (e) => {
                e.stopPropagation();
                addToCart(item);
            });

            controls.appendChild(minus);
            controls.appendChild(count);
            controls.appendChild(plus);

            info.appendChild(h3);
            info.appendChild(p);
            info.appendChild(price);
            info.appendChild(controls);

            div.appendChild(img);
            div.appendChild(info);

            div.addEventListener("click", (e) => e.stopPropagation());

            itemsWrap.appendChild(div);
        });

        menu.appendChild(cat);
    });
}

// ====== Рендер корзины и обновление счетчиков ======
function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    cartItems.innerHTML = "";

    let totalCount = 0;
    let totalPrice = 0;

    for (let key in cart) {
        const item = cart[key];
        totalCount += item.count;

        let priceNum = parseFloat(item.price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
        totalPrice += priceNum * item.count;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `<strong>${item.name}</strong> x<span>${item.count}</span>
            <div class="item-controls">
                <button onclick="decreaseItem('${key}')">-</button>
                <button onclick="increaseItem('${key}')">+</button>
            </div>`;
        cartItems.appendChild(div);
    }

    document.getElementById("cartCount").textContent = totalCount;

    let currency = '₴';
    for (let key in cart) { currency = cart[key].price.replace(/[\d.,]/g,''); break; }
    cartTotal.textContent = `Сумма: ${totalPrice}${currency}`;

    // Обновляем счетчики рядом с кнопками меню
    document.querySelectorAll(".item-count").forEach(span => {
        const name = span.dataset.item;
        span.textContent = cart[name] ? cart[name].count : 0;
    });
}

// ====== Добавление и удаление из корзины ======
function addToCart(item) {
    const key = item.name;
    if (cart[key]) cart[key].count += 1;
    else cart[key] = {...item, count: 1};
    renderCart(); // обновляем только корзину
}

function increaseItem(key) {
    cart[key].count += 1;
    renderCart();
}

function decreaseItem(key) {
    if (cart[key].count > 1) cart[key].count -= 1;
    else delete cart[key];
    renderCart();
}

// ====== Тема ======
const themeBtn = document.getElementById("themeToggle");
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent =
        document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// ====== Корзина ======
document.getElementById("cartBtn").addEventListener("click", () => {
    document.getElementById("cartOverlay").classList.add("active");
});
document.getElementById("closeCart").addEventListener("click", () => {
    document.getElementById("cartOverlay").classList.remove("active");
});

// ====== Инициализация ======
renderMenu();
renderCart();
