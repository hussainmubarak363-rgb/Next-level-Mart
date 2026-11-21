import express from 'express';
import cors from 'cors';
import { randomUUID } from 'node:crypto';

const app = express();
const port = Number(process.env.PORT || 4000);
app.use(cors());
app.use(express.json());

const products = [
  { id: '1', name: 'Tamatar', category: 'Sabzi', price: 30, unit: 'kg', emoji: '🍅', stock: 40 },
  { id: '2', name: 'Aloo', category: 'Sabzi', price: 25, unit: 'kg', emoji: '🥔', stock: 50 },
  { id: '3', name: 'Kela', category: 'Fruits', price: 50, unit: 'dozen', emoji: '🍌', stock: 22 },
  { id: '4', name: 'Doodh', category: 'Grocery', price: 30, unit: 'litre', emoji: '🥛', stock: 35 },
  { id: '5', name: 'Basmati Rice', category: 'Grocery', price: 120, unit: 'kg', emoji: '🍚', stock: 18 },
  { id: '6', name: 'Palak', category: 'Sabzi', price: 20, unit: 'bunch', emoji: '🥬', stock: 25 }
];
const orders = [];

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'Next Level Mart API' }));
app.get('/api/products', (_req, res) => res.json(products));
app.get('/api/orders', (_req, res) => res.json(orders));
app.post('/api/orders', (req, res) => {
  const { customerName, phone, address, items } = req.body ?? {};
  if (!customerName || !phone || !address || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'customerName, phone, address and at least one item are required' });
  }
  const order = { id: randomUUID(), customerName, phone, address, items, status: 'received', createdAt: new Date().toISOString() };
  orders.unshift(order);
  return res.status(201).json(order);
});
app.patch('/api/orders/:id/status', (req, res) => {
  const order = orders.find(item => item.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  const allowed = ['received', 'confirmed', 'packing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!allowed.includes(req.body?.status)) return res.status(400).json({ error: 'Invalid order status' });
  order.status = req.body.status;
  return res.json(order);
});
app.listen(port, () => console.log(`Next Level Mart API listening on http://localhost:${port}`));
