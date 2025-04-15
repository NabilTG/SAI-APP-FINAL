"use client"
import { addToast, Autocomplete, AutocompleteItem, Button, Input } from "@heroui/react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import type { addUserType } from "@/types/UserTypes"
import { motion } from "framer-motion"
import { UserPlus, User, CreditCard, Mail, Lock, UserCheck } from "lucide-react"
import { useCUsers } from "@/context/UsersContext"

const validationSchema = Yup.object().shape({
  full_name: Yup.string().required("El nombre es requerido"),
  national_id: Yup.string().min(9, "Ingresa una cédula válida.").required("La cédula es requerida"),
  email: Yup.string().email("Email inválido").required("El email es requerido"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es requerida"),
  roleId: Yup.number().required("El rol es obligatorio"),
})

function CreateForm() {
   const { addUser, loadingCreate } = useCUsers();

  const roles = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Comprador" },
    { id: 3, name: "Aprobador Jefe" },
    { id: 4, name: "Aprobador Financiero 1" },
    { id: 5, name: "Aprobador Financiero 2" },
    { id: 6, name: "Aprobador Financiero 3" },
  ]

  const initialValues: addUserType = {
    full_name: "",
    national_id: "",
    email: "",
    password: "",
    roleId: 1, // Siempre 1
    status: true, // Siempre true
  }

  const handleCreateUser = async (values: addUserType, { resetForm }: { resetForm: () => void }) => {
    await addUser(values);

    addToast({
      title: "Éxito",
      description: "Usuario creado correctamente!",
      color: "success",
      timeout: 5000,
    })

    resetForm()
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <motion.div className="max-w-2xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div className="bg-white rounded-xl shadow-xl overflow-hidden" variants={itemVariants}>
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Crear Nuevo Usuario</h2>
              <p className="text-red-100">Complete todos los campos para registrar un usuario</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleCreateUser}>
            {({ setFieldValue, errors, touched }) => (
              <Form className="space-y-6">
                <motion.div variants={itemVariants} className="space-y-6">
                  {/* Full Name */}
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <User className="w-4 h-4 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                    </div>
                    <Field
                      as={Input}
                      radius={"none"}
                      type="text"
                      name="full_name"
                      placeholder="Ingrese nombre completo"
                      required
                      className={`border ${errors.full_name && touched.full_name ? "border-red-300" : "border-gray-300"} focus:border-red-500`}
                      classNames={{
                        inputWrapper: "shadow-sm",
                      }}
                    />
                    <ErrorMessage
                      name="full_name"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    />
                  </div>

                  {/* National ID */}
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <CreditCard className="w-4 h-4 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Cédula</label>
                    </div>
                    <Field
                      as={Input}
                      radius={"none"}
                      type="number"
                      name="national_id"
                      placeholder="Ingrese número de cédula"
                      required
                      className={`border ${errors.national_id && touched.national_id ? "border-red-300" : "border-gray-300"} focus:border-red-500`}
                      classNames={{
                        inputWrapper: "shadow-sm",
                      }}
                    />
                    <ErrorMessage
                      name="national_id"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <Mail className="w-4 h-4 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                    </div>
                    <Field
                      as={Input}
                      radius={"none"}
                      type="email"
                      name="email"
                      placeholder="ejemplo@correo.com"
                      required
                      className={`border ${errors.email && touched.email ? "border-red-300" : "border-gray-300"} focus:border-red-500`}
                      classNames={{
                        inputWrapper: "shadow-sm",
                      }}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <Lock className="w-4 h-4 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    </div>
                    <Field
                      as={Input}
                      radius={"none"}
                      type="password"
                      name="password"
                      placeholder="Mínimo 6 caracteres"
                      required
                      className={`border ${errors.password && touched.password ? "border-red-300" : "border-gray-300"} focus:border-red-500`}
                      classNames={{
                        inputWrapper: "shadow-sm",
                      }}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    />
                  </div>

                  {/* Role */}
                  <div className="relative">
                    <div className="flex items-center mb-1">
                      <UserCheck className="w-4 h-4 text-red-500 mr-2" />
                      <label className="text-sm font-medium text-gray-700">Rol del Usuario</label>
                    </div>
                    <Autocomplete
                      placeholder="Selecciona el Rol"
                      radius={"none"}
                      onSelectionChange={(id) => setFieldValue("roleId", Number(id))}
                      defaultItems={roles}
                      defaultSelectedKey="1"
                      className={`border ${errors.roleId && touched.roleId ? "border-red-300" : "border-gray-300"} focus:border-red-500`}
                      classNames={{
                        base: "shadow-sm",
                      }}
                    >
                      {(role) => (
                        <AutocompleteItem key={role.id} className="text-black">
                          {role.name}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                    <ErrorMessage
                      name="roleId"
                      component="div"
                      className="text-red-500 text-xs mt-1 flex items-center"
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div variants={itemVariants} className="pt-4">
                  <Button
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold text-lg shadow-md hover:shadow-lg transition-all"
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={loadingCreate}
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Crear Usuario
                  </Button>
                </motion.div>
              </Form>
            )}
          </Formik>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CreateForm

