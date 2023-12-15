import React, { useState } from 'react';
import Rating from 'react-rating-stars-component';

interface EditReviewProps {
  initialText: string;
  initialRating: number;
  onSave: (editedText: string, rating: number) => void;
  onCancel: () => void;
}

const EditReview: React.FC<EditReviewProps> = ({ initialText, initialRating, onSave, onCancel }) => {
  const [editedText, setEditedText] = useState(initialText);
  const [rating, setRating] = useState(initialRating);

  const handleSave = () => {
    onSave(editedText, rating);
  };

  return (
    <div>
      <textarea value={editedText} onChange={(e) => setEditedText(e.target.value)} />
      <div>
        <label>Calificación:</label>
        <Rating
          count={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
          size={24}
          activeColor="#ffd700"
        />
      </div>
      <button onClick={handleSave}>Guardar</button>
      <button onClick={onCancel}>Cancelar</button>
    </div>
  );
};

export default EditReview;
