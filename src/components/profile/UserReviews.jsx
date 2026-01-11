import './Profile.css';

export const UserReviews = ({ reviews }) => {
    if (reviews.length === 0) {
        return (
            <div className="empty-state">
                <p>No has escrito reseñas aún</p>
            </div>
        );
    }

    return (
        <div className="reviews-list">
            {reviews.map(review => (
                <div key={review.id} className="review-card">
                    <div className="review-header">
                        <span className="review-stars">
                            {'★'.repeat(review.stars)}{'☆'.repeat(5 - review.stars)}
                        </span>
                        <span className="review-date">
                            {new Date(review.created_at).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="review-comment">{review.comment}</p>
                    <div className="review-target">
                        Sobre: <strong>{review.targetName || 'Destino'}</strong>
                    </div>
                </div>
            ))}
        </div>
    );
};