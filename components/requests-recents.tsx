"use client"
import { useRequests } from "@/context/RequestContext"
import Image from "next/image"
import { useEffect, useState } from "react"

import { HiDotsHorizontal } from "react-icons/hi"
import { MdTimer } from "react-icons/md"
import { motion, AnimatePresence } from "framer-motion"
import { IoCheckmarkCircleSharp, IoCheckmarkDoneCircleSharp } from "react-icons/io5";

function RecentsRequestsList() {
  const { newRequests, getNewestRequests } = useRequests()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getReqs = async () => {
      setIsLoading(true)
      await getNewestRequests(2)
      setIsLoading(false)
    }

    getReqs()
  }, [getNewestRequests])

  // Container variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  // Item variants for individual animations
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  // Icon animation variants
  const iconVariants = {
    hidden: { scale: 0 },
    show: {
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        delay: 0.2,
      },
    },
  }

  // Loading animation
  const loadingVariants = {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        repeat: Number.POSITIVE_INFINITY,
        duration: 1.5,
      },
    },
  }

  return (
    <div className="w-full mt-2">
      <motion.div
        className="flex justify-between items-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-foreground font-semibold text-2xl">Solicitudes Recientes</h1>
      </motion.div>

      <AnimatePresence>
        {isLoading ? (
          <motion.div className="mt-5 space-y-4" variants={loadingVariants} animate="animate">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex gap-5 items-center justify-center mb-2 bg-gray-100 h-24 rounded-md animate-pulse p-2"
              >
                <div className="w-[100px] h-[50px] bg-gray-200 rounded"></div>
                <div className="w-full ml-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
                <div className="space-y-2 text-center">
                  <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                  <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div className="mt-5" variants={containerVariants} initial="hidden" animate="show">
            {newRequests.map((req) => (
              <motion.div
                className="flex gap-5 items-center justify-center mb-2 text-foreground bg-background hover:bg-background/90 p-3 rounded-md transition-colors"
                key={req.id}
                variants={itemVariants}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 3px 10px rgba(0,0,0,0.05)",
                }}
                layout
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={req.image_url || "/placeholder.svg"}
                    alt={req.product_name}
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </motion.div>

                <div className="w-full ml-1">
                  <motion.h2
                    className="text-sm font-medium"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {req.product_name}
                  </motion.h2>
                  <motion.p
                    className="text-sm text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {req.status_id === 2 ? "Aprobado Jefe" : req.status_id === 3 ? "Aprobado Financiero" : "Pendiente"}
                  </motion.p>
                </div>

                <div className="space-y-2 text-center">
                  <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.3 }}>
                    <HiDotsHorizontal size={20} />
                  </motion.div>

                  <motion.div variants={iconVariants}>
                    {req.status_id === 2 ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          delay: 0.4,
                        }}
                      >
                        <IoCheckmarkCircleSharp size={20} className="text-red-500" />
                      </motion.div>
                    ) : req.status_id === 3 ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            delay: 0.4,
                          }}
                        >
                          <IoCheckmarkDoneCircleSharp size={20} className="text-red-500" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            delay: 0.4,
                          }}
                        >
                          <MdTimer size={20} className="text-red-500" />
                        </motion.div>
                      )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RecentsRequestsList

