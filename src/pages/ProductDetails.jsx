import React,{ useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
const ProductDetails = () => {
    const { id } = useParams()
    const [product, setProduct] = useState();
    const getProductDetails = async () => {
        try {
            const response = await api.get(`/medicines/get-details/${id}`);
            setProduct(response.data.product)
        } catch (error) {
            console.log(error);            
        }
    }

    useEffect (() => {
        getProductDetails()
    }, [])

    console.log(product);
    

  return (
    <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* LEFT: Product Images */}
                <div className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                        {product?.images.map((image, index) => (
                            <div
                                key={index}
                                className="border rounded-lg overflow-hidden"
                            >
                                <img
                                    src={image.url}
                                    alt={`product-${index}`}
                                    className="w-full h-80 object-cover hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: Product Details */}
                <div className="w-full flex flex-col gap-4">
                    <h2 className="text-3xl font-semibold text-black">
                        {product?.title}
                    </h2>

                    <p className="text-black">
                        {product?.description}
                    </p>

                    <div className="space-y-2 text-sm">
                        <p className='text-black'>
                            <span className="font-medium text-black mr-1.5">Category:</span>
                            {product?.category}
                        </p>
                        <p className='text-black'>
                            <span className="font-medium text-black mr-1.5">Stock:</span>
                            {product?.stocks}
                        </p>
                        <p className='text-black'>
                            <span className="font-medium text-black mr-1.5">Rating:</span>
                            ⭐ {product?.ratings}
                        </p>
                    </div>

                    <p className="text-2xl font-bold text-green-600">
                        Rs:{product?.price}
                    </p>

                    <button className="mt-4 w-fit px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
                        Add to Cart
                    </button>
                </div>

            </div>
        </div>
  )
}

export default ProductDetails
