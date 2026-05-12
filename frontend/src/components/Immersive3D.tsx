/**
 * 🎨 3D Immersive Design System - QRPiPay
 * Inspired by Spatial Computing & Retro Futurism
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import * as THREE from 'three';

// ============================================
// 3D BACKGROUND COMPONENT (Three.js)
// ============================================

export const ImmersiveBackground3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setClearColor(0x0f0f10, 0.1);
    containerRef.current.appendChild(renderer.domElement);

    // Create rotating Pi Network coins
    const geometry = new THREE.IcosahedronGeometry(1, 4);
    const material = new THREE.MeshPhongMaterial({
      color: 0x6b0fb9,
      wireframe: false,
      emissive: 0x9b5dd6,
    });

    const coins: THREE.Mesh[] = [];
    for (let i = 0; i < 5; i++) {
      const coin = new THREE.Mesh(geometry, material.clone());
      coin.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      coin.scale.set(0.5, 0.5, 0.5);
      scene.add(coin);
      coins.push(coin);
    }

    // Lighting
    const light = new THREE.PointLight(0xf5a623, 1);
    light.position.set(5, 5, 5);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    camera.position.z = 5;

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      coins.forEach((coin, index) => {
        coin.rotation.x += 0.005;
        coin.rotation.y += 0.01;
        coin.position.z += Math.sin(Date.now() * 0.0005 + index) * 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    sceneRef.current = scene;

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{
        background: 'linear-gradient(135deg, #0F0F10 0%, #18181B 50%, #27272A 100%)',
      }}
    />
  );
};

// ============================================
// SCROLL-TRIGGERED 3D CARD COMPONENT
// ============================================

export const Immersive3DCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });

  const rotateX = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [-30, 30]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0.8]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        scale,
        opacity,
        perspective: 1200,
      }}
      className={`
        relative p-8 rounded-3xl
        bg-white/5 backdrop-blur-xl
        border border-white/10
        shadow-[0_8px_32px_rgba(107,15,185,0.2)]
        transform-gpu
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

// ============================================
// RETRO FUTURISM TEXT COMPONENT
// ============================================

export const RetroFuturisticText: React.FC<{
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'serif' | 'display';
}> = ({ children, size = 'md', variant = 'display' }) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl',
    xl: 'text-5xl',
  };

  const fontFamily = {
    serif: 'font-serif', // Nostalgic serif
    display: 'font-display', // Modern futuristic
  };

  return (
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        ${sizes[size]}
        ${fontFamily[variant]}
        font-black
        bg-gradient-to-r from-retro-gold via-pi-purple to-pi-orange
        bg-clip-text text-transparent
        drop-shadow-[0_0_10px_rgba(107,15,185,0.3)]
      `}
    >
      {children}
    </motion.span>
  );
};

// ============================================
// RETRO FUTURISM COLOR PALETTE
// ============================================

export const RETRO_FUTURISM_COLORS = {
  // Nostalgic colors
  gold: '#D4AF37',
  copper: '#B87333',
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  
  // Futuristic neons
  neonPurple: '#B026FF',
  neonPink: '#FF10F0',
  neonCyan: '#00D9FF',
  neonGreen: '#39FF14',
  
  // Original Pi Network
  piPurple: '#6B0FB9',
  piOrange: '#F5A623',
};

// ============================================
// SCROLL PARALLAX COMPONENT
// ============================================

export const ScrollParallax: React.FC<{
  children: React.ReactNode;
  offset?: number;
}> = ({ children, offset = 50 }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

  return (
    <motion.div ref={ref} style={{ y }}>
      {children}
    </motion.div>
  );
};

// ============================================
// INTERACTIVE 3D BUTTON
// ============================================

export const Interactive3DButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}> = ({ children, onClick, size = 'md' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  const sizes = {
    sm: 'px-4 py-2',
    md: 'px-8 py-4',
    lg: 'px-12 py-6',
  };

  return (
    <motion.button
      ref={ref}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{
        rotateX: 10,
        rotateY: 10,
        scale: 1.05,
      }}
      whileTap={{ scale: 0.95 }}
      style={{
        perspective: 1200,
      }}
      className={`
        ${sizes[size]}
        relative overflow-hidden
        bg-gradient-to-br from-gold/20 via-pi-purple to-neon-pink/20
        border-2 border-gold/50
        rounded-xl
        font-serif font-bold
        text-white
        shadow-[0_0_20px_rgba(212,175,55,0.3)]
        hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]
        transition-all duration-300
      `}
    >
      {/* Retro glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0"
        animate={isHovered ? { x: ['-100%', '100%'] } : {}}
        transition={{ duration: 0.6 }}
      />
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// ============================================
// IMMERSIVE LOGIN PAGE (Example)
// ============================================

export const ImmersiveLoginPage: React.FC = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* 3D Background */}
      <ImmersiveBackground3D />

      {/* Retro grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(255,215,55,.05)_25%,rgba(255,215,55,.05)_26%,transparent_27%,transparent_74%,rgba(255,215,55,.05)_75%,rgba(255,215,55,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,215,55,.05)_25%,rgba(255,215,55,.05)_26%,transparent_27%,transparent_74%,rgba(255,215,55,.05)_75%,rgba(255,215,55,.05)_76%,transparent_77%,transparent)] bg-[length:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Immersive3DCard className="max-w-md w-full">
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Logo with retro style */}
            <motion.div
              className="text-6xl font-serif drop-shadow-[0_0_20px_rgba(212,175,55,0.5)]"
              animate={{ rotateY: 360 }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🥧
            </motion.div>

            {/* Retro futuristic title */}
            <RetroFuturisticText size="xl" variant="serif">
              QRPiPay
            </RetroFuturisticText>

            <p className="text-white/60 font-serif italic text-lg">
              Accepte Pi en 10 secondes
            </p>

            {/* Interactive 3D Button */}
            <Interactive3DButton size="lg">
              Connexion Pi Network
            </Interactive3DButton>

            {/* Retro accents */}
            <div className="space-y-2">
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="text-xs text-gold/70 font-mono tracking-widest">
                SPATIAL • IMMERSIVE • FUTURISTIC
              </p>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
          </motion.div>
        </Immersive3DCard>
      </div>
    </div>
  );
};

// ============================================
// IMMERSIVE DASHBOARD (Scroll-triggered 3D)
// ============================================

export const ImmersiveDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      <ImmersiveBackground3D />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero section with parallax */}
        <ScrollParallax offset={100}>
          <div className="text-center mb-20">
            <RetroFuturisticText size="xl" variant="display">
              Tableau de Bord Immersif
            </RetroFuturisticText>
            <p className="text-white/60 mt-4 font-serif text-lg italic">
              Contrôlez vos paiements Pi en temps réel
            </p>
          </div>
        </ScrollParallax>

        {/* 3D Stats Cards */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          {[
            { icon: '📊', title: 'Revenue', value: '1,234.56 Pi' },
            { icon: '💳', title: 'Transactions', value: '47' },
            { icon: '📈', title: 'Growth', value: '+23%' },
          ].map((stat, i) => (
            <Immersive3DCard key={i}>
              <motion.div
                className="space-y-4"
                whileHover={{ rotateZ: 5 }}
              >
                <div className="text-5xl">{stat.icon}</div>
                <RetroFuturisticText size="lg" variant="serif">
                  {stat.title}
                </RetroFuturisticText>
                <p className="text-3xl font-bold text-gold">{stat.value}</p>
              </motion.div>
            </Immersive3DCard>
          ))}
        </motion.div>

        {/* Interactive Features Section */}
        <ScrollParallax offset={-50}>
          <Immersive3DCard className="mb-20">
            <div className="space-y-6">
              <RetroFuturisticText size="lg" variant="display">
                Générer QR Code
              </RetroFuturisticText>
              
              <div className="space-y-4">
                <motion.div
                  className="p-4 bg-gradient-to-r from-gold/10 to-transparent rounded-lg border border-gold/20"
                  whileHover={{ scale: 1.02 }}
                >
                  <p className="text-white font-serif">
                    Montant: <span className="text-gold font-bold">1,234.56 Pi</span>
                  </p>
                </motion.div>

                <Interactive3DButton size="md">
                  🔲 Générer QR
                </Interactive3DButton>
              </div>
            </div>
          </Immersive3DCard>
        </ScrollParallax>
      </div>
    </div>
  );
};
