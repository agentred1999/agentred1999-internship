import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";

const SkeletonBlock = ({ width, height, borderRadius = "4px" }) => (
  <div
    className="skeleton"
    style={{ width, height, borderRadius, marginBottom: "8px", display: "block" }}
  />
);

const ItemDetails = () => {
  const { nftId } = useParams();
  const [nft, setNft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    axios
      .get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
      )
      .then((res) => {
        setNft(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch NFT details:", err);
        setLoading(false);
      });
  }, [nftId]);

  return (
    <div id="wrapper">
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
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                {loading ? (
                  <SkeletonBlock width="100%" height="350px" borderRadius="8px" />
                ) : (
                  <img
                    src={nft?.nftImage}
                    className="img-fluid img-rounded mb-sm-30 nft-image"
                    alt=""
                  />
                )}
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  {loading ? (
                    <SkeletonBlock width="60%" height="36px" />
                  ) : (
                    <h2>
                      {nft?.title} #{nft?.tag}
                    </h2>
                  )}

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {loading ? "..." : nft?.views}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {loading ? "..." : nft?.likes}
                    </div>
                  </div>

                  {loading ? (
                    <>
                      <SkeletonBlock width="100%" height="16px" />
                      <SkeletonBlock width="90%" height="16px" />
                      <SkeletonBlock width="80%" height="16px" />
                    </>
                  ) : (
                    <p>{nft?.description}</p>
                  )}

                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading ? (
                            <SkeletonBlock width="50px" height="50px" borderRadius="50%" />
                          ) : (
                            <Link to={`/author/${nft?.ownerId}`}>
                              <img className="lazy" src={nft?.ownerImage} alt="" />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                          {loading ? (
                            <SkeletonBlock width="100px" height="16px" />
                          ) : (
                            <Link to={`/author/${nft?.ownerId}`}>{nft?.ownerName}</Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          {loading ? (
                            <SkeletonBlock width="50px" height="50px" borderRadius="50%" />
                          ) : (
                            <Link to={`/author/${nft?.creatorId}`}>
                              <img className="lazy" src={nft?.creatorImage} alt="" />
                              <i className="fa fa-check"></i>
                            </Link>
                          )}
                        </div>
                        <div className="author_list_info">
                          {loading ? (
                            <SkeletonBlock width="100px" height="16px" />
                          ) : (
                            <Link to={`/author/${nft?.creatorId}`}>{nft?.creatorName}</Link>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      {loading ? (
                        <SkeletonBlock width="60px" height="20px" />
                      ) : (
                        <span>{nft?.price}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ItemDetails;
