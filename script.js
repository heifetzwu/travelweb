document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('itinerary-timeline');
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modal-body');
    const closeModal = document.querySelector('.close-modal');

    // Fetch the itinerary data
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            renderTimeline(data);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            timeline.innerHTML = '<div class="error">無法載入行程資料，請稍後再試。</div>';
        });

    function renderTimeline(days) {
        timeline.innerHTML = ''; // Clear loading

        days.forEach((day, index) => {
            const dayBlock = document.createElement('div');
            dayBlock.className = 'day-block fade-in';
            dayBlock.style.animationDelay = `${index * 0.1}s`;

            const dayHeader = `
                <div class="day-header">
                    <span class="day-date">${day.date}</span>
                    <h2 class="day-title">${day.title}</h2>
                </div>
            `;

            const itemsHtml = day.items.map(item => `
                <div class="item-card" data-details='${JSON.stringify(item)}'>
                    <div class="item-icon">${item.icon || '📍'}</div>
                    <div class="item-info">
                        <div class="item-time">${item.time}</div>
                        <div class="item-name">${item.name}</div>
                        <span class="tag tag-${item.tag}">${item.tag}</span>
                    </div>
                </div>
            `).join('');

            let imagesHtml = '';
            if (day.images && day.images.length > 0) {
                imagesHtml = `
                    <div class="gallery-title">Journey Photos</div>
                    <div class="image-gallery">
                        ${day.images.map(img => `
                            <div class="image-item" data-img='${JSON.stringify(img)}'>
                                <img src="${img.url}" alt="Travel Photo" loading="lazy">
                                <div class="image-info-overlay">${img.timestamp}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            dayBlock.innerHTML = dayHeader + itemsHtml + imagesHtml;
            timeline.appendChild(dayBlock);
        });

        // Add click events to cards
        document.querySelectorAll('.item-card').forEach(card => {
            card.addEventListener('click', () => {
                const details = JSON.parse(card.getAttribute('data-details'));
                showModal(details);
            });
        });

        // Add click events to gallery images
        document.querySelectorAll('.image-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click if nested (though not nested here)
                const imgDetails = JSON.parse(item.getAttribute('data-img'));
                showImageModal(imgDetails);
            });
        });
    }

    function showModal(item) {
        let content = `
            <div class="item-icon" style="font-size: 3rem; margin-bottom: 1rem;">${item.icon || '📍'}</div>
            <h2 style="margin-bottom: 1rem; color: var(--text);">${item.name}</h2>
            <div style="margin-bottom: 1rem;">
                <span class="tag tag-${item.tag}">${item.tag}</span>
                <span style="color: var(--secondary); margin-left: 10px; font-family: 'Outfit';">${item.time}</span>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
                這是您在 ${item.time} 的預定行程。
            </p>
        `;

        if (item.url) {
            content += `<a href="${item.url}" target="_blank" class="link-btn">訪問相關網站</a>`;
        }
        
        if (item.ticket) {
            content += `<a href="${item.ticket}" target="_blank" class="link-btn" style="background: #3a506b; margin-left: 10px;">查看票券資訊</a>`;
        }

        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function showImageModal(img) {
        let content = `
            <img src="${img.url}" class="modal-image-full" alt="Travel Photo">
            <div style="text-align: center;">
                <p style="color: var(--secondary); font-family: 'Outfit'; margin-bottom: 0.5rem;">拍攝時間：${img.timestamp}</p>
                <p style="color: var(--text-muted); font-size: 0.9rem;">${img.url.split('/').pop()}</p>
            </div>
        `;

        modalBody.innerHTML = content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    // Modal close logic
    closeModal.onclick = () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    window.onclick = (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});
