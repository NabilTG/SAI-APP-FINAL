"use client"
import Image from "next/image"
import { motion } from "framer-motion"

interface RequestCardProps {
  title: string
  date: string
  description: string
  url: string
  animate?: boolean
  delay?: number
  status: number;
}

function RequestCard({ title, date, description, status, url, animate = false, delay = 0 }: RequestCardProps) {
  // If animate is true, use motion.div, otherwise use regular div
  const CardWrapper = animate ? motion.div : "div"

  // Animation properties
  const cardAnimationProps = animate
    ? {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: delay,
      },
      whileHover: {
        scale: 1.02,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.05)",
      },
    }
    : {}

  return (
    <CardWrapper
      className="flex gap-5 items-center mb-5 p-4 rounded-md bg-background/50 shadow-sm hover:shadow-md transition-shadow border border-foreground/10"
      {...cardAnimationProps}
    >
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.8 } : {}}
        animate={animate ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.3, delay: delay + 0.1 }}
      >
        <Image
          src={url || "/placeholder.svg"}
          alt={title}
          width={100}
          height={100}
          className="rounded-md object-cover"
        />
      </motion.div>

      <div className="flex justify-between w-full items-center">
        <div className="w-full">
          <motion.div
            initial={animate ? { opacity: 0, x: -10 } : {}}
            animate={animate ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.2 }}
          >
            <h2 className="text-lg font-semibold text-foreground">{title}</h2>
            <p className="text-sm text-gray-500">{date}</p>
          </motion.div>

          <motion.p
            className="text-sm text-red-500 mt-2"
            initial={animate ? { opacity: 0 } : {}}
            animate={animate ? { opacity: 1 } : {}}
            transition={{ duration: 0.3, delay: delay + 0.3 }}
          >
            {description}
          </motion.p>
        </div>

        <div className="w-[200px] text-right text-[10px]">
          <motion.p className=" text-sm text-gray-400">
            {status === 2 ? "Aprobado Jefe" : status === 3 ? "Aprobado Financiero" : status === 4 ? "Denegado" : "Pendiente"}
          </motion.p>
        </div>

      </div>
    </CardWrapper>
  )
}

export default RequestCard

