"use client"
import { useRequests } from "@/context/RequestContext"
import { Spinner } from "@heroui/react"
import Link from "next/link"
import { use, useEffect } from "react"
import RequestCard from "./request-card"
import { motion, AnimatePresence } from "framer-motion"
import { formatDateEs } from "@/utils/utils"


function RequestsList({allUrl} : {allUrl : string}) {
  const { requests, getPendingRequests, loadingRequests } = useRequests()

  useEffect(() => {
    const getReqs = async () => {
      await getPendingRequests(2)
    }

    getReqs()
  }, [getPendingRequests])



  // Container variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  // Item variants for individual card animations
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

  return (
    <div>
      <AnimatePresence mode="wait">
        {loadingRequests ? (
          <motion.div
            className="flex flex-col items-center justify-center p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Spinner label="Cargando ..." color="danger" labelColor="danger" className="mx-auto" />
          </motion.div>
        ) : (
          <motion.div
            className="p-2 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex justify-between items-center"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-semibold text-foreground">Solicitudes de Compra</h1>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                <Link className="text-red-500 text-sm hover:underline" href={allUrl}>
                  Ver Todo
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="mt-10" variants={containerVariants} initial="hidden" animate="show">
              {requests.slice(0,4).map((req, index) => (
                <motion.div key={req.id} variants={itemVariants} custom={index} layout>
                  <RequestCard
                  reqId = {req.id}
                    title={req.product_name}
                    date={formatDateEs(req.created_at)}
                    description={req.comment}
                    url={req.image_url || "public/default.jpg"}
                    status={req.status_id}
                    // Pass animation props to RequestCard if it supports them
                    animate={true}
                    delay={index * 0.1}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default RequestsList

