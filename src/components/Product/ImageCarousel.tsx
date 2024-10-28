import React, { useState } from 'react'

interface IProps {
    images: string[]
}

const ImageCarousel: React.FC<IProps> = ({ images }) => {

    const [carouselIndex] = useState<number>(0)

    return (
        <div id="demo" className="carousel slide" data-interval="true" data-bs-ride="carousel" style={{
            background: '#ffffff',
            borderRadius: '1em',
            overflow: 'hidden',
            boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
            width: '100%'
        }}  >

            <div className="carousel-indicators">
                {images.map((_, index) =>
                    <button key={index}
                        type="button"
                        data-bs-target="#demo"
                        data-bs-slide-to={index}
                        className={`${carouselIndex == index ? 'active' : ''}`}>
                    </button>
                )}
            </div>

            <div className="carousel-inner">
                {images.map((image, index) =>
                    <div key={image}
                        className={`carousel-item ${carouselIndex == index ? 'active' : ''}`}
                        data-bs-interval="3000"
                        style={{
                            aspectRatio: '1/1',
                            width: '100%',
                        }}>
                        <img src={image} alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                            }} />
                    </div>
                )}
            </div>

            <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
                <span className="carousel-control-prev-icon"></span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
                <span className="carousel-control-next-icon"></span>
            </button>
        </div>
    )
}

export default ImageCarousel