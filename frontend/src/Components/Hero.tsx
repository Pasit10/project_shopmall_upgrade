const Hero = () => {
  return (
    <div className="hero-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6 mb-5 mb-lg-0">
            <h1 className="display-4 fw-bold mb-3">
              Modern furniture for <span className="text-primary">modern living</span>
            </h1>
            <p className="lead text-muted mb-4">
              Discover our curated collection of designer furniture pieces that blend style, comfort, and functionality for your home.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <a href="/shop" className="btn btn-primary btn-lg px-4 py-2" >
                Shop Now
              </a>
              <a href="/categories" className="btn btn-outline-primary btn-lg px-4 py-2">
                View Collections
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <img
              src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              alt="Modern living room with stylish furniture"
              className="img-fluid rounded hero-image"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;