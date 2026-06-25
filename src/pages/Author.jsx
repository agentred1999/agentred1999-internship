import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";

const Author = () => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(() => {
    return localStorage.getItem(`following_${id}`) === "true";
  });

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${id}`)
      .then((res) => {
        setAuthor(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch author:", err);
        setLoading(false);
      });
  }, [id]);

  const handleFollow = () => {
    const newVal = !following;
    setFollowing(newVal);
    localStorage.setItem(`following_${id}`, newVal);
  };

  return (
    <div id="wrapper">
      <style>{`
        .skeleton {
          background: linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 4px;
          display: inline-block;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>
        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      {loading ? (
                        <div className="skeleton" style={{ width: "150px", height: "150px", borderRadius: "50%" }}></div>
                      ) : (
                        <img src={author?.authorImage} alt="" />
                      )}
                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {loading ? (
                            <div className="skeleton" style={{ width: "150px", height: "24px", marginBottom: "8px" }}></div>
                          ) : (
                            author?.authorName
                          )}
                          <span className="profile_username">
                            {!loading && `@${author?.tag}`}
                          </span>
                          <span id="wallet" className="profile_wallet">
                            {!loading && author?.address}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">
                        {loading ? "..." : author?.followers + (following ? 1 : 0)} followers
                      </div>
                      <Link to="#" className="btn-main" onClick={handleFollow}>
                        {following ? "Unfollow" : "Follow"}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems
                    nftCollection={author?.nftCollection}
                    loading={loading}
                    authorImage={author?.authorImage}
                    authorId={id}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
