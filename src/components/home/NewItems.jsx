import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const SkeletonCard = () => (
  <div className="nft__item">
    <div className="author_list_pp">
      <div className="skeleton" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
    </div>
    <div className="nft__item_wrap">
      <div className="skeleton" style={{ width: "100%", height: "200px", borderRadius: "8px" }}></div>
    </div>
    <div className="nft__item_info">
      <div className="skeleton" style={{ width: "70%", height: "20px", marginBottom: "8px" }}></div>
      <div className="skeleton" style={{ width: "40%", height: "16px", marginBottom: "8px" }}></div>
      <div className="skeleton" style={{ width: "30%", height: "16px" }}></div>
    </div>
  </div>
);

const CountdownTimer = ({ expiryDate }) => {
  const calcTimeLeft = () => {
    const diff = expiryDate - Date.now();
    if (diff <= 0) return null;
    const h = Math.floor(diff / 1000 / 3600);
    const m = Math.floor((diff / 1000 % 3600) / 60);
    const s = Math.floor(diff / 1000 % 60);
    return { h, m, s };
  };

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [expiryDate]);

  if (!timeLeft) return null;
  return (
    <div className="de_countdown">
      {timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
    </div>
  );
};

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems")
      .then((res) => {
        setItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch new items:", err);
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
    <section id="section-items" className="no-bottom">
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
              <h2>New Items</h2>
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
              {items.map((item) => (
                <div className="item" key={item.id} data-aos="fade-up">
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link to={`/author/${item.authorId}`}>
                        <img className="lazy" src={item.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>

                    {item.expiryDate && (
                      <CountdownTimer expiryDate={item.expiryDate} />
                    )}

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                      <Link to={`/item-details/${item.nftId}`}>
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>

                    <div className="nft__item_info">
                      <Link to={`/item-details/${item.nftId}`}>
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
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

export default NewItems;
