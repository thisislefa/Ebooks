/* --- DATA STORE --- */
        // NOTE: Create a folder named 'library_files' in your root directory.
        // Place your PDF files there and update the 'pdfUrl' below to match your filenames.
        const booksDB = [
            { id: 1, title: "The Art of Innovation", author: "Tom Kelly", category: "Business", image: "thumbnails/Screenshot 2025-10-20 131322.png", pdfUrl: "library_files/art_of_innovation.pdf" },
            { id: 2, title: "Design for How People Think", author: "John Whalen", category: "Design", image: "thumbnails/Screenshot 2025-10-20 133026.png", pdfUrl: "library_files/design_think.pdf" },
            { id: 3, title: "Zero to One", author: "Peter Thiel", category: "Startups", image: "thumbnails/Screenshot 2025-10-20 133112.png", pdfUrl: "library_files/zero_to_one.pdf" },
            { id: 4, title: "Deep Work", author: "Cal Newport", category: "Productivity", image: "thumbnails/Screenshot 2025-10-20 133146.png", pdfUrl: "library_files/deep_work.pdf" },
            { id: 5, title: "Atomic Habits", author: "James Clear", category: "Self Help", image: "thumbnails/Screenshot 2025-10-20 133215.png", pdfUrl: "library_files/atomic_habits.pdf" },
            { id: 6, title: "Clean Code", author: "Robert Martin", category: "Technology", image: "thumbnails/Screenshot 2025-10-22 134428.png", pdfUrl: "library_files/clean_code.pdf" },
            { id: 7, title: "The Psychology of Money", author: "Morgan Housel", category: "Finance", image: "thumbnails/Screenshot 2025-10-23 102705.png", pdfUrl: "library_files/psych_money.pdf" },
            { id: 8, title: "Sapiens", author: "Yuval Noah Harari", category: "History", image: "thumbnails/Screenshot 2025-10-20 131322.png", pdfUrl: "library_files/sapiens.pdf" },
            { id: 9, title: "Educated", author: "Tara Westover", category: "Biography", image: "thumbnails/Screenshot 2025-10-20 133026.png", pdfUrl: "library_files/educated.pdf" },
            { id: 10, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", category: "Psychology", image: "thumbnails/Screenshot 2025-10-20 133112.png", pdfUrl: "library_files/fast_slow.pdf" },
            { id: 11, title: "Artificial Intelligence: A Guide", author: "Melanie Mitchell", category: "AI", image: "thumbnails/Screenshot 2025-10-22 134428.png", pdfUrl: "library_files/ai_guide.pdf" },
            { id: 12, title: "Project Hail Mary", author: "Andy Weir", category: "Sci-Fi", image: "thumbnails/Screenshot 2025-10-20 133146.png", pdfUrl: "library_files/hail_mary.pdf" }
        ];

        /* --- STATE MANAGEMENT --- */
        let state = {
            searchQuery: "",
            filterCategory: null,
            savedIds: JSON.parse(localStorage.getItem('lumina_saved_books')) || [],
            currentPage: 1,
            itemsPerPage: 6 // Change this to 8 or 12 as you grow the library
        };

        const placeholderImg = "https://via.placeholder.com/300x450/f0f4f9/999999?text=Book+Cover";

        /* --- INITIALIZATION --- */
        document.addEventListener("DOMContentLoaded", () => {
            // 1. Simulate fast load, then hide spinner
            setTimeout(() => {
                document.getElementById('preloader').style.opacity = '0';
                setTimeout(() => document.getElementById('preloader').style.display = 'none', 500);
            }, 800);

            // 2. Initial Render
            renderGrid();
        });

        /* --- RENDERING ENGINE --- */
        function renderGrid() {
            const grid = document.getElementById('galleryGrid');
            const title = document.getElementById('galleryTitle');
            const resultCount = document.getElementById('resultCount');
            const paginationContainer = document.getElementById('paginationControls');
            
            grid.innerHTML = "";
            paginationContainer.innerHTML = "";

            // 1. Filter Logic
            let filtered = booksDB.filter(book => {
                const matchesSearch = book.title.toLowerCase().includes(state.searchQuery) || 
                                      book.author.toLowerCase().includes(state.searchQuery);
                const matchesCat = state.filterCategory ? book.category === state.filterCategory : true;
                return matchesSearch && matchesCat;
            });

            // 2. Pagination Math
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / state.itemsPerPage);
            
            // Adjust current page if it exceeds total pages
            if (state.currentPage > totalPages && totalPages > 0) state.currentPage = totalPages;
            if (totalPages === 0) state.currentPage = 1;

            const startIndex = (state.currentPage - 1) * state.itemsPerPage;
            const endIndex = startIndex + state.itemsPerPage;
            const paginatedItems = filtered.slice(startIndex, endIndex);

            // 3. Update Header
            resultCount.textContent = `${totalItems} books found`;
            title.textContent = state.filterCategory ? `${state.filterCategory} Collection` : 
                               (state.searchQuery ? "Search Results" : "Trending Now");

            // 4. Render Empty State
            if (totalItems === 0) {
                grid.innerHTML = `
                    <div style="grid-column: 1/-1; text-align: center; padding: 60px;">
                        <span class="material-icons-outlined" style="font-size: 48px; color: #ccc;">menu_book</span>
                        <p style="margin-top: 10px; color: #666;">No books found. Try a different search.</p>
                        <button onclick="resetView()" class="nav-btn" style="margin-top:10px; border:1px solid #ddd;">Clear Filters</button>
                    </div>`;
                return;
            }

            // 5. Render Cards
            paginatedItems.forEach(book => {
                const isSaved = state.savedIds.includes(book.id);
                const card = document.createElement('article');
                card.className = 'book-card';
                card.innerHTML = `
                    <div class="card-img-wrap">
                        <img src="${book.image}" alt="${book.title}" onerror="this.src='${placeholderImg}'">
                    </div>
                    <div class="card-body">
                        <h3 class="card-title">${book.title}</h3>
                        <p class="card-author">${book.author}</p>
                        <div class="card-footer">
                            <span class="chip">${book.category}</span>
                            <div style="display: flex; gap: 4px;">
                                <button class="action-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${book.id})" title="${isSaved ? 'Remove' : 'Save'}">
                                    <span class="material-icons${isSaved ? '' : '-outlined'}">${isSaved ? 'bookmark' : 'bookmark_border'}</span>
                                </button>
                                <a href="${book.pdfUrl}" download="${book.title}.pdf" class="action-btn" title="Download PDF">
                                    <span class="material-icons-outlined">download</span>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });

            // 6. Render Pagination Controls
            if (totalPages > 1) {
                renderPagination(paginationContainer, totalPages);
            }
        }

        function renderPagination(container, totalPages) {
            // Previous Button
            const prevBtn = document.createElement('button');
            prevBtn.className = 'page-btn';
            prevBtn.innerHTML = '<span class="material-icons">chevron_left</span>';
            prevBtn.disabled = state.currentPage === 1;
            prevBtn.onclick = () => changePage(state.currentPage - 1);
            container.appendChild(prevBtn);

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const btn = document.createElement('button');
                btn.className = `page-btn ${state.currentPage === i ? 'active' : ''}`;
                btn.innerText = i;
                btn.onclick = () => changePage(i);
                container.appendChild(btn);
            }

            // Next Button
            const nextBtn = document.createElement('button');
            nextBtn.className = 'page-btn';
            nextBtn.innerHTML = '<span class="material-icons">chevron_right</span>';
            nextBtn.disabled = state.currentPage === totalPages;
            nextBtn.onclick = () => changePage(state.currentPage + 1);
            container.appendChild(nextBtn);
        }

        function changePage(pageNum) {
            state.currentPage = pageNum;
            renderGrid();
            // Scroll to top of grid
            document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
        }

        /* --- FEATURES: SAVING & SEARCH --- */
        
        // Search Listener
        document.getElementById('searchInput').addEventListener('input', (e) => {
            state.searchQuery = e.target.value.toLowerCase();
            state.filterCategory = null; 
            state.currentPage = 1; // Reset to page 1 on search
            renderGrid();
        });

        // Toggle Save (Real-time LocalStorage)
        function toggleSave(id) {
            const index = state.savedIds.indexOf(id);
            if (index === -1) {
                state.savedIds.push(id);
                showToast("Added to My Library");
            } else {
                state.savedIds.splice(index, 1);
                showToast("Removed from Library");
            }
            // PERSIST DATA
            localStorage.setItem('lumina_saved_books', JSON.stringify(state.savedIds));
            
            // Re-render
            renderGrid();
            
            // If drawer is open, refresh it
            if(document.getElementById('sideDrawer').classList.contains('open') && 
               document.getElementById('drawerTitle').innerText === "My Library") {
                renderLibraryContent();
            }
        }

        /* --- DRAWER LOGIC --- */
        
        function toggleDrawer(type) {
            const drawer = document.getElementById('sideDrawer');
            const overlay = document.getElementById('drawerOverlay');
            const title = document.getElementById('drawerTitle');

            if (type === 'library') {
                title.innerText = "My Library";
                renderLibraryContent();
            } else {
                title.innerText = "Collections";
                renderCollectionsContent();
            }

            drawer.classList.add('open');
            overlay.classList.add('open');
        }

        function closeDrawer() {
            document.getElementById('sideDrawer').classList.remove('open');
            document.getElementById('drawerOverlay').classList.remove('open');
        }

        function renderLibraryContent() {
            const content = document.getElementById('drawerContent');
            const savedBooks = booksDB.filter(book => state.savedIds.includes(book.id));

            if (savedBooks.length === 0) {
                content.innerHTML = `
                    <div style="text-align: center; margin-top: 40px; color: #666;">
                        <span class="material-icons-outlined" style="font-size: 40px; color: #ddd;">bookmark_border</span>
                        <p style="margin-top: 10px;">Your library is empty.<br>Tap the bookmark icon to save books.</p>
                    </div>`;
                return;
            }

            let html = `<p style="font-size: 14px; color: #666; margin-bottom: 20px;">${savedBooks.length} items saved locally</p>`;
            savedBooks.forEach(book => {
                html += `
                    <div class="saved-item">
                        <img src="${book.image}" onerror="this.src='${placeholderImg}'">
                        <div class="saved-info">
                            <h4>${book.title}</h4>
                            <span class="remove-btn" onclick="toggleSave(${book.id})">Remove</span>
                        </div>
                    </div>`;
            });
            content.innerHTML = html;
        }

        function renderCollectionsContent() {
            const content = document.getElementById('drawerContent');
            const categories = ["Business", "Technology", "Design", "Self Help", "History", "Finance", "Sci-Fi", "Startups", "AI", "Productivity"];
            
            let html = `<p style="font-size: 14px; color: #666; margin-bottom: 20px;">Filter by category</p>
                        <div style="display: flex; flex-wrap: wrap;">`;
            
            categories.forEach(cat => {
                html += `<span class="collection-tag" onclick="filterByCategory('${cat}')">${cat}</span>`;
            });
            
            html += `</div>
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee;">
                <p style="font-size: 14px; font-weight: 500; margin-bottom: 12px;">More Options</p>
                <button class="nav-btn" style="padding-left:0; color: #0b57d0;" onclick="resetView()">Show All Books</button>
            </div>`;
            
            content.innerHTML = html;
        }

        function filterByCategory(cat) {
            state.filterCategory = cat;
            state.searchQuery = ""; // Clear search
            state.currentPage = 1; // Reset page
            document.getElementById('searchInput').value = "";
            renderGrid();
            closeDrawer();
        }

        function resetView() {
            state.filterCategory = null;
            state.searchQuery = "";
            state.currentPage = 1;
            document.getElementById('searchInput').value = "";
            renderGrid();
            closeDrawer();
        }

        /* --- TOAST NOTIFICATION --- */
        let toastTimeout;
        function showToast(msg) {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').innerText = msg;
            toast.classList.add('show');
            
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
