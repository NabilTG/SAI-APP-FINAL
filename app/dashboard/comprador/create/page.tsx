"use client"

import { Button, Form, Input, Textarea } from "@heroui/react"
import type React from "react"
import { useEffect, useState } from "react"
import { useRequests } from "@/context/RequestContext"
import { supabase } from "@/utils/supabase/client"
import { redirect } from "next/navigation"
import type { CreateRequest } from "@/types/RequestsTypes"
import { useImages } from "@/context/ImagesContext"
import { motion } from "framer-motion"

function CreateRequestForm() {
  const { createRequest, loadingCreate } = useRequests()
  const { imageURL, uploadImage, loadingImage } = useImages()
  // Estado para almacenar los valores del formulario

  const initialFormData: CreateRequest = {
    user_id: "",
    status_id: 1,
    product_name: "",
    product_price: 0,
    product_qty: 0,
    comment: "",
    total_request: 0,
    image_url: "https://yrmjwxphiozunismqzta.supabase.co/storage/v1/object/public/requestimages/public/default.jpg",
  }

  const [formData, setFormData] = useState<CreateRequest>(initialFormData);

  // Estado para la vista previa de la imagen
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error || !user) {
        redirect("/sign-in")
        return
      }
      setFormData((prev) => ({
        ...prev,
        user_id: user.id,
      }))
    }

    loadUser()
  }, [])

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "product_price" || name === "product_qty" ? Number(value) : value,
    }))
  }

  // Manejar la subida de imágenes
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImagePreview(URL.createObjectURL(file))
    }
    await uploadImage(e)
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Asegurar que la imagen se ha cargado
    const finalImageUrl =
      imageURL || "https://yrmjwxphiozunismqzta.supabase.co/storage/v1/object/public/requestimages/public/default.jpg"
    // Actualizar la data con la imagen
    const finalFormData = { ...formData, image_url: finalImageUrl }
    // Enviar la solicitud
    await createRequest(finalFormData)
    setFormData({ ...initialFormData, user_id: formData.user_id }); // conserva el user_id
    setImagePreview(null); // limpia la vista previa
  }

  useEffect(() => {
    const total = formData.product_price * formData.product_qty;
    setFormData((prev) => ({
      ...prev,
      total_request: total,
    }));
  }, [formData.product_price, formData.product_qty]);


  return (
    <div className="container p-2 min-h-screen">
      <motion.div
        className="w-full max-w-3xl mx-auto bg-background rounded-lg shadow-lg overflow-hidden border border-red-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Formulario de Solicitud de Adquisición</h1>
          <p className="text-red-100 mt-2">Complete todos los campos para crear una nueva solicitud</p>
        </div>

        <div className="p-8">
          <Form onSubmit={handleSubmit} className="space-y-6">
            {/* Two column layout for smaller inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                <Input
                  label="Nombre del Artículo"
                  type="text"
                  name="product_name"
                  value={formData.product_name}
                  onChange={handleChange}
                  required
                  className="border-border focus:border-red-500"
                  classNames={{
                    label: "font-medium text-foreground",
                    inputWrapper: "shadow-sm",
                  }}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <Input
                  label="Cantidad"
                  type="number"
                  name="product_qty"
                  value={formData.product_qty.toString()}
                  onChange={handleChange}
                  required
                  className="border-border focus:border-red-500"
                  classNames={{
                    label: "font-medium text-foreground",
                    inputWrapper: "shadow-sm",
                  }}
                />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  label="Precio Unitario"
                  type="number"
                  name="product_price"
                  value={formData.product_price.toString()}
                  onChange={handleChange}
                  required
                  className="border-border focus:border-red-500"
                  classNames={{
                    label: "font-medium text-foreground",
                    inputWrapper: "shadow-sm",
                  }}
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Input
                  label="Total"
                  type="number"
                  name="total_request"
                  onChange={handleChange}
                  value={(formData.product_price * formData.product_qty).toString()}
                  disabled
                  className="bg-muted border-border"
                  classNames={{
                    label: "font-medium text-foreground",
                    inputWrapper: "shadow-sm",
                  }}
                />
              </motion.div>
            </div>

            {/* Image upload section with preview */}
            <motion.div
              className="border-2 border-dashed border-border rounded-lg p-6 bg-muted w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-foreground font-medium mb-2">Imagen del Artículo</label>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-full md:w-1/2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border-border focus:border-red-500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Formatos aceptados: JPG, PNG, GIF</p>
                </div>

                <div className="w-full md:w-1/2 flex justify-center">
                  {imagePreview ? (
                    <motion.img
                      src={imagePreview}
                      alt="Vista previa"
                      className="h-32 w-32 object-cover rounded-md border border-border shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="h-32 w-32 bg-muted rounded-md border border-border flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">Vista previa</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Description textarea */}
            <motion.div
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Textarea
                label="Descripción"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                size="lg"
                className="min-h-[120px] border-border focus:border-red-500"
                classNames={{
                  label: "font-medium text-foreground",
                  inputWrapper: "shadow-sm",
                }}
              />
            </motion.div>

            {/* Action buttons */}
            <motion.div
              className="flex justify-between gap-3 pt-4 border-t border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                size="lg"
                type="reset"
                className="bg-background border border-border text-foreground hover:bg-muted transition-colors"
              >
                Cancelar
              </Button>
              <Button
                className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg transition-all"
                size="lg"
                type="submit"
                isLoading={loadingImage || loadingCreate}
              >
                {loadingImage || loadingCreate ? "Procesando..." : "Crear Solicitud"}
              </Button>
            </motion.div>
          </Form>
        </div>
      </motion.div>
    </div>
  )
}

export default CreateRequestForm

