// Default menu items seed data
const DEFAULT_MENU_ITEMS = [
    {
        id: 1,
        name: "Rice and Curry",
        description: "A wholesome plate of steamed rice served with a variety of flavorful Sri Lankan curries.",
        image: "assets/images/item-5.png",
        category: "Main Course",
        price: 350,
        status: "available"
    },
    {
        id: 2,
        name: "String Hoppers (Idiyappam)",
        description: "Soft, steamed rice flour noodles paired with coconut sambol and spicy curries.",
        image: "assets/images/item-4.png",
        category: "Main Course",
        price: 280,
        status: "available"
    },
    {
        id: 3,
        name: "Roti",
        description: "Freshly made flatbread, served with sambol or curry for a traditional taste.",
        image: "assets/images/item-6.png",
        category: "Main Course",
        price: 150,
        status: "available"
    },
    {
        id: 4,
        name: "Avocado Juice",
        description: "Healthy and refreshing avocado juice made from ripe avocados and natural sweeteners.",
        image: "assets/images/item-2.png",
        category: "Beverages",
        price: 200,
        status: "available"
    },
    {
        id: 5,
        name: "Ulundu Vadai",
        description: "Crispy lentil fritters made from black gram, seasoned with spices for a perfect snack.",
        image: "assets/images/item-3.png",
        category: "Short Eats",
        price: 120,
        status: "available"
    },
    {
        id: 6,
        name: "Fruit Salad",
        description: "A selection of fresh, seasonal fruits, perfectly combined for a refreshing treat.",
        image: "assets/images/item-1.png",
        category: "Desserts",
        price: 180,
        status: "available"
    },
    {
        id: 7,
        name: "Kottu Roti",
        description: "A beloved Sri Lankan street food — chopped roti stir-fried with vegetables, egg, and aromatic spices.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75",
        category: "Main Course",
        price: 320,
        status: "available"
    },
    {
        id: 8,
        name: "Egg Hoppers (Appa)",
        description: "Bowl-shaped crispy rice flour pancakes with a soft egg cooked in the center, served with coconut sambol.",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&q=75",
        category: "Main Course",
        price: 160,
        status: "available"
    },
    {
        id: 9,
        name: "Dhal Curry",
        description: "A comforting lentil curry slow-cooked with turmeric, onions, and coconut milk — a Sri Lankan staple.",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&q=75",
        category: "Side Dishes",
        price: 120,
        status: "available"
    },
    {
        id: 10,
        name: "Pol Sambol",
        description: "Freshly grated coconut mixed with red chilli, lime juice, and onions — the perfect Sri Lankan condiment.",
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&q=75",
        category: "Side Dishes",
        price: 80,
        status: "available"
    },
    {
        id: 11,
        name: "King Coconut Water",
        description: "Naturally sweet and hydrating water from fresh Sri Lankan king coconuts, served chilled.",
        image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&q=75",
        category: "Beverages",
        price: 150,
        status: "available"
    },
    {
        id: 12,
        name: "Mango Juice",
        description: "Chilled, freshly blended mango juice made from ripe Sri Lankan mangoes with no added sugar.",
        image: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400&q=75",
        category: "Beverages",
        price: 180,
        status: "available"
    },
    {
        id: 13,
        name: "Samosa",
        description: "Golden-fried crispy pastry filled with spiced potatoes, onions, and green chilli — a satisfying snack.",
        image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&q=75",
        category: "Short Eats",
        price: 100,
        status: "available"
    },
    {
        id: 14,
        name: "Fish Cutlet",
        description: "Spiced tuna and potato croquettes, crumb-coated and fried to a golden crisp — a Sri Lankan favourite.",
        image: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=75",
        category: "Short Eats",
        price: 110,
        status: "available"
    },
    {
        id: 15,
        name: "Wattalappam",
        description: "A rich, steamed coconut custard pudding made with jaggery, eggs, and warm spices — a traditional dessert.",
        image: "https://images.unsplash.com/photo-1551024739-78b3f5832c3a?w=400&q=75",
        category: "Desserts",
        price: 140,
        status: "available"
    },
    {
        id: 16,
        name: "Kiribath (Milk Rice)",
        description: "Creamy rice cooked in fresh coconut milk, traditionally served at auspicious occasions with lunu miris.",
        image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=400&q=75",
        category: "Desserts",
        price: 130,
        status: "available"
    },
    {
        id: 17,
        name: "Gotu Kola Sambol",
        description: "A nutritious fresh herb salad made with pennywort, grated coconut, lime, and green chilli.",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=75",
        category: "Side Dishes",
        price: 90,
        status: "available"
    }
];

const STORAGE_KEY = 'helaBojunMenuItems';

function getMenuItems() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
}

function saveMenuItems(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function seedMenuItems() {
    if (!getMenuItems()) {
        saveMenuItems(DEFAULT_MENU_ITEMS);
    }
    return getMenuItems();
}

function getNextId() {
    const items = getMenuItems() || [];
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

function addMenuItem(item) {
    const items = getMenuItems() || [];
    item.id = getNextId();
    items.push(item);
    saveMenuItems(items);
    return item;
}

function updateMenuItem(id, updatedItem) {
    const items = getMenuItems() || [];
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
        items[index] = { ...items[index], ...updatedItem, id };
        saveMenuItems(items);
        return items[index];
    }
    return null;
}

function deleteMenuItem(id) {
    const items = getMenuItems() || [];
    const filtered = items.filter(i => i.id !== id);
    saveMenuItems(filtered);
}
