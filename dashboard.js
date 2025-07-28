// Dashboard Page Functionality

let currentTab = "listings"
let userListings = []
let userPurchases = []
let notifications = []

// Helper functions
function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key))
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function showToast(message) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    document.body.removeChild(toast)
  }, 3000)
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  loadUserData()
  setupSidebar()
  setupNotifications()
  showTab("listings")
})

// Load user data
function loadUserData() {
  // Load listings
  userListings = getFromLocalStorage("petListings") || []

  // Load purchase history
  userPurchases = getFromLocalStorage("orderHistory") || []

  // Load notifications
  notifications = getFromLocalStorage("notifications") || [
    {
      id: 1,
      message: "Your listing for Buddy got a new view!",
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      message: "Order #PAWPAL9876 has been shipped.",
      read: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      message: "Welcome to your dashboard!",
      read: true,
      timestamp: new Date().toISOString(),
    },
  ]

  updateNotificationBadge()
}

// Setup sidebar navigation
function setupSidebar() {
  const sidebarLinks = document.querySelectorAll(".sidebar-link[data-tab]")

  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tab = this.getAttribute("data-tab")
      showTab(tab)

      // Update active state
      sidebarLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })
}

// Show tab content
function showTab(tabName) {
  currentTab = tabName

  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => tab.classList.remove("active"))

  // Show selected tab
  const selectedTab = document.getElementById(`${tabName}-tab`)
  if (selectedTab) {
    selectedTab.classList.add("active")
  }

  // Load tab content
  switch (tabName) {
    case "listings":
      loadListings()
      break
    case "purchases":
      loadPurchases()
      break
    case "settings":
      // Settings form is static
      break
  }
}

// Load listings
function loadListings() {
  const listingsGrid = document.getElementById("listings-grid")
  if (!listingsGrid) return

  if (userListings.length === 0) {
    listingsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-paw" style="font-size: 3rem; color: var(--fur-gray); margin-bottom: 1rem;"></i>
                <h3>No listings yet</h3>
                <p>Start by listing your first pet!</p>
                <a href="sell.html" class="btn btn-primary">List a Pet</a>
            </div>
        `
    return
  }

  listingsGrid.innerHTML = userListings.map((pet) => createListingCard(pet)).join("")
}

// Create listing card
function createListingCard(pet) {
  const ageText =
    pet.ageYears === 0 && pet.ageMonths === 0
      ? "Age not specified"
      : pet.ageYears === 0
        ? `${pet.ageMonths} months`
        : pet.ageMonths === 0
          ? `${pet.ageYears} year${pet.ageYears > 1 ? "s" : ""}`
          : `${pet.ageYears} year${pet.ageYears > 1 ? "s" : ""}, ${pet.ageMonths} months`

  return `
        <div class="dashboard-card">
            <img src="${pet.images[0] || "/placeholder.svg?height=200&width=300&text=Pet+Image"}" alt="${pet.name}">
            <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                    <h3>${pet.name}</h3>
                    <span class="badge badge-breed">${pet.type}</span>
                </div>
                <p><strong>Breed:</strong> ${pet.breed}</p>
                <p><strong>Age:</strong> ${ageText}</p>
                <div class="dashboard-card-footer">
                    <span class="pet-price">${formatCurrency(pet.price)}</span>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-sm" onclick="editListing(${pet.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm" style="background-color: var(--soft-pink-nose); color: var(--white);" onclick="deleteListing(${pet.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
}

// Load purchases
function loadPurchases() {
  const purchasesGrid = document.getElementById("purchases-grid")
  if (!purchasesGrid) return

  if (userPurchases.length === 0) {
    purchasesGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-bag" style="font-size: 3rem; color: var(--fur-gray); margin-bottom: 1rem;"></i>
                <h3>No purchases yet</h3>
                <p>Browse our pets to find your perfect companion!</p>
                <a href="explore.html" class="btn btn-primary">Explore Pets</a>
            </div>
        `
    return
  }

  purchasesGrid.innerHTML = userPurchases.map((order) => createPurchaseCard(order)).join("")
}

// Create purchase card
function createPurchaseCard(order) {
  return `
        <div class="dashboard-card">
            <img src="${order.pet.images[0] || "/placeholder.svg?height=200&width=300&text=Pet+Image"}" alt="${order.pet.name}">
            <div class="dashboard-card-content">
                <div class="dashboard-card-header">
                    <h3>${order.pet.name}</h3>
                    <span class="badge badge-available">${order.status}</span>
                </div>
                <p><strong>Order ID:</strong> ${order.orderId}</p>
                <p><strong>Date:</strong> ${formatDate(order.timestamp)}</p>
                <div class="dashboard-card-footer">
                    <span class="pet-price">${formatCurrency(order.pet.price)}</span>
                    <button class="btn btn-secondary btn-sm" onclick="viewOrderDetails('${order.orderId}')">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    `
}

// Edit listing
function editListing(petId) {
  // In a real app, this would navigate to an edit form
  alert("Edit functionality would be implemented here")
}

// Delete listing
function deleteListing(petId) {
  if (confirm("Are you sure you want to delete this listing?")) {
    userListings = userListings.filter((pet) => pet.id !== petId)
    saveToLocalStorage("petListings", userListings)
    loadListings()
    showToast("Listing deleted successfully")
  }
}

// View order details
function viewOrderDetails(orderId) {
  const order = userPurchases.find((o) => o.orderId === orderId)
  if (order) {
    alert(`Order Details:\nPet: ${order.pet.name}\nPrice: ${formatCurrency(order.pet.price)}\nStatus: ${order.status}`)
  }
}

// Setup notifications
function setupNotifications() {
  const notificationBell = document.querySelector(".notification-bell")
  const notificationsDropdown = document.getElementById("notifications-dropdown")

  if (notificationBell && notificationsDropdown) {
    notificationBell.addEventListener("click", (e) => {
      e.stopPropagation()
      toggleNotifications()
    })

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (!notificationsDropdown.contains(e.target)) {
        notificationsDropdown.classList.remove("active")
      }
    })
  }

  renderNotifications()
}

// Toggle notifications dropdown
function toggleNotifications() {
  const notificationsDropdown = document.getElementById("notifications-dropdown")
  if (notificationsDropdown) {
    notificationsDropdown.classList.toggle("active")
  }
}

// Render notifications
function renderNotifications() {
  const notificationsList = document.getElementById("notifications-list")
  if (!notificationsList) return

  if (notifications.length === 0) {
    notificationsList.innerHTML = `
            <div class="notification-item">
                <div class="notification-text">No new notifications</div>
            </div>
        `
    return
  }

  notificationsList.innerHTML = notifications
    .map(
      (notification) => `
        <div class="notification-item ${notification.read ? "" : "unread"}" onclick="markAsRead(${notification.id})">
            <div class="notification-dot ${notification.read ? "read" : ""}"></div>
            <div class="notification-text">${notification.message}</div>
        </div>
    `,
    )
    .join("")
}

// Update notification badge
function updateNotificationBadge() {
  const badge = document.getElementById("notification-badge")
  const unreadCount = notifications.filter((n) => !n.read).length

  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount
      badge.style.display = "flex"
    } else {
      badge.style.display = "none"
    }
  }
}

// Mark notification as read
function markAsRead(notificationId) {
  notifications = notifications.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
  saveToLocalStorage("notifications", notifications)
  renderNotifications()
  updateNotificationBadge()
}

// Mark all notifications as read
function markAllAsRead() {
  notifications = notifications.map((n) => ({ ...n, read: true }))
  saveToLocalStorage("notifications", notifications)
  renderNotifications()
  updateNotificationBadge()
}

// Profile form submission
document.addEventListener("DOMContentLoaded", () => {
  const profileForm = document.getElementById("profile-form")

  if (profileForm) {
    profileForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Simulate saving profile
      const submitButton = e.target.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent

      submitButton.disabled = true
      submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...'

      setTimeout(() => {
        submitButton.disabled = false
        submitButton.textContent = originalText
        showToast("Profile updated successfully!")
      }, 1000)
    })
  }
})

// Empty state styling
const style = document.createElement("style")
style.textContent = `
    .empty-state {
        grid-column: 1 / -1;
        text-align: center;
        padding: 3rem;
        color: var(--fur-gray);
    }
    
    .empty-state h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--dark-nose-black);
    }
    
    .empty-state p {
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
`
document.head.appendChild(style)
