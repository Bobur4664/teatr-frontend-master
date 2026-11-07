import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";

interface BackButtonProps {
  className?: string;
  variant?: "ghost" | "outline" | "default" | "secondary";
}

export default function BackButton({ className = "", variant = "ghost" }: BackButtonProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-6 ${className}`}
    >
      <Button
        variant={variant}
        onClick={() => navigate(-1)}
        className="group flex items-center gap-2 px-0 hover:bg-transparent text-muted-foreground hover:text-primary transition-all"
      >
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold uppercase tracking-[0.2em]">
          {t('common.back')}
        </span>
      </Button>
    </motion.div>
  );
}
