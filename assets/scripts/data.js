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
