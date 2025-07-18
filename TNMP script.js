const prices = {
  "Pandesal": 3, "Cheese Roll": 10, "Pan de Coco": 8, "Chocolate Crinkles": 12,
  "Ensaymada": 15, "Kalihim": 5, "Banana": 65, "Cokies": 12, "Brownies": 20,
  "Spanish Bread": 10, "Star Monay": 7, "Chesseroll per slice": 20, "Pandelemon": 6,
  "Coca-Cola": 20, "Sprite": 20, "Royal": 20, "RC Cola": 18, "Fruit Soda": 15
};

const imageMap = {
  "Pandesal": "Pandesal.png", "Cheese Roll": "Chesseroll.png", "Pan de Coco": "Pandecoco.jpg",
  "Chocolate Crinkles": "chocolate crinkles.jpg", "Ensaymada": "ensaymada.jpg", "Kalihim": "kalihim.jpg",
  "Banana": "Banana.webp", "Cokies": "Cokies.png", "Brownies": "Brownies.jpg",
  "Spanish Bread": "Spanish Bread.jpg", "Star Monay": "StarMonay.webp", "Chesseroll per slice": "Chocolate Roll.jpg",
  "Pandelemon": "Pan-de-Lemon.jpg", "Coca-Cola": "Coke.png", "Sprite": "Sprite.jpg",
  "Royal": "Royal-Mismo-12_s-500x500.webp", "RC Cola": "rc.avif", "Fruit Soda": "fruitsoda.jpg"
};

const orderQueue = [];
const servedOrders = [];

const form = document.getElementById('orderForm');

Object.keys(prices).forEach(item => {
  const div = document.createElement('div');
  div.className = 'menu-item';
  div.innerHTML = `
    <img src="${imageMap[item]}" />
    <span>${item} - &#8369;${prices[item]}</span>
    <input type="number" min="0" value="0" id="qty-${item}">
  `;
  form.appendChild(div);
});

function submitOrder() {
  const name = document.getElementById('customerName').value.trim();
  if (!name) return alert("Please enter your name.");

  const time = new Date().toLocaleTimeString();
  const items = [];

  Object.keys(prices).forEach(item => {
    const qty = parseInt(document.getElementById(`qty-${item}`).value);
    if (qty && qty > 0) {
      items.push({ item, qty });
    }
  });

  if (items.length === 0) return alert("Please enter quantities for at least one item.");

  const total = items.reduce((sum, i) => sum + prices[i.item] * i.qty, 0);
  orderQueue.push({ name, items, total, time });

  renderQueue();
  document.getElementById('orderForm').reset();
  document.getElementById('customerName').value = "";
}

function renderQueue() {
  const list = document.getElementById('orderQueue');
  list.innerHTML = '';
  orderQueue.forEach(order => {
    const text = order.items.map(i => `${i.qty}x ${i.item}`).join(', ');
    const li = document.createElement('li');
    li.innerHTML = `<strong>${order.name}</strong> ordered: ${text} (₱${order.total}) at ${order.time}`;
    list.appendChild(li);
  });
  document.getElementById('serveBtn').disabled = orderQueue.length === 0;
}

function renderServed() {
  const list = document.getElementById('servedOrders');
  list.innerHTML = '';
  servedOrders.forEach(order => {
    const text = order.items.map(i => `${i.qty}x ${i.item}`).join(', ');
    const li = document.createElement('li');
    li.textContent = `✔️ ${order.name} - ${text} - ₱${order.total}`;
    list.appendChild(li);
  });
}

function serveNextOrder() {
  if (orderQueue.length === 0) return;
  const order = orderQueue.shift();

  setTimeout(() => {
    servedOrders.push(order);
    renderQueue();
    renderServed();
    downloadReceipt(order);
    showModal();
  }, 1000);
}

function downloadReceipt(order) {
  const serial = 'MP' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  const orderNum = Math.floor(100000 + Math.random() * 900000);
  const time = order.time;

  let lines = '';
  order.items.forEach(i => {
    const line = `- ${i.qty}x ${i.item}`.padEnd(25, '.') + ` ₱${prices[i.item] * i.qty}`;
    lines += line + '\n';
  });

  const content =
`         TINAPAY NI JUAN MANG PANOT
    Serial#: ${serial}   ORDER#: ${orderNum}
             OFFICIAL RECEIPT

Customer: ${order.name}
Time: ${time}

Items Ordered:
${lines}
TOTAL AMOUNT: ₱${order.total}.00 Cash

THIS SERVES AS AN OFFICIAL RECEIPT`;

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `receipt_${order.name}_${time.replace(/:/g, '-')}.txt`;
  link.click();
}

function showModal() {
  document.getElementById("successModal").style.display = "block";
}

function closeModal() {
  document.getElementById("successModal").style.display = "none";
}

renderQueue();
renderServed();
