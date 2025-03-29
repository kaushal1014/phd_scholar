"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Calendar, ChevronRight, School, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <header className="relative overflow-hidden bg-[conic-gradient(at_top,_var(--tw-gradient-stops))] from-[#1B3668] via-[#0A2240] to-[#1B3668]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')] opacity-5 bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
        <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl font-bold text-white tracking-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">PES University Research Degree</h1>
            <p className="text-lg text-gray-200 mt-2 font-light [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">Integrated PhD, M.Tech, PhD</p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-blue-50 dark:from-gray-900" />
      </header>

      <main className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold sm:text-5xl sm:tracking-tight lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#1B3668] via-[#2A4A8F] to-[#1B3668] dark:from-blue-300 dark:via-white dark:to-blue-300 [text-shadow:_0_1px_2px_rgb(0_0_0_/_5%)]">
            Welcome to Your Research Journey at PESU
          </h2>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
            Track your progress, manage your research, collaborate with your peers, and stay on top of your academic
            milestones all in one place.
            </p>
            <div className="bg-gradient-to-br from-blue-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 rounded-lg overflow-hidden mb-10 shadow-md max-w-lg mx-auto">
            <div className="px-8 py-8 sm:px-10 lg:py-10">
              <div className="text-center space-y-4">
              <p className="text-2xl font-bold text-[#1B3668] dark:text-white">
              <span className="block text-[#F7941D]">Sign up now to access all features.</span>
              </p>
                <p className="mt-1 text-lg text-gray-700 dark:text-gray-300 leading-snug text-center">
                Take control of your academic progress today.
                </p>
              <Link
              href="/login"
              className="mt-4 inline-flex items-center px-6 py-3 text-lg font-medium rounded-md shadow-sm text-white bg-[#1B3668] hover:bg-[#1B3668]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1B3668]"
              >
              Get Started
              </Link>
              </div>
            </div>
            </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
        >
          {[
            {
              icon: BookOpen,
              title: "Research Dashboard",
              description: "Get an overview of your research progress, publications, and upcoming deadlines.",
              link: "/dashboard",
              linkText: "View Dashboard"
            },
            {
              icon: Users,
              title: "Collaboration Hub",
              description: "Connect with fellow researchers, join discussion groups, and find potential collaborators.",
              link: "/collaboration",
              linkText: "Explore Collaborations"
            },
            {
              icon: Calendar,
              title: "Events & Announcements",
              description: "Keep track of annnouncements and upcoming events.",
              link: "/collaborations",
              linkText: "Event updates"
            }
          ].map((card, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full border-t-4 border-t-[#1B3668] bg-white/50 backdrop-blur-sm dark:bg-gray-800/50 shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1B3668]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="pb-2 relative">
                  <CardTitle className="flex items-center text-[#1B3668] dark:text-blue-300 text-xl">
                    <card.icon className="h-6 w-6 mr-3 flex-shrink-0" />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <CardDescription className="text-gray-600 dark:text-gray-300 text-base mb-6">
                    {card.description}
                  </CardDescription>
                  <Button
                    className="w-full bg-[#1B3668] text-white hover:bg-[#2A4A8F] transition-colors duration-300 group-hover:shadow-lg"
                  >
                    <Link href={card.link} className="flex items-center justify-center w-full">
                      {card.linkText} <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}