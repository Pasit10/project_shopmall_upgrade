// import { useState , useEffect } from "react";
// import axiosInstant from "../utils/axios";

const categories = [
	{
		id: 1,
		name: 'Living Room',
		imageSrc: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
	},
	{
		id: 2,
		name: 'Bedroom',
		imageSrc: 'https://images.unsplash.com/photo-1617325247661-675ab4b64b72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80'
	},
	{
		id: 3,
		name: 'Dining',
		imageSrc: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80'
	},
	{
		id: 4,
		name: 'Office',
		imageSrc: 'https://images.unsplash.com/photo-1593642532744-d377ab507dc8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
	}, {
		id: 5,
		name: 'Outdoor',
		imageSrc: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80'
	}, {
		id: 6,
		name: 'Decor',
		imageSrc: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=958&q=80'
	},
];

const Categories = () => {
	// const [categories, setCatagories] = useState([])

	// useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axiosInstant.get("/product/type", {withCredentials:true});
    //             if(response.status === 200){
    //                 setCatagories(categories)
    //             }
    //             console.log("User fetched:", response.data);
    //         } catch (error) {
    //             console.error("Error fetching data:", error);
    //         }
    //     };

    //     fetchData();
    // }, []);

	return (<div className="bg-light py-5">
		<div className="container">
			<div className="text-center mb-5">
				<h2 className="fw-bold">Shop by Category</h2>
				<p className="text-muted">
					Find the perfect furniture for every room in your home
				</p>
			</div>

			<div className="row"> {
				categories.map((category) => (<div key={
						category.id
					}
					className="col-md-6 col-lg-4">
					<a href="#" className="text-decoration-none">
						<div className="category-card">
							<img src={
									category.imageSrc
								}
								alt={
									category.name
								}/>
							<div className="category-overlay">
								<h3 className="h5 fw-bold mb-1"> {
									category.name
								}</h3>
								<p className="small mb-0">Shop now</p>
							</div>
						</div>
					</a>
				</div>))
			} </div>
		</div>
	</div>);
};

export default Categories;
