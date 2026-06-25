import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const SkeletonCard = () => (
  <div className="nft_coll">
    <div className="nft_wrap">
      <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "8px" }}></div>
    </div>
    <div className="nft_coll_pp">
      <div className="skeleton" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
    </div>
    <div className="nft_coll_info">
      <div className="skeleton" style={{ width: "80%", height: "20px", marginBottom: "8px" }}></div>
      <div className="skeleton" style={{ width: "40%", height: "16px" }}></div>
    </div>
  </div>
);

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections")
      .then((res) => {
        setCollections(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hot collections:", err);
        setLoading(false);
      });
  }, []);

  const carouselOptions = {
    loop: true,
    margin: 10,
    nav: true,
    dots: false,
    responsive: {
      0:    { items: 1 },
      600:  { items: 2 },
      900:  { items: 3 },
      1200: { items: 4 },
    },
  };

  return (
    <section id="section-collections" className="no-bottom">
      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="container">
        <div className="row">
          <div className="col-lg-12" data-aos="fade-up">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          {loading ? (
            new Array(4).fill(0).map((_, i) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={i}>
                <SkeletonCard />
              </div>
            ))
          ) : (
            <OwlCarousel className="owl-theme" {...carouselOptions}>
              {collections.map((item) => (
                <div className="item" key={item.id} data-aos="fade-up">
                  <div className="nft_coll">
                    <div className="nft_wrap">
                      <Link to={`/item-details/${item.nftId}`}>
                        <img src={item.nftImage} className="lazy img-fluid" alt="" />
                      </Link>
                    </div>
                    <div className="nft_coll_pp">
                      <Link to={`/author/${item.authorId}`}>
                        <img className="lazy pp-coll" src={item.authorImage} alt="" />
                      </Link>
                      <i className="fa fa-check"></i>
                    </div>
                    <div className="nft_coll_info">
                      <Link to="/explore">
                        <h4>{item.title}</h4>
                      </Link>
                      <span>ERC-{item.code}</span>
                    </div>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
