import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const SkeletonItem = () => (
  <li>
    <div className="author_list_pp">
      <div className="skeleton" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
    </div>
    <div className="author_list_info">
      <div className="skeleton" style={{ width: "100px", height: "16px", marginBottom: "6px" }}></div>
      <div className="skeleton" style={{ width: "60px", height: "14px" }}></div>
    </div>
  </li>
);

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers")
      .then((res) => {
        setSellers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch top sellers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section id="section-popular" className="pb-5">
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
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12" data-aos="fade-up">
            <ol className="author_list">
              {loading
                ? new Array(12).fill(0).map((_, i) => <SkeletonItem key={i} />)
                : sellers.map((seller) => (
                    <li key={seller.id} data-aos="fade-up">
                      <div className="author_list_pp">
                        <Link to={`/author/${seller.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={seller.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${seller.authorId}`}>
                          {seller.authorName}
                        </Link>
                        <span>{seller.price} ETH</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
