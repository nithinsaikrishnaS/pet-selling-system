// Order Page Functionality

let orderPet = null

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

function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const inputs = form.querySelectorAll("input, textarea")
  for (const input of inputs) {
    if (input.required && input.value.trim() === "") {
      return false
    }
  }
  return true
}

function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadOrderPet()
  setupOrderForm()
})

// Load pet information for order
function loadOrderPet() {
  orderPet = getFromLocalStorage("orderPet")

  if (!orderPet) {
    // Fallback to sample data
    orderPet = {
      id: 1,
      name: "Buddy",
      breed: "Golden Retriever",
      age: 2.5,
      price: 850,
      images: ["/placeholder.svg?height=200&width=200&text=Golden+Retriever"],
    }
  }

  populateOrderSummary(orderPet)
}

// Populate order summary
function populateOrderSummary(pet) {
  updateElement("order-pet-name", pet.name)
  updateElement("order-pet-price", formatCurrency(pet.price))
  updateElement("total-amount", formatCurrency(pet.price))

  const ageText =
    pet.age < 1
      ? `${Math.round(pet.age * 12)} months`
      : pet.age === 1
        ? "1 year"
        : `${Math.floor(pet.age)} years${pet.age % 1 !== 0 ? `, ${Math.round((pet.age % 1) * 12)} months` : ""}`

  updateElement("order-pet-breed", `${pet.breed} | ${ageText}`)

  const petImage = document.getElementById("order-pet-image")
  if (petImage && pet.images && pet.images.length > 0) {
    petImage.src = pet.images[0]
    petImage.alt = pet.name
  }
}

// Setup order form
function setupOrderForm() {
  const orderForm = document.getElementById("order-form")

  if (orderForm) {
    orderForm.addEventListener("submit", handleOrderSubmit)
  }
}

// Handle order form submission
function handleOrderSubmit(e) {
  e.preventDefault()

  if (!validateForm("order-form")) {
    return
  }

  // Get form data
  const formData = new FormData(e.target)
  const orderData = {
    pet: orderPet,
    buyer: {
      name: formData.get("buyer-name"),
      email: formData.get("buyer-email"),
      phone: formData.get("buyer-phone"),
      address: formData.get("buyer-address"),
    },
    orderId: generateOrderId(),
    timestamp: new Date().toISOString(),
    status: "confirmed",
  }

  // Simulate payment processing
  const submitButton = e.target.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Payment...'

  setTimeout(() => {
    // Save order to localStorage
    saveOrderToHistory(orderData)

    // Reset button
    submitButton.disabled = false
    submitButton.textContent = originalText

    // Show success modal
    showModal("success-modal")

    // Clear stored pet data
    localStorage.removeItem("orderPet")
  }, 2000)
}

// Generate order ID
function generateOrderId() {
  return "#PAWPAL" + Math.random().toString(36).substr(2, 5).toUpperCase()
}

// Save order to history
function saveOrderToHistory(orderData) {
  const orderHistory = getFromLocalStorage("orderHistory") || []
  orderHistory.push(orderData)
  saveToLocalStorage("orderHistory", orderHistory)
}

// Update element helper
function updateElement(id, content) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = content
  }
}
