import { Button, Checkbox, Input } from "@heroui/react"
import Logo from "../../../public/sai_logo_black.svg"
import Image from "next/image"
import { signInAction } from "@/app/actions"
import { FormMessage, type Message } from "@/components/form-message"

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-4 py-8">
        {/* Left column - Login form */}
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-full flex flex-col items-center mb-8">
            <Image src={Logo || "/placeholder.svg"} alt="Logo" width={150} height={100} className="mb-6" />
            <h1 className="text-3xl font-bold mb-2 text-center">¡Bienvenido de nuevo!</h1>
            <p className="text-gray-500 text-sm text-center">Por favor, ingresa tus datos</p>
          </div>

          <form className="w-full space-y-8">
            <div className="space-y-8">
              <Input
                label="EMAIL"
                color="default"
                labelPlacement="outside"
                placeholder="example@domain.com"
                radius="none"
                variant="bordered"
                name="email"
                classNames={{
                  inputWrapper: "border-foreground focus:border-foreground",
                  label: "font-medium",
                }}
              />

              <Input
                label="CONTRASEÑA"
                name="password"
                type="password"
                labelPlacement="outside"
                placeholder="  "
                radius="none"
                variant="bordered"
                classNames={{
                  inputWrapper: "border-foreground focus:border-foreground",
                  label: "font-medium",
                }}
              />
            </div>

            <div className="flex items-center justify-between w-full text-sm">
              <div className="flex items-center gap-2">
                <Checkbox className="border-foreground" />
                <p>Recordarme por 30 días</p>
              </div>
              <a className="underline cursor-pointer" href="/forgot-password">¿Olvidaste tu contraseña?</a>
            </div>

            <Button
              className="w-full rounded-sm font-semibold text-lg tracking-wide"
              size="lg"
              radius="none"
              formAction={signInAction}
              type="submit"
            >
              Iniciar Sesión
            </Button>

            <FormMessage message={searchParams} />
          </form>
        </div>

        {/* Right column - Welcome message */}
        <div className="hidden md:block w-full max-w-md">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl text-foreground font-semibold text-center mb-10">
              Nos alegra tenerte aquí. El <span className="text-red-500 font-bold">SAI</span> está diseñado para
              facilitar y agilizar todos tus procesos de adquisición interna.
            </h1>
            <div className="rounded-md border-foreground border-2 py-2 px-6 text-foreground">Muchas Gracias!</div>
          </div>
        </div>
      </div>
    </div>
  )
}

