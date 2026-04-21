import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from "../Header/Header";

const Dealer = () => {
  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [postReview, setPostReview] = useState(<></>);

  const { id } = useParams();

  const dealer_url = `/djangoapp/dealer/${id}`;
  const reviews_url = `/djangoapp/reviews/dealer/${id}`;
  const post_review = `/postreview/${id}`;

  // -------------------------
  // DEALER FETCH (FIXED)
  // -------------------------
  const get_dealer = async () => {
    try {
      const res = await fetch(dealer_url);
      if (!res.ok) return;

      const data = await res.json();

      // backend direct object OR wrapped object safe handling
      const dealerData = data.dealer ? data.dealer : data;

      setDealer(dealerData);
    } catch (err) {
      console.log("Dealer fetch error:", err);
    }
  };

  // -------------------------
  // REVIEWS FETCH (SAFE)
  // -------------------------
  const get_reviews = async () => {
    try {
      const res = await fetch(reviews_url);
      if (!res.ok) return;

      const data = await res.json();

      if (data.status === 200 && Array.isArray(data.reviews)) {
        if (data.reviews.length > 0) {
          setReviews(data.reviews);
        } else {
          setUnreviewed(true);
        }
      }
    } catch (err) {
      console.log("Review fetch error:", err);
    }
  };

  // -------------------------
  // ICONS
  // -------------------------
  const senti_icon = (sentiment) => {
    if (sentiment === "positive") return positive_icon;
    if (sentiment === "negative") return negative_icon;
    return neutral_icon;
  };

  // -------------------------
  // INIT
  // -------------------------
  useEffect(() => {
    get_dealer();
    get_reviews();

    if (sessionStorage.getItem("username")) {
      setPostReview(
        <a href={post_review}>
          <img
            src={review_icon}
            style={{ width: "10%", marginLeft: "10px", marginTop: "10px" }}
            alt="Post Review"
          />
        </a>
      );
    }
  }, [id]);

  // -------------------------
  // RENDER
  // -------------------------
  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer?.full_name || "Loading..."}
          {postReview}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer
            ? `${dealer.city}, ${dealer.address}, Zip - ${dealer.zip}, ${dealer.state}`
            : ""}
        </h4>
      </div>

      <div className="reviews_panel">
        {!dealer && !unreviewed && reviews.length === 0 ? (
          <div>Loading Reviews....</div>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, idx) => (
            <div className="review_panel" key={idx}>
              <img
                src={senti_icon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model}{" "}
                {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;