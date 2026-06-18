
// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: false
});

// Counter Animation
document.querySelectorAll('.counter').forEach(c => {
  let target = +c.dataset.target;
  let current = 0;
  let increment = Math.ceil(target / 100);
  
  let interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(interval);
    }
    c.innerText = current + '+';
  }, 20);
});

// Star Rating System
const stars = document.querySelectorAll('.star');
let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('click', () => {
    selectedRating = star.dataset.value;
    updateStars(selectedRating);
  });
  
  star.addEventListener('mouseover', () => {
    stars.forEach(s => {
      if (s.dataset.value <= star.dataset.value) {
        s.textContent = '★';
      } else {
        s.textContent = '☆';
      }
    });
  });
});

document.addEventListener('mouseleave', () => {
  updateStars(selectedRating);
});

function updateStars(rating) {
  stars.forEach((s, i) => {
    if (i < rating) {
      s.textContent = '★';
      s.classList.add('active');
    } else {
      s.textContent = '☆';
      s.classList.remove('active');
    }
  });
}

// Review Form Submission
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('reviewer-name').value;
    const email = document.getElementById('reviewer-email').value;
    const rating = selectedRating;
    const text = document.getElementById('reviewer-text').value;
    
    if (!name || !email || !rating || !text) {
      alert('Please fill all fields and select a rating');
      return;
    }
    
    // Create new review card
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card mb-3';
    reviewCard.innerHTML = `
      <div class='d-flex justify-content-between'>
        <strong>${escapeHtml(name)}</strong>
        <span class='text-warning'>${'★'.repeat(rating)}${'☆'.repeat(5-rating)}</span>
      </div>
      <small class='text-muted'>Just now</small>
      <p class='mt-2'>${escapeHtml(text)}</p>
    `;
    
    // Add to reviews section
    const reviewsContainer = document.querySelector('#reviews + .container .row');
    if (reviewsContainer) {
      const col = document.createElement('div');
      col.className = 'col-md-6';
      col.appendChild(reviewCard);
      reviewsContainer.insertBefore(col, reviewsContainer.firstChild);
    }
    
    // Save to localStorage
    saveReview({ name, email, rating, text });
    
    // Reset form
    reviewForm.reset();
    selectedRating = 0;
    updateStars(0);
    
    alert('Thank you for your review!');
  });
}

// LocalStorage functions
function saveReview(review) {
  let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  reviews.unshift({ ...review, date: new Date().toISOString() });
  reviews = reviews.slice(0, 10); // Keep only last 10 reviews
  localStorage.setItem('reviews', JSON.stringify(reviews));
}

function loadReviews() {
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
  const reviewsContainer = document.querySelector('#reviews + .container .row');
  if (reviewsContainer && reviews.length > 0) {
    reviews.slice(0, 3).forEach(review => {
      const reviewCard = document.createElement('div');
      reviewCard.className = 'review-card mb-3';
      reviewCard.innerHTML = `
        <div class='d-flex justify-content-between'>
          <strong>${escapeHtml(review.name)}</strong>
          <span class='text-warning'>${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}</span>
        </div>
        <small class='text-muted'>${getTimeAgo(review.date)}</small>
        <p class='mt-2'>${escapeHtml(review.text)}</p>
      `;
      const col = document.createElement('div');
      col.className = 'col-md-6';
      col.appendChild(reviewCard);
      reviewsContainer.appendChild(col);
    });
  }
}

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
  return date.toLocaleDateString();
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && document.querySelector(href)) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Load saved reviews on page load
document.addEventListener('DOMContentLoaded', loadReviews);

