"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  UploadCloudIcon,
  InfoIcon,
  MapPinIcon,
  CameraIcon,
  PawPrintIcon,
  CheckCircleIcon,
  XIcon,
  ImageIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function SellPetPage() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    petName: "",
    petType: "",
    breed: "",
    gender: "",
    ageYears: "",
    ageMonths: "",
    price: "",
    description: "",
    location: "",
    vaccinated: false,
    neutered: false,
    sellerName: "",
    sellerEmail: "",
    sellerPhone: "",
  })
  const { toast } = useToast()
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    setUser(user)

    // Fetch user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (profile) {
      setFormData((prev) => ({
        ...prev,
        sellerName: profile.full_name || "",
        sellerEmail: profile.email || user.email || "",
        sellerPhone: profile.phone || "",
        location: profile.location || "",
      }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newPreviews: string[] = []
      const newFiles: File[] = []

      for (let i = 0; i < Math.min(files.length, 5 - imagePreviews.length); i++) {
        const file = files[i]
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: "Please select images smaller than 5MB",
            variant: "destructive",
          })
          continue
        }
        newPreviews.push(URL.createObjectURL(file))
        newFiles.push(file)
      }

      setImagePreviews((prev) => [...prev, ...newPreviews])
      setImageFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const uploadImages = async (petId: string) => {
    const imageUrls: string[] = []

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileExt = file.name.split(".").pop()
      const fileName = `${petId}_${i}.${fileExt}`
      const filePath = `pet-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("pet-images").upload(filePath, file)

      if (uploadError) {
        console.error("Error uploading image:", uploadError)
        continue
      }

      const { data } = supabase.storage.from("pet-images").getPublicUrl(filePath)

      if (data) {
        imageUrls.push(data.publicUrl)
      }
    }

    return imageUrls
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to list a pet",
        variant: "destructive",
      })
      router.push("/login")
      return
    }

    if (imagePreviews.length === 0) {
      toast({
        title: "Images Required",
        description: "Please upload at least one image of your pet",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // First, insert the pet record
      const { data: petData, error: petError } = await supabase
        .from("pets")
        .insert([
          {
            name: formData.petName,
            species: formData.petType,
            breed: formData.breed || null,
            gender: formData.gender,
            age_years: Number.parseInt(formData.ageYears) || 0,
            age_months: Number.parseInt(formData.ageMonths) || 0,
            price: Number.parseFloat(formData.price),
            description: formData.description,
            seller_id: user.id,
            is_vaccinated: formData.vaccinated,
            is_neutered: formData.neutered,
            image_url: "", // Will be updated after image upload
          },
        ])
        .select()
        .single()

      if (petError) {
        throw petError
      }

      // Upload images and get URLs
      const imageUrls = await uploadImages(petData.id)

      // Update pet record with first image URL
      if (imageUrls.length > 0) {
        const { error: updateError } = await supabase
          .from("pets")
          .update({ image_url: imageUrls[0] })
          .eq("id", petData.id)

        if (updateError) {
          console.error("Error updating pet image:", updateError)
        }
      }

      // Update user profile with contact information
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: formData.sellerName,
        email: formData.sellerEmail,
        phone: formData.sellerPhone,
        location: formData.location,
      })

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }

      toast({
        title: "🎉 Pet Listed Successfully!",
        description: (
          <div className="flex items-center gap-2">
            <PawPrintIcon className="h-5 w-5" />
            Your pet is now live on PawPal and visible to potential buyers.
          </div>
        ),
        variant: "default",
      })

      // Reset form
      setImagePreviews([])
      setImageFiles([])
      setFormData({
        petName: "",
        petType: "",
        breed: "",
        gender: "",
        ageYears: "",
        ageMonths: "",
        price: "",
        description: "",
        location: formData.location, // Keep location
        vaccinated: false,
        neutered: false,
        sellerName: formData.sellerName, // Keep seller info
        sellerEmail: formData.sellerEmail,
        sellerPhone: formData.sellerPhone,
      })

      // Redirect to dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error listing pet:", error)
      toast({
        title: "Error",
        description: "Failed to list your pet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream-white pt-16">
        <div className="text-center">
          <PawPrintIcon className="h-16 w-16 text-paw-brown mx-auto mb-4" />
          <h2 className="text-2xl font-poppins font-bold mb-2">Authentication Required</h2>
          <p className="text-fur-gray mb-4">Please log in to list your pet</p>
          <Button onClick={() => router.push("/login")} className="bg-paw-brown text-cream-white">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-white to-soft-pink-nose/10 text-dark-nose-black font-sans pt-20 pb-12">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-paw-brown/10 rounded-full">
              <PawPrintIcon className="h-16 w-16 text-paw-brown" aria-hidden="true" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">List Your Pet for Sale</h1>
          <p className="text-xl text-fur-gray max-w-2xl mx-auto">
            Help your beloved pet find their perfect new home through our trusted platform
          </p>
        </div>

        <Card className="bg-white rounded-2xl shadow-2xl p-8 border-0">
          <CardHeader className="p-0 mb-8">
            <CardTitle className="text-3xl font-poppins font-bold flex items-center gap-3">
              <CameraIcon className="h-8 w-8 text-paw-brown" aria-hidden="true" />
              Pet Information
            </CardTitle>
            <p className="text-fur-gray text-lg mt-2">
              Please provide accurate information to help potential buyers make informed decisions.
            </p>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Seller Contact Information */}
              <div className="space-y-6">
                <h3 className="text-xl font-poppins font-bold flex items-center gap-2">
                  <UserIcon className="h-6 w-6 text-paw-brown" />
                  Your Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="sellerName"
                      className="font-sans text-fur-gray flex items-center gap-2 font-semibold"
                    >
                      <UserIcon className="h-4 w-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="sellerName"
                      name="sellerName"
                      type="text"
                      placeholder="Your full name"
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange("sellerName", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sellerEmail"
                      className="font-sans text-fur-gray flex items-center gap-2 font-semibold"
                    >
                      <MailIcon className="h-4 w-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="sellerEmail"
                      name="sellerEmail"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                      value={formData.sellerEmail}
                      onChange={(e) => handleInputChange("sellerEmail", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sellerPhone"
                      className="font-sans text-fur-gray flex items-center gap-2 font-semibold"
                    >
                      <PhoneIcon className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="sellerPhone"
                      name="sellerPhone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                      value={formData.sellerPhone}
                      onChange={(e) => handleInputChange("sellerPhone", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-sans text-fur-gray flex items-center gap-2 font-semibold">
                      <MapPinIcon className="h-4 w-4" />
                      Location *
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="City, State, Country"
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-4">
                <Label className="font-sans text-fur-gray flex items-center gap-2 text-lg font-semibold">
                  <ImageIcon className="h-5 w-5" aria-hidden="true" />
                  Pet Images (up to 5 images) *
                </Label>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {imagePreviews.map((src, index) => (
                    <div
                      key={index}
                      className="relative group rounded-xl overflow-hidden border-2 border-fur-gray/20 shadow-md hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={src || "/placeholder.svg"}
                        alt={`Pet preview ${index + 1}`}
                        className="w-full h-32 object-cover"
                        style={{ objectFit: "cover" }}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {imagePreviews.length < 5 && (
                    <Label
                      htmlFor="image-upload"
                      className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-sky-blue-collar rounded-xl cursor-pointer bg-sky-blue-collar/5 text-sky-blue-collar hover:bg-sky-blue-collar/10 transition-colors group"
                    >
                      <UploadCloudIcon
                        className="h-8 w-8 mb-2 group-hover:scale-110 transition-transform"
                        aria-hidden="true"
                      />
                      <span className="text-sm font-medium">Add Image</span>
                      <Input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageUpload}
                      />
                    </Label>
                  )}
                </div>

                <p className="text-sm text-fur-gray">
                  📸 Upload high-quality photos showing your pet from different angles. Accepted formats: JPG, PNG. Max
                  size: 5MB per image.
                </p>
              </div>

              {/* Pet Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="petName" className="font-sans text-fur-gray flex items-center gap-2 font-semibold">
                    <PawPrintIcon className="h-4 w-4" aria-hidden="true" />
                    Pet Name *
                  </Label>
                  <Input
                    id="petName"
                    name="petName"
                    type="text"
                    placeholder="e.g., Buddy, Whiskers, Polly"
                    required
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    value={formData.petName}
                    onChange={(e) => handleInputChange("petName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="petType" className="font-sans text-fur-gray font-semibold">
                    Pet Type *
                  </Label>
                  <Select name="petType" required onValueChange={(value) => handleInputChange("petType", value)}>
                    <SelectTrigger className="w-full rounded-xl border-2 border-fur-gray/20 bg-white text-dark-nose-black shadow-sm py-3">
                      <SelectValue placeholder="Select pet type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-dark-nose-black rounded-xl shadow-lg">
                      <SelectItem value="Dog">🐕 Dog</SelectItem>
                      <SelectItem value="Cat">🐱 Cat</SelectItem>
                      <SelectItem value="Bird">🦜 Bird</SelectItem>
                      <SelectItem value="Rabbit">🐰 Rabbit</SelectItem>
                      <SelectItem value="Fish">🐠 Fish</SelectItem>
                      <SelectItem value="Hamster">🐹 Hamster</SelectItem>
                      <SelectItem value="Other">🐾 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="breed" className="font-sans text-fur-gray font-semibold">
                    Breed
                  </Label>
                  <Input
                    id="breed"
                    name="breed"
                    type="text"
                    placeholder="e.g., Golden Retriever, Persian, Macaw"
                    className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                    value={formData.breed}
                    onChange={(e) => handleInputChange("breed", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="font-sans text-fur-gray font-semibold">
                    Gender *
                  </Label>
                  <Select name="gender" required onValueChange={(value) => handleInputChange("gender", value)}>
                    <SelectTrigger className="w-full rounded-xl border-2 border-fur-gray/20 bg-white text-dark-nose-black shadow-sm py-3">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-dark-nose-black rounded-xl shadow-lg">
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="font-sans text-fur-gray font-semibold">Age *</Label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <Input
                        id="ageYears"
                        name="ageYears"
                        type="number"
                        placeholder="Years"
                        min="0"
                        max="20"
                        className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                        value={formData.ageYears}
                        onChange={(e) => handleInputChange("ageYears", e.target.value)}
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        id="ageMonths"
                        name="ageMonths"
                        type="number"
                        placeholder="Months"
                        min="0"
                        max="11"
                        className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 px-4 text-base"
                        value={formData.ageMonths}
                        onChange={(e) => handleInputChange("ageMonths", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price" className="font-sans text-fur-gray font-semibold">
                    Price (USD) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-fur-gray font-semibold">$</span>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      placeholder="850.00"
                      required
                      className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm py-3 pl-8 pr-4 text-base"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-sans text-fur-gray font-semibold">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell potential buyers about your pet's personality, habits, health, and what makes them special..."
                  required
                  className="rounded-xl border-2 border-fur-gray/20 focus:border-paw-brown focus:ring-paw-brown shadow-sm min-h-[120px] py-3 px-4 text-base"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              {/* Health & Care Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center justify-between rounded-xl border-2 border-fur-gray/20 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-paw-brown" aria-hidden="true" />
                    <div>
                      <Label
                        htmlFor="vaccinated"
                        className="font-sans text-dark-nose-black font-semibold cursor-pointer"
                      >
                        Vaccinated
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-fur-gray cursor-help ml-2 inline" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-dark-nose-black text-cream-white rounded-lg p-3 text-sm max-w-xs">
                            Confirm if your pet has received all necessary vaccinations according to veterinary
                            recommendations.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Switch
                    id="vaccinated"
                    name="vaccinated"
                    checked={formData.vaccinated}
                    onCheckedChange={(checked) => handleInputChange("vaccinated", checked)}
                  />
                </div>

                <div className="flex items-center justify-between rounded-xl border-2 border-fur-gray/20 p-6 shadow-sm bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <CheckCircleIcon className="h-6 w-6 text-paw-brown" aria-hidden="true" />
                    <div>
                      <Label htmlFor="neutered" className="font-sans text-dark-nose-black font-semibold cursor-pointer">
                        Neutered/Spayed
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-fur-gray cursor-help ml-2 inline" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-dark-nose-black text-cream-white rounded-lg p-3 text-sm max-w-xs">
                            Indicate if your pet has been spayed (female) or neutered (male) to prevent reproduction.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <Switch
                    id="neutered"
                    name="neutered"
                    checked={formData.neutered}
                    onCheckedChange={(checked) => handleInputChange("neutered", checked)}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-paw-brown text-cream-white hover:bg-paw-brown/90 rounded-xl px-8 py-4 shadow-lg transition-all duration-200 hover:shadow-xl text-xl font-semibold hover:transform hover:-translate-y-1"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cream-white"></div>
                      Submitting Listing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <PawPrintIcon className="h-6 w-6" aria-hidden="true" />
                      List My Pet
                    </div>
                  )}
                </Button>

                <p className="text-center text-sm text-fur-gray mt-4">
                  By submitting, you agree to our Terms of Service and confirm that all information provided is
                  accurate.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
