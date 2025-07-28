"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Float, Environment, Text } from "@react-three/drei"
import { Suspense, useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Code,
  Database,
  Globe,
  Download,
  ExternalLink,
  Award,
  Users,
  TrendingUp,
  Heart,
} from "lucide-react"
import Image from "next/image"
import * as THREE from "three"

// Cursor Wave Effect Component
function CursorWave() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
      setIsMoving(true)

      clearTimeout(timeout)
      timeout = setTimeout(() => setIsMoving(false), 150)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {isMoving && (
        <motion.div
          className="absolute w-48 h-48 rounded-full"
          style={{
            left: mousePosition.x - 96,
            top: mousePosition.y - 96,
            background:
              "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.1) 30%, rgba(6, 182, 212, 0.05) 60%, transparent 100%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      )}
      {isMoving && (
        <motion.div
          className="absolute w-32 h-32 rounded-full"
          style={{
            left: mousePosition.x - 64,
            top: mousePosition.y - 64,
            background:
              "radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.15) 40%, rgba(16, 185, 129, 0.1) 70%, transparent 100%)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
        />
      )}
    </div>
  )
}

// Life Cycle Animation Components
function LifeCycleIcon({
  position,
  icon,
  color,
  delay,
}: { position: [number, number, number]; icon: string; color: string; delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<any>(null)

  useFrame((state) => {
    if (meshRef.current && textRef.current) {
      const time = state.clock.elapsedTime + delay
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 1
      meshRef.current.rotation.y = time * 0.3

      // Pulsing effect
      const scale = 1 + Math.sin(time * 2) * 0.2
      meshRef.current.scale.setScalar(scale)
      textRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={meshRef} position={position}>
        <mesh>
          <sphereGeometry args={[0.8, 32, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} />
        </mesh>
        <Text
          ref={textRef}
          position={[0, 0, 0.9]}
          fontSize={1.5}
          color="white"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist_Bold.json"
        >
          {icon}
        </Text>
      </group>
    </Float>
  )
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)
  const particleCount = 3000

  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 60
    positions[i * 3 + 1] = (Math.random() - 0.5) * 60
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60

    const color = new THREE.Color()
    color.setHSL(Math.random() * 0.4 + 0.5, 0.8, 0.6)
    colors[i * 3] = color.r
    colors[i * 3 + 1] = color.g
    colors[i * 3 + 2] = color.b
  }

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.02
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.9} />
    </points>
  )
}

function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[0, 10, -10]} intensity={0.6} color="#06b6d4" />

      <ParticleField />
      <Stars radius={120} depth={60} count={4000} factor={5} saturation={0} fade speed={0.8} />

      {/* Life Cycle Animation */}
      <LifeCycleIcon position={[-8, 2, -4]} icon="💻" color="#3b82f6" delay={0} />
      <LifeCycleIcon position={[8, -1, -5]} icon="👨‍👧" color="#10b981" delay={2} />
      <LifeCycleIcon position={[-4, -3, -6]} icon="🍽️" color="#f59e0b" delay={4} />
      <LifeCycleIcon position={[5, 4, -3]} icon="😴" color="#8b5cf6" delay={6} />
      <LifeCycleIcon position={[0, 0, -8]} icon="❤️" color="#ef4444" delay={8} />
      <LifeCycleIcon position={[-6, 0, -7]} icon="☕" color="#06b6d4" delay={1} />

      {/* Connecting Lines Animation */}
      <Float speed={0.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Text
          position={[0, -6, -5]}
          fontSize={0.8}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Geist_Bold.json"
        >
          Code → Family → Life → Passion
        </Text>
      </Float>

      <Environment preset="night" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
    </>
  )
}

export default function Portfolio() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])

  const skills = [
    { name: "JavaScript", level: 90, icon: <Code className="w-5 h-5" />, color: "from-yellow-400 to-orange-500" },
    { name: "React.js", level: 95, icon: <Code className="w-5 h-5" />, color: "from-blue-500 to-cyan-500" },
    { name: "TypeScript", level: 85, icon: <Code className="w-5 h-5" />, color: "from-blue-600 to-purple-600" },
    { name: "Node.js", level: 88, icon: <Database className="w-5 h-5" />, color: "from-green-500 to-emerald-500" },
    { name: "React Native", level: 85, icon: <Globe className="w-5 h-5" />, color: "from-purple-500 to-pink-500" },
    { name: "Redux", level: 90, icon: <Code className="w-5 h-5" />, color: "from-violet-500 to-purple-500" },
    { name: "AWS", level: 60, icon: <Database className="w-5 h-5" />, color: "from-orange-500 to-red-500" },
    { name: "Jest/Cypress", level: 88, icon: <Code className="w-5 h-5" />, color: "from-teal-500 to-cyan-500" },
    { name: "Playwright", level: 85, icon: <Code className="w-5 h-5" />, color: "from-pink-500 to-rose-500" },
    { name: "AI/ML Integration", level: 75, icon: <Code className="w-5 h-5" />, color: "from-emerald-400 to-teal-500" },
    { name: "OpenAI APIs", level: 80, icon: <Globe className="w-5 h-5" />, color: "from-violet-400 to-indigo-500" },
    { name: "LangChain", level: 70, icon: <Database className="w-5 h-5" />, color: "from-amber-400 to-orange-500" },
  ]

  const experiences = [
    {
      company: "EPAM Systems",
      position: "Senior Software Engineer",
      duration: "Jul 2023 - Present",
      location: "Bengaluru, India",
      projects: [
        {
          name: "Burberry – CSHUB Modernization",
          duration: "Jul 2023 – Jun 2024",
          achievements: [
            "Built scalable modules in React & TypeScript across CMS, DAM, and Commerce streams",
            "Integrated MediaBeacon workflows for asset metadata management",
            "Migrated legacy content flows from ATG to modern microservices",
            "Achieved 90%+ test coverage using Jest & Cypress for critical paths",
            "Optimized performance, reducing initial load time by ~30%",
          ],
        },
        {
          name: "Atlassian – JIRA Platform Automation",
          duration: "Aug 2024 – Oct 2024",
          achievements: [
            "Developed Playwright-based UI automation framework for JIRA",
            "Integrated tests into CI/CD pipelines, reducing QA time by 40%",
            "Enabled wider adoption of reusable testing libraries across teams",
          ],
        },
        {
          name: "Sherwin-Williams – ERP System",
          duration: "Nov 2024 – Jul 2025",
          achievements: [
            "Architected ERP modules using React and microfrontend architecture",
            "Integrated APIs for order/inventory/customer workflows; ensured WCAG compliance",
            "Designed and documented reusable UI components in a shared design system",
            "Maintained high-quality standards with 90%+ automation coverage",
          ],
        },
      ],
    },
    {
      company: "Xebia IT Architects India Pvt. Ltd.",
      position: "Consultant",
      duration: "Mar 2021 - Jul 2023",
      location: "Gurgaon, India",
      projects: [
        {
          name: "Yes Bank - Banking Application",
          duration: "Mar 2021 - Jul 2023",
          achievements: [
            "Led React Native development for a banking app (Yes Bank)",
            "Implemented CI/CD pipelines and optimized performance using profiling tools",
            "Conducted code reviews and mentored 4 junior developers",
            "Collaborated with QA and DevOps for smooth product launches",
          ],
        },
      ],
    },
    {
      company: "Iginfosystem Pvt. Ltd.",
      position: "Software Developer",
      duration: "Apr 2020 - Mar 2021",
      location: "Gurgaon, India",
      projects: [
        {
          name: "EdTech Platform Development",
          duration: "Apr 2020 - Mar 2021",
          achievements: [
            "Implemented crucial features such as online class streaming, class recording, player integration",
            "Designed reusable and reliable code, contributing significantly to project success",
            "Introduced agile methodologies and development best practices",
            "Collaborated with project managers to select ambitious yet realistic coding milestones",
          ],
        },
      ],
    },
    {
      company: "Techify Solutions Pvt. Ltd.",
      position: "Software Developer",
      duration: "Dec 2019 - Apr 2020",
      location: "Ahmedabad, India",
      projects: [
        {
          name: "JKTyre Advantages & Baadshah",
          duration: "Dec 2019 - Apr 2020",
          achievements: [
            "Spearheaded frontend and backend development as a React & Node developer",
            "Optimized user interface performance by architecting efficient REST calls using React",
            "Revolutionized legacy code bases, bringing them in line with current development standards",
            "Elevated overall application functionality, ensuring a seamless user experience",
          ],
        },
      ],
    },
    {
      company: "GingerWebs Pvt ltd.",
      position: "Junior Frontend Developer",
      duration: "Jan 2018 - Oct 2019",
      location: "Noida, India",
      projects: [
        {
          name: "Study24x7.com Enhancement",
          duration: "Jan 2018 - Oct 2019",
          achievements: [
            "Implemented interactive functionalities, particularly in course creation",
            "Enhanced user experience through feature development",
            "Improved customer satisfaction through prompt issue resolution",
            "Focused on fostering positive user experiences, resulting in increased customer loyalty",
          ],
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen from-gray-900/50 to-black/50 backdrop-blur-sm overflow-x-hidden relative">
      <CursorWave />

      {/* Enhanced Animated Background Gradient - Hostinger Style */}
      <div className="fixed inset-0 opacity-50">
        {/* Base gradient foundation */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-purple-950/80 to-cyan-950/70" />

        {/* Dynamic color shifting overlay */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "linear-gradient(45deg, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.12), rgba(16, 185, 129, 0.10))",
              "linear-gradient(90deg, rgba(219, 39, 119, 0.15), rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.10))",
              "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(219, 39, 119, 0.12), rgba(139, 92, 246, 0.10))",
              "linear-gradient(180deg, rgba(16, 185, 129, 0.15), rgba(245, 158, 11, 0.12), rgba(219, 39, 119, 0.10))",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />

        {/* Subtle animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
            rotate: [0, 180, 360],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Hero Section - Re-envisioned for elegance and attractiveness */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm relative">
        {/* Modern Gradient Background - Directly on section for better blend */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-cyan-800/60" />
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-600/30 via-purple-700/40 to-blue-600/50" />

          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(ellipse at 20% 50%, rgba(139, 92, 246, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 40% 80%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)",
                "radial-gradient(ellipse at 60% 30%, rgba(219, 39, 119, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 30% 70%, rgba(139, 92, 246, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Centered Content and Image Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center px-6 lg:px-8">
          <div className="relative w-full max-w-[100rem] h-full flex flex-col lg:flex-row items-center justify-center">

            {/* Main Profile Image - Central and Prominent */}
            <motion.div
              className="relative order-2 lg:order-1 w-full max-w-lg h-full max-h-[650px] lg:max-h-[750px] flex items-center justify-center z-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, delay: 0.5, type: "spring", stiffness: 100 }}
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl  from-blue-400 via-purple-500 to-cyan-400">
                <Image
                  src="/images/profile.png"
                  alt="Harendra Sharma - Senior Software Engineer"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
              </div>

              {/* Floating Tech Icons around the main image */}
              <motion.div
                className="absolute -top-4 -right-4 w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg z-20"
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Code className="w-7 h-7 text-white" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg z-20"
                animate={{ rotate: -360, scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              >
                <Database className="w-8 h-8 text-white" />
              </motion.div>

              <motion.div
                className="absolute top-1/3 -right-6 w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg z-20"
                animate={{ y: [-8, 8, -8], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
            </motion.div>

            {/* Left Side Content - Positioned relative to image for flow */}
            <div className="order-1 lg:order-2 flex-grow flex flex-col justify-end items-center lg:items-end p-4 lg:p-0 lg:pr-12 text-center lg:text-right">
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="w-fit lg:w-auto mx-auto lg:ml-auto flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30 backdrop-blur-sm mb-6">
                  <motion.div
                    animate={{ rotate: [0, 80, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    className="text-2xl"
                  >
                    👋
                  </motion.div>
                  <span className="text-lg font-medium text-blue-200">Hello, I'm</span>
                </div>
              </motion.div>

              {/* Name */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1 }}
              >
                <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-black leading-tight whitespace-nowrap">
                  <span className="bg-gradient-to-r from-blue-300 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
                    HARENDRA SHARMA
                  </span>
                </h1>
                <motion.div
                  className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-600 to-cyan-500 rounded-full mt-4 mx-auto lg:ml-auto"
                  initial={{ width: 0 }}
                  animate={{ width: "85%" }}
                  transition={{ duration: 1.2, delay: 1.8 }}
                />
              </motion.div>

              {/* Title & Description */}
              <motion.div
                className="space-y-4 my-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.3 }}
              >
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Senior Software Engineer
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl text-gray-200 font-light leading-relaxed">
                  Crafting{" "}
                  <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text font-semibold">
                    AI-powered digital experiences
                  </span>{" "}
                  that bridge{" "}
                  <span className="text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text font-semibold">
                    innovation
                  </span>{" "}
                  and{" "}
                  <span className="text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text font-semibold">
                    intelligent automation
                  </span>
                </p>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex flex-wrap justify-center lg:justify-end gap-6 lg:gap-8 mb-6"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.6 }}
              >
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
                    7+
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-2">
                    15+
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">Projects Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                    5
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">Global Enterprises</div>
                </div>
              </motion.div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.9 }}
              >
                <motion.button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = '/HarendraSharma.pdf';
                    link.download = 'HarendraSharma.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex cursor-pointer items-center justify-center h-12 lg:h-14 px-6 lg:px-8 text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-500"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Resume
                </motion.button>
              </motion.div>


            </div>

            {/* 3D Scene as a subtle background to the entire banner for depth */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-20 pointer-events-none">
              <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <Suspense fallback={null}>
                  <Scene3D />
                </Suspense>
              </Canvas>
            </div>
          </div>
        </div>

        {/* Creative "AI Assistant" Button - Right Corner */}
        <motion.div
          className="fixed top-6 right-6 z-50 group cursor-pointer"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            {/* Main Button */}
            <div className="relative px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl border border-white/20 shadow-2xl backdrop-blur-sm">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>

              {/* Content */}
              <div className="relative flex items-center gap-3">
                {/* Animated Robot Icon */}
                <motion.div
                  className="text-2xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🤖
                </motion.div>

                {/* Text */}
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm leading-tight">AI Assistant</span>
                  <span className="text-purple-200 text-xs font-medium">Ask About ME!</span>
                </div>

                {/* Sparkle Effect */}
                <motion.div
                  className="text-yellow-300 text-sm"
                  animate={{
                    rotate: [0, 180, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  ✨
                </motion.div>
              </div>

              {/* Pulsing border effect */}
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-2xl"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>

            {/* Notification Dot */}
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-white text-xs font-bold">!</span>
            </motion.div>

            {/* Floating particles */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-purple-400 rounded-full"
                style={{
                  top: `${20 + i * 10}%`,
                  right: `${15 + i * 5}%`,
                }}
                animate={{
                  y: [-10, -20, -10],
                  opacity: [0.7, 1, 0.7],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 2 + i * 0.5,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3 }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-300 font-medium animate-pulse">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="w-1 h-3 bg-gradient-to-b from-blue-400 to-purple-500 rounded-full mt-2"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* About Section - Enhanced without an image */}
      <section className="py-20 px-4 bg-gradient-to-b from-black/50 to-gray-900/50 backdrop-blur-sm relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              About Me
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Dive deeper into my professional journey and discover the passion behind my work in software engineering and AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-8 p-8 bg-gray-800/60 rounded-3xl border border-gray-700 shadow-xl"
          >
            <p className="text-lg text-gray-300 leading-relaxed">
              Results-driven **Senior Frontend Engineer** with{" "}
              <span className="text-cyan-400 font-semibold">7+ years</span> of experience designing, developing, and
              optimizing responsive, scalable web/mobile applications. My expertise spans React.js, TypeScript, microfrontend
              architecture, and automated testing, ensuring robust and high-performing solutions.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              I have a proven track record of delivering enterprise-grade solutions for global clients like{" "}
              <span className="text-purple-400 font-semibold">Burberry</span>,{" "}
              <span className="text-blue-400 font-semibold">Atlassian</span>, and{" "}
              <span className="text-green-400 font-semibold">Sherwin-Williams</span>. I excel in cross-functional
              collaboration, ensuring accessibility (WCAG) compliance, and am deeply passionate about writing clean,
              efficient code and crafting user-first interfaces that deliver exceptional experiences.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Looking towards the future, I specialize in integrating{" "}
              <span className="text-emerald-400 font-semibold">AI/ML capabilities</span> into modern applications.
              From implementing chatbots and sophisticated recommendation systems to building intelligent user interfaces
              with cutting-edge technologies like{" "}
              <span className="text-violet-400 font-semibold">OpenAI APIs</span> and{" "}
              <span className="text-amber-400 font-semibold">LangChain</span>, I bridge the gap between traditional
              web development and advanced artificial intelligence, creating innovative and intelligent digital products.
            </p>

            {/* Key Highlights */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <motion.div
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)", borderColor: "#6d28d9" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Award className="w-8 h-8 text-yellow-400 mb-2" />
                <span className="text-sm md:text-base text-gray-300 text-center font-medium">Enterprise Solutions</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)", borderColor: "#059669" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Users className="w-8 h-8 text-green-400 mb-2" />
                <span className="text-sm md:text-base text-gray-300 text-center font-medium">Team Leadership</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)", borderColor: "#3b82f6" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <TrendingUp className="w-8 h-8 text-blue-400 mb-2" />
                <span className="text-sm md:text-base text-gray-300 text-center font-medium">Performance Optimization</span>
              </motion.div>
              <motion.div
                className="flex flex-col items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(55, 65, 81, 0.7)", borderColor: "#ef4444" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Heart className="w-8 h-8 text-red-400 mb-2" />
                <span className="text-sm md:text-base text-gray-300 text-center font-medium">Passion-Driven Dev</span>
              </motion.div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 justify-center">
              {[
                "React Expert",
                "TypeScript Pro",
                "Microfrontends",
                "Performance Optimizer",
                "Team Leader",
                "WCAG Compliance",
                "AI Integration",
                "OpenAI Expert",
              ].map((badge, index) => (
                <motion.div key={badge} whileHover={{ scale: 1.1, rotate: 2 }} whileTap={{ scale: 0.95 }}>
                  <Badge
                    variant="secondary"
                    className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 px-4 py-2 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer text-sm"
                  >
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive technical skills across the full development lifecycle
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                }}
                className="group"
              >
                <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 hover:border-cyan-500/50 relative overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${skill.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  ></div>
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div
                        className="text-blue-400 group-hover:text-cyan-400 transition-colors duration-300"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {skill.icon}
                      </motion.div>
                      <h3 className="text-xl font-semibold text-white group-hover:text-cyan-100 transition-colors duration-300">
                        {skill.name}
                      </h3>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className={`bg-gradient-to-r ${skill.color} h-3 rounded-full relative`}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      </motion.div>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 group-hover:text-gray-300 transition-colors duration-300">
                      {skill.level}% Proficiency
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Professional Journey
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              7+ years of delivering exceptional software solutions across diverse industries
            </p>
          </motion.div>

          <div className="space-y-12">
            {experiences.map((exp, expIndex) => (
              <motion.div
                key={expIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: expIndex * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 mb-8">
                      <div className="md:w-1/3">
                        <div className="flex items-center gap-3 mb-4">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                          >
                            <Building className="w-8 h-8 text-purple-400" />
                          </motion.div>
                          <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                            {exp.company}
                          </h3>
                        </div>
                        <p className="text-xl text-cyan-400 font-semibold mb-2">{exp.position}</p>
                        <div className="flex items-center gap-2 text-gray-400 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{exp.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{exp.location}</span>
                        </div>
                      </div>

                      <div className="md:w-2/3">
                        <div className="space-y-6">
                          {exp.projects.map((project, projectIndex) => (
                            <motion.div
                              key={projectIndex}
                              className="bg-gray-800/30 rounded-lg p-6 border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300"
                              whileHover={{ scale: 1.02, backgroundColor: "rgba(55, 65, 81, 0.4)" }}
                            >
                              <h4 className="text-lg font-semibold text-blue-300 mb-2">{project.name}</h4>
                              <p className="text-sm text-gray-400 mb-4">{project.duration}</p>
                              <ul className="space-y-2">
                                {project.achievements.map((achievement, achievementIndex) => (
                                  <li key={achievementIndex} className="flex items-start gap-2 text-gray-300">
                                    <motion.div
                                      className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mt-2 flex-shrink-0"
                                      whileHover={{ scale: 1.5 }}
                                    />
                                    <span className="text-sm leading-relaxed">{achievement}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 px-4 bg-gradient-to-b from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20 px-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Let&apos;s Connect
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-5xl mx-auto whitespace-nowrap overflow-hidden text-ellipsis">
              🚀 Let's turn bold ideas into brilliant experiences — connect with me to build your next big thing.
            </p>
          </motion.div>

          <div className="w-full flex justify-center mt-12 px-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="w-full max-w-2xl space-y-8"
            >
              {/* Contact Info Cards */}
              <div className="space-y-6">
                {/* Email */}
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.03, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Mail className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-semibold group-hover:text-blue-400 transition-colors duration-300">
                      harendra.jagariya@gmail.com
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.03, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-green-500 to-cyan-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-green-400/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Phone className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-semibold group-hover:text-green-400 transition-colors duration-300">
                      +91 95575 55443
                    </p>
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/60 hover:bg-gray-800/80 transition-all duration-300 group cursor-pointer"
                  whileHover={{ scale: 1.03, x: 8 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-400/50 transition-all duration-300"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MapPin className="w-6 h-6 text-white" />
                  </motion.div>
                  <div>
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white font-semibold group-hover:text-purple-300 transition-colors duration-300">
                      Agra, Uttar Pradesh, India
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-6 mt-6">
                {/* GitHub */}
                <motion.a
                  href="https://github.com/harendra-sharma"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-blue-500/50"
                >
                  <Github className="w-6 h-6 text-white" />
                </motion.a>

                {/* LinkedIn */}
                <motion.a
                  href="https://linkedin.com/in/harendra-sharma-senior-software-engineer"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-blue-500/50"
                >
                  <Linkedin className="w-6 h-6 text-white" />
                </motion.a>

                {/* X (Twitter) */}
                <motion.a
                  href="https://x.com/Harry_jagariya"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 bg-gray-700 hover:bg-black rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-white/20"
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.25 2.03h-4.1l-5.85 7.83L6.42 2.03H.75l7.62 10.13L0 21.97h4.1l6.22-8.32 6.4 8.32h5.67l-8.18-10.88L22.25 2.03z" />
                  </svg>
                </motion.a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4  from-gray-900/50 to-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p
            className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
          >
            © 2024 Harendra Sharma. Crafted with ❤️ and lots of coffee. | MCA Graduate from Graphic Era University
          </motion.p>
        </div>
      </footer>
    </div>
  )
}
