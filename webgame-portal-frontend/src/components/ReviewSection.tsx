import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import styled from "styled-components";

const ReviewContainer = styled.div`
  background-color: #16202d;
  padding: 1rem;
  margin-top: 1rem;
`;

const ReviewForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const ReviewInput = styled.textarea`
  background-color: #2a475e;
  color: #c6d4df;
  border: none;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
`;

const ReviewItem = styled.div`
  background-color: #2a475e;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
`;

interface Review {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewSectionProps {
  gameId: string;
  reviews: Review[];
  onSubmitReview: (rating: number, comment: string) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  gameId,
  reviews,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(rating, comment);
    setRating(5);
    setComment("");
  };

  return (
    <ReviewContainer>
      <h3>レビュー</h3>
      {isLoggedIn && (
        <ReviewForm onSubmit={handleSubmit}>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num}星
              </option>
            ))}
          </select>
          <ReviewInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="レビューを書く..."
            required
          />
          <button type="submit">送信</button>
        </ReviewForm>
      )}
      <ReviewList>
        {reviews.map((review) => (
          <ReviewItem key={review.id}>
            <div>
              {review.username} - {review.rating}星
            </div>
            <div>{review.comment}</div>
            <div>{new Date(review.createdAt).toLocaleDateString()}</div>
          </ReviewItem>
        ))}
      </ReviewList>
    </ReviewContainer>
  );
};

export default ReviewSection;
