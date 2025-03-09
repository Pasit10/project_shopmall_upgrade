const products = [
  {
    id: 1,
    name: 'Comfort Lounge Chair',
    price: '$1,299',
    description: 'Ergonomic design with premium leather upholstery',
    imageSrc: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
  },
  {
    id: 2,
    name: 'Minimalist Coffee Table',
    price: '$899',
    description: 'Solid oak with tempered glass top',
    imageSrc: 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80',
  },
  {
    id: 3,
    name: 'Scandinavian Sofa',
    price: '$2,499',
    description: 'Three-seater with washable linen cover',
    imageSrc: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
  {
    id: 4,
    name: 'Designer Dining Set',
    price: '$3,299',
    description: 'Table with six matching chairs',
    imageSrc: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  },
];

const FeaturedProducts = () => {
  return (
    <div className="container py-5">
      <h2 className="text-center fw-bold mb-2">Featured Products</h2>
      <p className="text-center text-muted mb-5">Our most popular pieces, handpicked for quality and design</p>
      
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-3 mb-4">
            <div className="card border-0 product-card h-100">
              <div className="product-image-container">
                <img src={product.imageSrc} alt={product.name} className="card-img-top product-image" />
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="card-title h6 fw-bold">{product.name}</h5>
                  <span className="fw-bold">{product.price}</span>
                </div>
                <p className="card-text text-muted small mb-3">
                  {product.description}
                </p>
                <button className="btn btn-primary w-100">
                  Add to cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;