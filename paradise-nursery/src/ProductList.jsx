import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './CartSlice';
import CartItem from './CartItem';
import './App.css';

const plantsArray = [
  {
    category: "Air Purifying Plants",
    plants: [
      { name: "Snake Plant", image: "https://cdn.pixabay.com/photo/2021/01/22/06/04/snake-plant-5939187_1280.jpg", cost: "$15" },
      { name: "Spider Plant", image: "https://images.unsplash.com/photo-1572688484438-313a6e50c333?q=80&w=300", cost: "$12" },
      { name: "Peace Lily", image: "https://cdn.pixabay.com/photo/2019/06/12/14/14/peace-lily-4269365_1280.jpg", cost: "$18" },
      { name: "Boston Fern", image: "https://cdn.pixabay.com/photo/2020/04/25/09/17/fern-5089984_1280.jpg", cost: "$14" },
      { name: "Rubber Plant", image: "https://cdn.pixabay.com/photo/2020/02/15/11/15/plant-4850628_1280.jpg", cost: "$22" },
      { name: "Aloe Vera", image: "https://cdn.pixabay.com/photo/2018/04/02/18/12/aloe-vera-3284687_1280.jpg", cost: "$10" }
    ]
  },
  {
    category: "Aromatic Plants",
    plants: [
      { name: "Lavender", image: "https://images.unsplash.com/photo-1611909023032-2d6b3134ecba?q=80&w=300", cost: "$18" },
      { name: "Jasmine", image: "https://images.unsplash.com/photo-1592729645009-b96d1e63d14b?q=80&w=300", cost: "$20" },
      { name: "Rosemary", image: "https://cdn.pixabay.com/photo/2016/08/16/16/27/rosemary-1598284_1280.jpg", cost: "$15" },
      { name: "Mint", image: "https://cdn.pixabay.com/photo/2016/01/26/18/16/mint-1163013_1280.jpg", cost: "$8" },
      { name: "Lemon Balm", image: "https://cdn.pixabay.com/photo/2017/05/19/15/21/lemon-balm-2326760_1280.jpg", cost: "$12" },
      { name: "Eucalyptus", image: "https://cdn.pixabay.com/photo/2019/08/20/09/20/eucalyptus-4418251_1280.jpg", cost: "$24" }
    ]
  },
  {
    category: "Low Maintenance Plants",
    plants: [
      { name: "ZZ Plant", image: "https://images.unsplash.com/photo-1632207691143-643e2a9a9361?q=80&w=300", cost: "$25" },
      { name: "Pothos", image: "https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=300", cost: "$10" },
      { name: "Cast Iron Plant", image: "https://cdn.pixabay.com/photo/2021/01/18/18/16/plant-5928923_1280.jpg", cost: "$28" },
      { name: "Succulent", image: "https://cdn.pixabay.com/photo/2016/11/21/16/07/succulent-1846151_1280.jpg", cost: "$9" },
      { name: "Jade Plant", image: "https://cdn.pixabay.com/photo/2020/05/18/08/38/jade-plant-5185202_1280.jpg", cost: "$16" },
      { name: "Pilea", image: "https://cdn.pixabay.com/photo/2020/03/24/11/32/pilea-4963777_1280.jpg", cost: "$14" }
    ]
  }
];

function ProductList({ onGoHome }) {
  const [showCart, setShowCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState({});
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  const totalCartQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant));
    setAddedToCart((prevState) => ({
      ...prevState,
      [plant.name]: true,
    }));
  };

  return (
    <div>
      {/* Header Navigation */}
      <nav className="navbar">
        <h2 style={{ cursor: 'pointer' }} onClick={onGoHome}>Paradise Nursery</h2>
        <div className="nav-links">
          <button onClick={onGoHome}>Home</button>
          <button onClick={() => setShowCart(false)}>Plants</button>
          <button className="cart-icon-container" onClick={() => setShowCart(true)}>
            🛒 Cart
            {totalCartQuantity > 0 && <span className="cart-badge">{totalCartQuantity}</span>}
          </button>
        </div>
      </nav>

      {/* Conditional rendering for Cart vs Catalog */}
      {showCart ? (
        <CartItem onContinueShopping={() => setShowCart(false)} />
      ) : (
        <div className="product-catalog">
          {plantsArray.map((categoryObj, index) => (
            <div key={index}>
              <h2 style={{ textAlign: 'center', marginTop: '20px' }}>{categoryObj.category}</h2>
              <div className="product-grid">
                {categoryObj.plants.map((plant, pIndex) => (
                  <div className="product-card" key={pIndex}>
                    <img src={plant.image} alt={plant.name} />
                    <h3>{plant.name}</h3>
                    <p>{plant.cost}</p>
                    <button
                      disabled={addedToCart[plant.name] || cartItems.some(item => item.name === plant.name)}
                      onClick={() => handleAddToCart(plant)}
                    >
                      {addedToCart[plant.name] || cartItems.some(item => item.name === plant.name)
                        ? "Added to Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
