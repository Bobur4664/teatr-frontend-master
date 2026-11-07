import { motion } from "motion/react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

export default function Logo({
  className = "",
  size = 48,
  animated = true
}: LogoProps) {
  const { settings } = useSiteSettings();
  const src = settings?.logo || "/logo.jpg";

  return (
    <motion.div
      className={`relative flex items-center justify-center bg-white rounded-full shadow-lg border border-border/10 ${className}`}
      style={{ width: size, height: size }}
      initial={animated ? { opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={animated ? { scale: 1.08, rotate: 3 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="w-[80%] h-[80%] relative radius-1">
        <img
          src={src}
          alt="Logo"
          className="w-full h-full object-contain"
        />
      </div>
    </motion.div>
  );
}
