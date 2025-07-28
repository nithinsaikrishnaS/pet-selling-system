// Pet Detail Page Functionality

// Sample pet data (same as explore.js)
const samplePets = [
  {
    id: 1,
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    age: 2.5,
    price: 850,
    images: [
      "/placeholder.svg?height=400&width=600&text=Golden+Retriever+1",
      "/placeholder.svg?height=400&width=600&text=Golden+Retriever+2",
      "/placeholder.svg?height=400&width=600&text=Golden+Retriever+3",
    ],
    location: "New York, NY",
    vaccinated: true,
    gender: "Male",
    weight: "25 kg",
    temperament: "Friendly, Playful, Loyal",
    description:
      "Buddy is a loving and energetic Golden Retriever looking for his forever home. He loves to play fetch, go for long walks, and cuddle up on the couch. He is great with kids and other pets.",
    seller: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=60&width=60&text=JD",
      location: "New York, NY",
      contact: "123-456-7890",
    },
  },
  {
    id: 2,
    name: "Whiskers",
    type: "cat",
    breed: "Siamese",
    age: 1.3,
    price: 400,
    images: [
      "/placeholder.svg?height=400&width=600&text=Siamese+Cat+1",
      "/placeholder.svg?height=400&width=600&text=Siamese+Cat+2",
    ],
    location: "Los Angeles, CA",
    vaccinated: true,
    gender: "Female",
    weight: "4 kg",
    temperament: "Elegant, Vocal, Affectionate",
    description:
      "Whiskers is an elegant Siamese cat with beautiful blue eyes. She's very vocal and loves to communicate with her humans. Perfect for someone looking for an interactive companion.",
    seller: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=60&width=60&text=JS",
      location: "Los Angeles, CA",
      contact: "987-654-3210",
    },
  },
]

let currentPet = null
let currentImageIndex = 0

// Declare functions before using them
function getFromLocalStorage(key) {
  return localStorage.getItem(key)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  loadPetDetails()
  setupImageCarousel()
})

// Load pet details
function loadPetDetails() {
  const petId = getFromLocalStorage("selectedPetId") || 1
  currentPet = samplePets.find((pet) => pet.id === petId) || samplePets[0]

  if (currentPet) {
    populatePetDetails(currentPet)
    setupImageCarousel()
  }
}

// Populate pet details
function populatePetDetails(pet) {
  // Basic info
  updateElement("pet-name", pet.name)
  updateElement("pet-breed", pet.breed)
  updateElement("pet-gender", pet.gender)
  updateElement("pet-vaccination", pet.vaccinated ? "Vaccinated" : "Not Vaccinated")
  updateElement("pet-description", pet.description)

  // Age formatting
  const ageText =
    pet.age < 1
      ? `${Math.round(pet.age * 12)} months`
      : pet.age === 1
        ? "1 year"
        : `${Math.floor(pet.age)} years${pet.age % 1 !== 0 ? `, ${Math.round((pet.age % 1) * 12)} months` : ""}`
  updateElement("pet-age", ageText)

  updateElement("pet-weight", pet.weight)
  updateElement("pet-temperament", pet.temperament)
  updateElement("pet-price", formatCurrency(pet.price))
  updateElement("pet-availability", "Available")

  // Seller info
  updateElement("seller-name", pet.seller.name)
  updateElement("seller-location", pet.seller.location)
  updateElement("seller-contact", pet.seller.contact)

  const sellerAvatar = document.getElementById("seller-avatar")
  if (sellerAvatar) {
    sellerAvatar.src = pet.seller.avatar
    sellerAvatar.alt = `${pet.seller.name}'s avatar`
  }
}

// Update element content
function updateElement(id, content) {
  const element = document.getElementById(id)
  if (element) {
    element.textContent = content
  }
}

// Setup image carousel
function setupImageCarousel() {
  if (!currentPet || !currentPet.images) return

  const carouselContainer = document.getElementById("carousel-container")
  const carouselDots = document.getElementById("carousel-dots")

  if (!carouselContainer || !carouselDots) return

  // Create images
  carouselContainer.innerHTML = currentPet.images
    .map(
      (image, index) => `
        <img src="${image}" alt="${currentPet.name} - Image ${index + 1}" 
             style="display: ${index === 0 ? "block" : "none"}">
    `,
    )
    .join("")

  // Create dots
  carouselDots.innerHTML = currentPet.images
    .map(
      (_, index) => `
        <div class="carousel-dot ${index === 0 ? "active" : ""}" 
             onclick="showImage(${index})"></div>
    `,
    )
    .join("")

  // Auto-advance carousel
  if (currentPet.images.length > 1) {
    setInterval(() => {
      currentImageIndex = (currentImageIndex + 1) % currentPet.images.length
      showImage(currentImageIndex)
    }, 5000)
  }
}

// Show specific image
function showImage(index) {
  if (!currentPet || !currentPet.images) return

  currentImageIndex = index

  const images = document.querySelectorAll("#carousel-container img")
  const dots = document.querySelectorAll(".carousel-dot")

  images.forEach((img, i) => {
    img.style.display = i === index ? "block" : "none"
  })

  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index)
  })
}

// Buy pet function
function buyPet() {
  if (!currentPet) return

  // Store pet info for order page
  saveToLocalStorage("orderPet", currentPet)
  window.location.href = "order.html"
}

// Touch/swipe support for mobile
let startX = 0
let endX = 0

document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.getElementById("carousel-container")

  if (carouselContainer) {
    carouselContainer.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX
    })

    carouselContainer.addEventListener("touchend", (e) => {
      endX = e.changedTouches[0].clientX
      handleSwipe()
    })
  }
})

function handleSwipe() {
  if (!currentPet || !currentPet.images) return

  const threshold = 50
  const diff = startX - endX

  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe left - next image
      currentImageIndex = (currentImageIndex + 1) % currentPet.images.length
    } else {
      // Swipe right - previous image
      currentImageIndex = currentImageIndex === 0 ? currentPet.images.length - 1 : currentImageIndex - 1
    }
    showImage(currentImageIndex)
  }
}
