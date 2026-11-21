import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const demoProducts = [
  { id: '1', name: 'Tamatar', category: 'Sabzi', price: 30, stock: 40 },
  { id: '2', name: 'Aloo', category: 'Sabzi', price: 25, stock: 50 },
  { id: '3', name: 'Kela', category: 'Fruits', price: 50, stock: 22 },
  { id: '4', name: 'Doodh', category: 'Grocery', price: 30, stock: 35 }
];

function App() {
  const [products, setProducts] = React.useState(demoProducts);
  const [orders, setOrders] = React.useState([]);
  const [connected, setConnected] = React.useState(false);

  React.useEffect(() => {
    Promise.all([fetch(`${API}/api/products`).then(r => r.json()), fetch(`${API}/api/orders`).then(r => r.json())])
      .then(([p, o]) => { setProducts(p); setOrders(o); setConnected(true); })
      .catch(() => setConnected(false));
  }, []);

  return <div className="layout">
    <aside><div className="brand">🥬 <span>Next Level<br/>Mart</span></div><p className="nav active">▦ &nbsp; Overview</p><p className="nav">▤ &nbsp; Products</p><p className="nav">🛒 &nbsp; Orders</p><p className="nav">▧ &nbsp; Inventory</p><p className="nav">⚙ &nbsp; Settings</p><div className="side-foot">Grocery made simple</div></aside>
    <main><header><div><h1>Dashboard</h1><p>Welcome back! Here is your store at a glance.</p></div><span className={connected ? 'badge online' : 'badge'}>{connected ? 'API connected' : 'Demo data'}</span></header>
      <section className="stats"><article><span>Today’s revenue</span><strong>₹{orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString('en-IN')}</strong><small>Based on recorded orders</small></article><article><span>Total orders</span><strong>{orders.length}</strong><small>Orders received</small></article><article><span>Products</span><strong>{products.length}</strong><small>Across all categories</small></article><article><span>Low stock</span><strong>{products.filter(p => p.stock < 10).length}</strong><small>Items under 10 units</small></article></section>
      <section className="panel"><div className="panel-head"><div><h2>Product inventory</h2><p>Manage your available products and stock.</p></div><button onClick={() => alert('Product editing will be added with persistent database support.')}>＋ Add product</button></div><div className="table-wrap"><table><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><b>{p.name}</b></td><td>{p.category}</td><td>₹{p.price}</td><td>{p.stock ?? '—'}</td><td><span className={p.stock < 10 ? 'pill low' : 'pill'}>{p.stock < 10 ? 'Low stock' : 'In stock'}</span></td></tr>)}</tbody></table></div></section>
      <section className="panel"><div className="panel-head"><div><h2>Recent orders</h2><p>Latest customer orders</p></div></div>{orders.length ? <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Phone</th><th>Status</th></tr></thead><tbody>{orders.slice(0, 8).map(o => <tr key={o.id}><td>{o.id.slice(0, 8)}</td><td>{o.customerName}</td><td>{o.phone}</td><td><span className="pill">{o.status}</span></td></tr>)}</tbody></table></div> : <div className="empty">No orders yet. New orders will appear here.</div>}</section>
      <footer>Next Level Mart · Admin dashboard starter</footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')).render(<App />);
