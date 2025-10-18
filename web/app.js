// Configuration
const SUPABASE_URL = 'https://uwclseatqvcdjmgoyuae.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3Y2xzZWF0cXZjZGptZ295dWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTI4MDYsImV4cCI6MjA3NjMyODgwNn0.mb6FxWJgjvc2X-NQtBj5iOVtT5hBuxBFO80b0Fqhl3o';

let allItems = [];
let allDesks = {};

// Fetch items from Supabase
async function fetchItems() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/item?select=*,desk:desk_id(id,name),item_photo(path)`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const items = await response.json();
        return items;
    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}

// Fetch desks for filter
async function fetchDesks() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/desk?select=*`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const desks = await response.json();
        return desks;
    } catch (error) {
        console.error('Error fetching desks:', error);
        return [];
    }
}

// Get public URL for image
function getImageUrl(path) {
    if (!path) return 'no-image.jpg';
    return `${SUPABASE_URL}/storage/v1/object/public/${path}`;
}

// Format date
function formatDate(dateString) {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Create item card HTML
function createItemCard(item) {
    const imageUrl = item.item_photo && item.item_photo.length > 0 
        ? getImageUrl(item.item_photo[0].path)
        : 'no-image.jpg';
    
    const deskName = item.desk ? item.desk.name : 'Unknown Desk';
    
    return `
        <div class="item-card">
            <img src="${imageUrl}" alt="${item.title}" class="item-image" onerror="this.src='no-image.jpg'">
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description || 'No description available'}</p>
                
                <div class="item-meta">
                    ${item.category ? `<span class="item-badge badge-category">${item.category}</span>` : ''}
                    ${item.found_location_text ? `<span class="item-badge badge-location">📍 ${item.found_location_text}</span>` : ''}
                    ${item.found_date ? `<span class="item-badge badge-date">📅 ${formatDate(item.found_date)}</span>` : ''}
                </div>
                
                <div class="item-desk">
                    <strong>Pickup at:</strong> ${deskName}
                </div>
            </div>
        </div>
    `;
}

// Render items
function renderItems(items) {
    const grid = document.getElementById('itemsGrid');
    
    if (items.length === 0) {
        grid.innerHTML = `
            <div class="no-items">
                <h2>No items found</h2>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = items.map(item => createItemCard(item)).join('');
}

// Filter items
function filterItems() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const deskFilter = document.getElementById('deskFilter').value;
    
    let filtered = allItems;
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            (item.description && item.description.toLowerCase().includes(searchTerm)) ||
            (item.found_location_text && item.found_location_text.toLowerCase().includes(searchTerm))
        );
    }
    
    // Category filter
    if (categoryFilter) {
        filtered = filtered.filter(item => item.category === categoryFilter);
    }
    
    // Desk filter
    if (deskFilter) {
        filtered = filtered.filter(item => item.desk_id === deskFilter);
    }
    
    renderItems(filtered);
}

// Populate desk filter
function populateDeskFilter(desks) {
    const deskFilter = document.getElementById('deskFilter');
    desks.forEach(desk => {
        const option = document.createElement('option');
        option.value = desk.id;
        option.textContent = desk.name;
        deskFilter.appendChild(option);
        allDesks[desk.id] = desk;
    });
}

// Initialize app
async function init() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    
    try {
        // Fetch data
        const [items, desks] = await Promise.all([fetchItems(), fetchDesks()]);
        
        allItems = items;
        populateDeskFilter(desks);
        
        // Hide loading
        loading.style.display = 'none';
        
        // Render items
        renderItems(allItems);
        
        // Setup event listeners
        document.getElementById('searchInput').addEventListener('input', filterItems);
        document.getElementById('categoryFilter').addEventListener('change', filterItems);
        document.getElementById('deskFilter').addEventListener('change', filterItems);
        
    } catch (err) {
        loading.style.display = 'none';
        error.style.display = 'block';
        error.textContent = `Error loading items: ${err.message}`;
    }
}

// Start the app
init();
