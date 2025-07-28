// Sell Pet Page Functionality

let uploadedImages = []

// Initialize page
document.addEventListener("DOMContentLoaded", () => {
  setupImageUpload()
  setupSellForm()
  setupAgeValidation()
})

// Setup image upload
function setupImageUpload() {
  const imageInput = document.getElementById("image-input")
  const imagePreviewsContainer = document.getElementById("image-previews")

  if (imageInput) {
    imageInput.addEventListener("change", handleImageUpload)
  }
}

// Handle image upload
function handleImageUpload(e) {
  const files = Array.from(e.target.files)
  const imagePreviewsContainer = document.getElementById("image-previews")

  if (!imagePreviewsContainer) return

  files.forEach((file) => {
    if (uploadedImages.length >= 5) {
      alert("Maximum 5 images allowed")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageData = {
        id: Date.now() + Math.random(),
        file: file,
        dataUrl: e.target.result,
      }

      uploadedImages.push(imageData)
      renderImagePreviews()
    }
    reader.readAsDataURL(file)
  })

  // Clear input
  e.target.value = ""
}

// Render image previews
function renderImagePreviews() {
  const imagePreviewsContainer = document.getElementById("image-previews")
  if (!imagePreviewsContainer) return

  imagePreviewsContainer.innerHTML = uploadedImages
    .map(
      (image) => `
        <div class="image-preview">
            <img src="${image.dataUrl}" alt="Pet preview">
            <button type="button" class="remove-image" onclick="removeImage('${image.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `,
    )
    .join("")
}

// Remove image
function removeImage(imageId) {
  uploadedImages = uploadedImages.filter((img) => img.id !== imageId)
  renderImagePreviews()
}

// Setup sell form
function setupSellForm() {
  const sellForm = document.getElementById("sell-form")

  if (sellForm) {
    sellForm.addEventListener("submit", handleSellSubmit)
  }
}

// Handle sell form submission
function handleSellSubmit(e) {
  e.preventDefault()

  if (uploadedImages.length === 0) {
    alert("Please upload at least one image of your pet")
    return
  }

  if (!validateForm("sell-form")) {
    return
  }

  // Get form data
  const formData = new FormData(e.target)
  const petData = {
    id: Date.now(),
    name: formData.get("pet-name"),
    type: formData.get("pet-type"),
    breed: formData.get("pet-breed") || "Mixed",
    gender: formData.get("pet-gender"),
    ageYears: Number.parseInt(formData.get("age-years")) || 0,
    ageMonths: Number.parseInt(formData.get("age-months")) || 0,
    price: Number.parseFloat(formData.get("pet-price")),
    description: formData.get("pet-description"),
    location: formData.get("pet-location"),
    vaccinated: formData.get("vaccinated") === "on",
    neutered: formData.get("neutered") === "on",
    images: uploadedImages.map((img) => img.dataUrl),
    datePosted: new Date().toISOString(),
    status: "active",
  }

  // Simulate form submission
  const submitButton = e.target.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting Listing...'

  setTimeout(() => {
    // Save listing to localStorage
    savePetListing(petData)

    // Reset form
    e.target.reset()
    uploadedImages = []
    renderImagePreviews()

    // Reset button
    submitButton.disabled = false
    submitButton.textContent = originalText

    // Show success toast
    showToast("Your pet is now listed!")

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, 2000)
}

// Save pet listing
function savePetListing(petData) {
  const petListings = getFromLocalStorage("petListings") || []
  petListings.push(petData)
  saveToLocalStorage("petListings", petListings)
}

// Age input validation
function setupAgeValidation() {
  const ageMonthsInput = document.getElementById("age-months")

  if (ageMonthsInput) {
    ageMonthsInput.addEventListener("input", function () {
      const value = Number.parseInt(this.value)
      if (value > 11) {
        this.value = 11
      }
    })
  }
}

// Validate form
function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    if (!field.value) {
      isValid = false
      field.classList.add("invalid")
    } else {
      field.classList.remove("invalid")
    }
  })

  return isValid
}

// Show toast
function showToast(message) {
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.remove()
  }, 3000)
}

// Get from localStorage
function getFromLocalStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    return null
  }
}

// Save to localStorage
function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}
