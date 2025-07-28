// Global JavaScript functionality

// Mobile Navigation Toggle
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })
  }

  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
    })
  })

  // Initialize tooltips
  initializeTooltips()

  // Set active navigation link
  setActiveNavLink()
})

// Set active navigation link based on current page
function setActiveNavLink() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"
  const navLinks = document.querySelectorAll(".nav-link")

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href") === currentPage) {
      link.classList.add("active")
    }
  })
}

// Password Toggle Functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.classList.remove("fa-eye")
    icon.classList.add("fa-eye-slash")
  } else {
    input.type = "password"
    icon.classList.remove("fa-eye-slash")
    icon.classList.add("fa-eye")
  }
}

// Modal Functions
function showModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

// Close modal when clicking outside
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    closeModal(e.target.id)
  }
})

// Toast Notification
function showToast(message, duration = 3000) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast")
  if (existingToast) {
    existingToast.remove()
  }

  // Create new toast
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.innerHTML = `
    <div class="toast-content">
      <i class="fas fa-paw"></i>
      <span>${message}</span>
    </div>
  `

  document.body.appendChild(toast)

  // Show toast
  setTimeout(() => {
    toast.classList.add("active")
  }, 100)

  // Hide toast
  setTimeout(() => {
    toast.classList.remove("active")
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast)
      }
    }, 500)
  }, duration)
}

// Form Validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const requiredFields = form.querySelectorAll("[required]")
  let isValid = true

  requiredFields.forEach((field) => {
    field.classList.remove("invalid")
    if (!field.value.trim()) {
      field.classList.add("invalid")
      isValid = false
    }
  })

  // Email validation
  const emailFields = form.querySelectorAll('input[type="email"]')
  emailFields.forEach((field) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (field.value && !emailRegex.test(field.value)) {
      field.classList.add("invalid")
      isValid = false
    }
  })

  // Password confirmation
  const password = form.querySelector("#password")
  const confirmPassword = form.querySelector("#confirm-password")
  if (password && confirmPassword && password.value !== confirmPassword.value) {
    confirmPassword.classList.add("invalid")
    showToast("Passwords do not match!")
    isValid = false
  }

  return isValid
}

// Loading States
function setLoadingState(buttonId, isLoading, originalText = "Submit") {
  const button = document.getElementById(buttonId)
  if (!button) return

  if (isLoading) {
    button.disabled = true
    button.setAttribute("data-original-text", button.textContent)
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  } else {
    button.disabled = false
    button.textContent = button.getAttribute("data-original-text") || originalText
  }
}

// Smooth Scrolling
function smoothScrollTo(elementId) {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Local Storage Helpers
function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error("Error saving to localStorage:", error)
  }
}

function getFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Error reading from localStorage:", error)
    return null
  }
}

// Debounce Function
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Format Date
function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

// Image Preview
function previewImage(input, previewContainer) {
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = document.createElement("img")
      img.src = e.target.result
      img.style.width = "100%"
      img.style.height = "100%"
      img.style.objectFit = "cover"
      previewContainer.innerHTML = ""
      previewContainer.appendChild(img)
    }
    reader.readAsDataURL(input.files[0])
  }
}

// Initialize tooltips
function initializeTooltips() {
  const tooltips = document.querySelectorAll(".tooltip")
  tooltips.forEach((tooltip) => {
    tooltip.addEventListener("mouseenter", function () {
      const title = this.getAttribute("title")
      if (title) {
        const tooltipElement = document.createElement("div")
        tooltipElement.className = "tooltip-popup"
        tooltipElement.textContent = title
        tooltipElement.style.cssText = `
          position: absolute;
          background: var(--dark-nose-black);
          color: var(--white);
          padding: 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
          z-index: 1000;
          white-space: nowrap;
          pointer-events: none;
        `
        document.body.appendChild(tooltipElement)

        const rect = this.getBoundingClientRect()
        tooltipElement.style.left = rect.left + "px"
        tooltipElement.style.top = rect.top - tooltipElement.offsetHeight - 5 + "px"

        this.tooltipElement = tooltipElement
      }
    })

    tooltip.addEventListener("mouseleave", function () {
      if (this.tooltipElement) {
        document.body.removeChild(this.tooltipElement)
        this.tooltipElement = null
      }
    })
  })
}

// Handle form submissions with loading states
function handleFormSubmission(formId, submitHandler, successMessage = "Success!") {
  const form = document.getElementById(formId)
  if (!form) return

  form.addEventListener("submit", async (e) => {
    e.preventDefault()

    if (!validateForm(formId)) {
      showToast("Please fill in all required fields correctly.")
      return
    }

    const submitButton = form.querySelector('button[type="submit"]')
    const buttonId = submitButton ? submitButton.id : null

    if (buttonId) {
      setLoadingState(buttonId, true)
    }

    try {
      await submitHandler(new FormData(form))
      showToast(successMessage)
      form.reset()
    } catch (error) {
      showToast("An error occurred. Please try again.")
      console.error("Form submission error:", error)
    } finally {
      if (buttonId) {
        setLoadingState(buttonId, false)
      }
    }
  })
}

// Redirect with loading
function redirectTo(url, delay = 1000) {
  setTimeout(() => {
    window.location.href = url
  }, delay)
}

// Check if user is authenticated (mock function)
function isAuthenticated() {
  return getFromLocalStorage("userToken") !== null
}

// Mock authentication
function mockLogin(email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        saveToLocalStorage("userToken", "mock-token-" + Date.now())
        saveToLocalStorage("userEmail", email)
        resolve({ success: true })
      } else {
        resolve({ success: false, error: "Invalid credentials" })
      }
    }, 1000)
  })
}

function mockSignup(name, email, password) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (name && email && password) {
        saveToLocalStorage("userToken", "mock-token-" + Date.now())
        saveToLocalStorage("userEmail", email)
        saveToLocalStorage("userName", name)
        resolve({ success: true })
      } else {
        resolve({ success: false, error: "Please fill in all fields" })
      }
    }, 1000)
  })
}

function logout() {
  localStorage.removeItem("userToken")
  localStorage.removeItem("userEmail")
  localStorage.removeItem("userName")
  showToast("Logged out successfully")
  redirectTo("index.html")
}

// Initialize page-specific functionality
function initializePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "login.html":
      initializeLoginPage()
      break
    case "signup.html":
      initializeSignupPage()
      break
    case "explore.html":
      initializeExplorePage()
      break
    case "sell.html":
      initializeSellPage()
      break
    case "dashboard.html":
      initializeDashboardPage()
      break
    default:
      // Home page or other pages
      break
  }
}

// Page-specific initialization functions
function initializeLoginPage() {
  handleFormSubmission(
    "login-form",
    async (formData) => {
      const email = formData.get("email")
      const password = formData.get("password")
      const result = await mockLogin(email, password)

      if (result.success) {
        showToast("Login successful! Redirecting...")
        redirectTo("dashboard.html")
      } else {
        throw new Error(result.error)
      }
    },
    "Login successful!",
  )
}

function initializeSignupPage() {
  handleFormSubmission(
    "signup-form",
    async (formData) => {
      const name = formData.get("name")
      const email = formData.get("email")
      const password = formData.get("password")
      const result = await mockSignup(name, email, password)

      if (result.success) {
        showToast("Account created successfully! Redirecting...")
        redirectTo("dashboard.html")
      } else {
        throw new Error(result.error)
      }
    },
    "Account created successfully!",
  )
}

function initializeExplorePage() {
  // This will be handled by explore.js
}

function initializeSellPage() {
  // This will be handled by sell.js
}

function initializeDashboardPage() {
  // This will be handled by dashboard.js
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", initializePage)
