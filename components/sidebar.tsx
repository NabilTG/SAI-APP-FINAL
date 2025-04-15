"use client"
import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { FaChevronLeft, FaHome } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import Logo from "../public/sai_logo_red.svg"

export type MenuItem = {
  title: string
  icon: React.ElementType
  url: string
}

export type SidebarProps = {
  menus: MenuItem[]
}

function Sidebar({ menus }: SidebarProps) {
  const [open, setOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState("Inicio")

  // Agregar siempre "Inicio" al inicio del menú
  const finalMenus: MenuItem[] = [
    { title: "Inicio", icon: FaHome, url: "/dashboard" },
    ...menus, // Agrega los demás elementos
  ]

  const handleMenuClick = (title: string, url: string) => {
    setActiveMenu(title)
    window.location.href = url
  }

  // Variants for animations
  const sidebarVariants = {
    open: { width: "18rem", transition: { duration: 0.3, ease: "easeInOut" } },
    closed: { width: "5.5rem", transition: { duration: 0.3, ease: "easeInOut" } },
  }

  const buttonVariants = {
    open: { rotate: 0, transition: { duration: 0.3 } },
    closed: { rotate: 180, transition: { duration: 0.3 } },
  }

  const logoVariants = {
    open: { width: 130, rotate: 360, transition: { duration: 0.5 } },
    closed: { width: 50, rotate: 0, transition: { duration: 0.5 } },
  }

  const textVariants = {
    open: {
      opacity: 1,
      x: 0,
      display: "block",
      transition: {
        duration: 0.3,
        delay: 0.1,
        ease: "easeOut",
      },
    },
    closed: {
      opacity: 0,
      x: -10,
      transitionEnd: {
        display: "none",
      },
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  }

  const menuItemVariants = {
    hover: {
      scale: 1.03,
      backgroundColor: "rgba(243, 244, 246, 1)",
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="flex">
      {/* Sidebar container */}
      <motion.div
        initial={open ? "open" : "closed"}
        animate={open ? "open" : "closed"}
        variants={sidebarVariants}
        className="fixed left-0 top-0 min-h-screen bg-background border-r  shadow-md p-5 z-10"
      >
        {/* Toggle button */}
        <motion.button
          initial={open ? "open" : "closed"}
          animate={open ? "open" : "closed"}
          variants={buttonVariants}
          onClick={() => setOpen(!open)}
          className="absolute -right-3 top-16 w-8 h-8 rounded-full bg-background shadow-md flex items-center justify-center z-20"
        >
          <FaChevronLeft  className="text-foreground" />
        </motion.button>

        {/* Logo */}
        <div className="flex items-center justify-center mb-10">
          <motion.div initial={open ? "open" : "closed"} animate={open ? "open" : "closed"} variants={logoVariants}>
            <Image
              src={Logo || "/placeholder.svg"}
              alt="Logo"
              className="cursor-pointer"
              width={open ? 130 : 50}
              height={50}
            />
          </motion.div>
        </div>

        {/* Menu items */}
        <ul className="space-y-5">
          {finalMenus.map((menu, index) => {
            const Icon = menu.icon
            const isActive = activeMenu === menu.title
            return (
              <motion.li
                key={index}
                variants={menuItemVariants}
                whileHover="hover"
                className={`flex items-center gap-x-4 p-3 rounded-md cursor-pointer ${
                  isActive ? "bg-gray-100 text-red-500" : "text-gray-500"
                }`}
                onClick={() => handleMenuClick(menu.title, menu.url)}
              >
                {/* Icon with subtle animation */}
                <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
                  <Icon size={24} className={isActive ? "text-red-500" : ""} />
                </motion.div>

                {/* Title with fade animation */}
                <AnimatePresence>
                  <motion.span
                    initial={open ? "open" : "closed"}
                    animate={open ? "open" : "closed"}
                    variants={textVariants}
                    className="origin-left"
                  >
                    {menu.title}
                  </motion.span>
                </AnimatePresence>
              </motion.li>
            )
          })}
        </ul>
      </motion.div>
    </div>
  )
}

export default Sidebar

