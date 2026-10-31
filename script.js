
const WHATSAPP_NUMBER = "996770141043";

const products = [
    {
        id: 1,
        name: "Nivea Soft бет креми",
        category: "Бетке кам көрүү",
        price: 650,
        tag: "Популярдуу",
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 2,
        name: "Бетке арналган сыворотка",
        category: "Бетке кам көрүү",
        price: 1250,
        tag: "Сунуш",
        image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 3,
        name: "Maybelline тушь",
        category: "Макияж",
        price: 950,
        tag: "Хит",
        image: "https://images.unsplash.com/photo-1631214540242-7a7c4b5f9a7a?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 4,
        name: "Жагымдуу атыр",
        category: "Атырлар",
        price: 2300,
        tag: "Жаңы",
        image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 5,
        name: "Кызгылт помада",
        category: "Макияж",
        price: 450,
        tag: "Сүйүктүү",
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 6,
        name: "Кам көрүү креми",
        category: "Бетке кам көрүү",
        price: 850,
        tag: "Кам көрүү",
        image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 7,
        name: "Чачка арналган май",
        category: "Чачка кам көрүү",
        price: 750,
        tag: "Жумшактык",
        image: "https://images.unsplash.com/photo-1600612253971-422e7f7faeb6?auto=format&fit=crop&w=600&q=80"
    },
    {
        id: 8,
        name: "Сулуулук топтому",
        category: "Макияж",
        price: 1500,
        tag: "Топтом",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80"
    }
];

let cart = [];
let favorites = [];

const productList = document.getElementById("productList");
const favoriteList = document.getElementById("favoriteList");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

// Товардын карточкасын түзүү
function productCard(product) {
    const isFavorite = favorites.includes(product.id);

    return `
        <article class="product-card">
            <span class="product-tag">${product.tag}</span>

            <button
                class="favorite-btn ${isFavorite ? "active" : ""}"
                onclick="toggleFavorite(${product.id})"
                aria-label="Сүйүктүүлөргө кошуу">
                ${isFavorite ? "♥" : "♡"}
            </button>

            <div class="product-image">
                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-category">${product.category}</p>

                <div class="product-price">
                    ${product.price.toLocaleString("ru-RU")} сом
                </div>

                <button class="add-btn" onclick="addToCart(${product.id})">
                    🛍️ Себетке кошуу
                </button>
            </div>
        </article>
    `;
}

// Товарларды көрсөтүү жана издөө
function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;

    const filtered = products.filter(product => {
        const matchesSearch =
            product.name.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);

        const matchesCategory =
            category === "Баары" || product.category === category;

        return matchesSearch && matchesCategory;
    });

    productList.innerHTML = filtered.map(productCard).join("");

    document.getElementById("emptyProducts").hidden =
        filtered.length !== 0;
}

// Категория тандоо
function filterProducts(category) {
    categoryFilter.value = category;
    searchInput.value = "";

    renderProducts();

    document.getElementById("products").scrollIntoView({
        behavior: "smooth"
    });
}

// Сүйүктүүлөргө кошуу
function toggleFavorite(id) {
    if (favorites.includes(id)) {
        favorites = favorites.filter(item => item !== id);
        showToast("Сүйүктүүлөрдөн өчүрүлдү");
    } else {
        favorites.push(id);
        showToast("Сүйүктүүлөргө кошулду 💗");
    }

    renderProducts();
    renderFavorites();
}

// Сүйүктүү товарларды көрсөтүү
function renderFavorites() {
    const selected = products.filter(product =>
        favorites.includes(product.id)
    );

    favoriteList.innerHTML = selected.map(productCard).join("");

    document.getElementById("emptyFavorites").hidden =
        selected.length !== 0;
}

// Себетке товар кошуу
function addToCart(id) {
    const product = products.find(item => item.id === id);
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    renderCart();
    showToast(product.name + " себетке кошулду 💗");
}

// Товардын санын өзгөртүү
function changeQuantity(id, amount) {
    const item = cart.find(product => product.id === id);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    renderCart();
}

// Себеттен товарды өчүрүү
function removeFromCart(id) {
    cart = cart.filter(product => product.id !== id);

    renderCart();
    showToast("Товар себеттен өчүрүлдү");
}

// Себетти тазалоо
function clearCart() {
    cart = [];
    renderCart();

    showToast("Себет тазаланды");
}

// Себетти көрсөтүү жана сумманы эсептөө
function renderCart() {
    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cartCount").textContent = totalCount;

    document.getElementById("cartTotal").textContent =
        totalPrice.toLocaleString("ru-RU");

    const cartItems = document.getElementById("cartItems");

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-message">Себетиң азырынча бош. Сүйүктүү товарыңды танда! 💗</p>';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-row">
            <strong>${item.name}</strong>

            <span>
                ${item.price.toLocaleString("ru-RU")} сом
            </span>

            <span>
                <button onclick="changeQuantity(${item.id}, -1)">−</button>
                ${item.quantity}
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </span>

            <span>
                ${(item.price * item.quantity).toLocaleString("ru-RU")} сом

                <button class="remove-btn"
                    onclick="removeFromCart(${item.id})">✕</button>
            </span>
        </div>
    `).join("");
}

// Себетке өтүү
function goToCart() {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}

// WHATSAPP АРКЫЛУУ БУЙРУТМА БЕРҮҮ
function checkout() {
    if (cart.length === 0) {
        showToast("Алгач себетке товар кош 💗");
        return;
    }

    const summary = cart.map(item =>
        `${item.name} × ${item.quantity} — ${item.price * item.quantity} сом`
    ).join("\n");

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    const message =
        "Саламатсызбы! 💗\n" +
        "Beauty World сайтынан буйрутма бергим келет.\n\n" +
        "Тандаган товарларым:\n" +
        summary +
        "\n\nЖалпы сумма: " +
        total.toLocaleString("ru-RU") +
        " сом\n\n" +
        "Буйрутмамды кабыл алып коюңуз. Рахмат! 🌸";

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}

// Эскертме көрсөтүү
let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2300);
}

// Телефондогу меню
document.getElementById("menuToggle").addEventListener("click", () => {
    document.getElementById("navigation").classList.toggle("open");
});

// Меню басылганда жабылат
document.querySelectorAll("#navigation a").forEach(link => {
    link.addEventListener("click", () => {
        document.getElementById("navigation").classList.remove("open");
    });
});

// Издөө жана категория
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);

// Сайтты баштапкы жүктөө
renderProducts();
renderFavorites();
renderCart();
