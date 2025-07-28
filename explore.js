// Explore Pets Page Functionality

// Sample pet data with more variety
const samplePets = [
  {
    id: 1,
    name: "Buddy",
    type: "dog",
    breed: "Golden Retriever",
    age: 2.5,
    price: 850,
    image: "/placeholder.svg?height=200&width=300&text=Golden+Retriever",
    location: "New York, NY",
    vaccinated: true,
    gender: "Male",
    description: "Friendly and energetic Golden Retriever",
  },
  {
    id: 2,
    name: "Whiskers",
    type: "cat",
    breed: "Siamese",
    age: 1.3,
    price: 400,
    image: "/placeholder.svg?height=200&width=300&text=Siamese+Cat",
    location: "Los Angeles, CA",
    vaccinated: true,
    gender: "Female",
    description: "Elegant Siamese cat with beautiful blue eyes",
  },
  {
    id: 3,
    name: "Charlie",
    type: "dog",
    breed: "Beagle",
    age: 0.5,
    price: 650,
    image: "/placeholder.svg?height=200&width=300&text=Beagle+Puppy",
    location: "Chicago, IL",
    vaccinated: true,
    gender: "Male",
    description: "Playful Beagle puppy, great with kids",
  },
  {
    id: 4,
    name: "Mittens",
    type: "cat",
    breed: "Maine Coon",
    age: 2,
    price: 550,
    image: "/placeholder.svg?height=200&width=300&text=Maine+Coon",
    location: "Houston, TX",
    vaccinated: true,
    gender: "Female",
    description: "Gentle giant Maine Coon, very affectionate",
  },
  {
    id: 5,
    name: "Polly",
    type: "bird",
    breed: "Parrot",
    age: 3,
    price: 600,
    image: "/placeholder.svg?height=200&width=300&text=Colorful+Parrot",
    location: "Miami, FL",
    vaccinated: false,
    gender: "Female",
    description: "Colorful parrot, can mimic sounds and words",
  },
  {
    id: 6,
    name: "Bunny",
    type: "rabbit",
    breed: "Holland Lop",
    age: 0.5,
    price: 150,
    image: "/placeholder.svg?height=200&width=300&text=Holland+Lop",
    location: "Seattle, WA",
    vaccinated: true,
    gender: "Female",
    description: "Adorable Holland Lop rabbit, very gentle",
  },
  {
    id: 7,
    name: "Finny",
    type: "fish",
    breed: "Betta",
    age: 0.7,
    price: 25,
    image: "/placeholder.svg?height=200&width=300&text=Betta+Fish",
    location: "Denver, CO",
    vaccinated: false,
    gender: "Male",
    description: "Vibrant Betta fish, perfect for small aquarium",
  },
  {
    id: 8,
    name: "Shadow",
    type: "dog",
    breed: "German Shepherd",
    age: 4,
    price: 950,
    image: "/placeholder.svg?height=200&width=300&text=German+Shepherd",
    location: "Phoenix, AZ",
    vaccinated: true,
    gender: "Male",
    description: "Loyal German Shepherd, excellent guard dog",
  },
  {
    id: 9,
    name: "Luna",
    type: "cat",
    breed: "Persian",
    age: 3,
    price: 750,
    image: "/placeholder.svg?height=200&width=300&text=Persian+Cat",
    location: "Boston, MA",
    vaccinated: true,
    gender: "Female",
    description: "Beautiful Persian cat with long silky fur",
  },
  {
    id: 10,
    name: "Max",
    type: "dog",
    breed: "Labrador",
    age: 1.5,
    price: 700,
    image: "/placeholder.svg?height=200&width=300&text=Labrador",
    location: "Dallas, TX",
    vaccinated: true,
    gender: "Male",
    description: "Energetic Labrador, loves to play fetch",
  },
]

let filteredPets = [...samplePets]
let isLoading = false

// Declare debounce function
function debounce(func, wait) {
  let timeout
  return function (...args) {
    
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

// Declare formatCurrency function
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Declare saveToLocalStorage function
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, value)
}

// DOM Elements
const petsGrid = document.getElementById("pets-grid")
const searchInput = document.getElementById("search")
const petTypeSelect = document.getElementById("pet-type")
const ageRangeSelect = document.getElementById("age-range")
const priceRangeSelect = document.getElementById("price-range")
const sortBySelect = document.getElementById("sort-by")

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  showLoadingSkeletons()
  setTimeout(() => {
    hideLoadingSkeletons()
    renderPets(filteredPets)
  }, 1000)

  setupEventListeners()
})

// Event Listeners
function setupEventListeners() {
  if (searchInput) {
    searchInput.addEventListener("input", debounce(handleSearch, 300))
  }

  if (petTypeSelect) {
    petTypeSelect.addEventListener("change", handleFilters)
  }

  if (ageRangeSelect) {
    ageRangeSelect.addEventListener("change", handleFilters)
  }

  if (priceRangeSelect) {
    priceRangeSelect.addEventListener("change", handleFilters)
  }

  if (sortBySelect) {
    sortBySelect.addEventListener("change", handleSort)
  }
}

// Search functionality
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase().trim()

  filteredPets = samplePets.filter((pet) => {
    return (
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.breed.toLowerCase().includes(searchTerm) ||
      pet.type.toLowerCase().includes(searchTerm) ||
      pet.location.toLowerCase().includes(searchTerm)
    )
  })

  applyFiltersAndSort()
}

// Filter functionality
function handleFilters() {
  filteredPets = samplePets.filter((pet) => {
    // Search filter
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : ""
    const matchesSearch =
      !searchTerm ||
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.breed.toLowerCase().includes(searchTerm) ||
      pet.type.toLowerCase().includes(searchTerm) ||
      pet.location.toLowerCase().includes(searchTerm)

    // Type filter
    const selectedType = petTypeSelect ? petTypeSelect.value : ""
    const matchesType = !selectedType || pet.type === selectedType

    // Age filter
    const selectedAgeRange = ageRangeSelect ? ageRangeSelect.value : ""
    const matchesAge = !selectedAgeRange || checkAgeRange(pet.age, selectedAgeRange)

    // Price filter
    const selectedPriceRange = priceRangeSelect ? priceRangeSelect.value : ""
    const matchesPrice = !selectedPriceRange || checkPriceRange(pet.price, selectedPriceRange)

    return matchesSearch && matchesType && matchesAge && matchesPrice
  })

  applyFiltersAndSort()
}

// Age range checker
function checkAgeRange(age, range) {
  switch (range) {
    case "0-1":
      return age <= 1
    case "1-3":
      return age > 1 && age <= 3
    case "3-5":
      return age > 3 && age <= 5
    case "5+":
      return age > 5
    default:
      return true
  }
}

// Price range checker
function checkPriceRange(price, range) {
  switch (range) {
    case "0-100":
      return price <= 100
    case "100-500":
      return price > 100 && price <= 500
    case "500-1000":
      return price > 500 && price <= 1000
    case "1000+":
      return price > 1000
    default:
      return true
  }
}

// Sort functionality
function handleSort() {
  const sortBy = sortBySelect ? sortBySelect.value : "recent"

  filteredPets.sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "popular":
        // Simulate popularity based on lower price and younger age
        const popularityA = 1000 - a.price + (10 - a.age)
        const popularityB = 1000 - b.price + (10 - b.age)
        return popularityB - popularityA
      case "recent":
      default:
        return b.id - a.id // Newer pets first
    }
  })

  renderPets(filteredPets)
}

// Apply filters and sort
function applyFiltersAndSort() {
  showLoadingSkeletons()
  setTimeout(() => {
    hideLoadingSkeletons()
    handleSort()
  }, 500)
}

// Render pets
function renderPets(pets) {
  if (!petsGrid) return

  if (pets.length === 0) {
    petsGrid.innerHTML = `
      <div class="no-results">
        <img src="/placeholder.svg?height=200&width=200&text=No+Pets+Found" alt="No pets found">
        <h2>No pets match your search!</h2>
        <p>Try adjusting your filters or search terms.</p>
        <a href="#" onclick="clearAllFilters()" class="btn btn-primary">Clear Filters</a>
      </div>
    `
    return
  }

  petsGrid.innerHTML = pets.map((pet) => createPetCard(pet)).join("")
}

// Create pet card HTML
function createPetCard(pet) {
  const ageText =
    pet.age < 1 ? `${Math.round(pet.age * 12)} months` : pet.age === 1 ? "1 year" : `${Math.floor(pet.age)} years`

  return `
    <div class="pet-card" onclick="viewPetDetails(${pet.id})">
      <img src="${pet.image}" alt="${pet.name}" loading="lazy">
      <div class="pet-card-content">
        <div class="pet-card-header">
          <h3>${pet.name}</h3>
          <span class="badge badge-breed">${pet.type}</span>
        </div>
        <p><strong>Breed:</strong> ${pet.breed}</p>
        <p><strong>Age:</strong> ${ageText}</p>
        <p><strong>Location:</strong> ${pet.location}</p>
        <div class="pet-card-footer">
          <span class="pet-price">${formatCurrency(pet.price)}</span>
          <button class="btn btn-secondary btn-sm" onclick="event.stopPropagation(); viewPetDetails(${pet.id})">
            View Details
          </button>
        </div>
      </div>
    </div>
  `
}

// Show loading skeletons
function showLoadingSkeletons() {
  if (!petsGrid) return

  isLoading = true
  const skeletons = Array.from({ length: 8 }, () => createSkeletonCard()).join("")
  petsGrid.innerHTML = skeletons
}

// Hide loading skeletons
function hideLoadingSkeletons() {
  isLoading = false
}

// Create skeleton card
function createSkeletonCard() {
  return `
    <div class="skeleton-card">
      <div class="skeleton skeleton-image"></div>
      <div class="skeleton-content">
        <div class="skeleton skeleton-text title"></div>
        <div class="skeleton skeleton-text subtitle"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <div class="skeleton skeleton-text price"></div>
          <div class="skeleton" style="width: 80px; height: 32px; border-radius: 16px;"></div>
        </div>
      </div>
    </div>
  `
}

// View pet details
function viewPetDetails(petId) {
  saveToLocalStorage("selectedPetId", petId)
  window.location.href = "pet-detail.html"
}

// Clear all filters
function clearAllFilters() {
  if (searchInput) searchInput.value = ""
  if (petTypeSelect) petTypeSelect.value = ""
  if (ageRangeSelect) ageRangeSelect.value = ""
  if (priceRangeSelect) priceRangeSelect.value = ""
  if (sortBySelect) sortBySelect.value = "recent"

  filteredPets = [...samplePets]
  handleSort()
}
