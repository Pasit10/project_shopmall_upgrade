import Footer from "../../Components/Footer"
import Navbar from "../../Components/Navbar"
import ProductDetail from "../../Components/ProductDetail"


function ProductDetailPage() {
  return <>
   <div className="d-flex flex-column min-vh-100">
    <Navbar/>
      <div className="flex-grow-1">
        <ProductDetail /> 
      </div>
      <Footer />
    </div>
  </>
}

export default ProductDetailPage