import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 mb-5 mb-lg-0">
            <h2 className="h4 text-white fw-bold mb-4">LUXE</h2>
            <p className="mb-4">
              Making beautiful, high-quality furniture accessible to everyone since 2010.
            </p>
            <div className="social-icons d-flex">
              <a href="#"><Facebook size={22} /></a>
              <a href="#"><Instagram size={22} /></a>
              <a href="#"><Twitter size={22} /></a>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="row">
              <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                <h5>Shop</h5>
                <ul>
                  <li><a href="#">New Arrivals</a></li>
                  <li><a href="#">Best Sellers</a></li>
                  <li><a href="#">Sale</a></li>
                  <li><a href="#">Collections</a></li>
                </ul>
              </div>
              <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                <h5>Support</h5>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Shipping & Returns</a></li>
                  <li><a href="#">Warranty</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
              <div className="col-sm-6 col-md-3 mb-4 mb-md-0">
                <h5>Company</h5>
                <ul>
                  <li><a href="#">About Us</a></li>
                  <li><a href="#">Careers</a></li>
                  <li><a href="#">Sustainability</a></li>
                  <li><a href="#">Press</a></li>
                </ul>
              </div>
              <div className="col-sm-6 col-md-3">
                <h5>Legal</h5>
                <ul>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Cookie Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <hr className="mt-5 mb-4 border-secondary" />
        <p className="text-center mb-0">
          &copy; 2025 LUXE Furniture, Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;