import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Quote, Send, X, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useApi } from "@/hooks/useApi";
import { getComments, postComment } from "@/lib/api";
import { useSiteText } from "@/hooks/useSiteText";

export default function Testimonials() {
  const { t } = useTranslation();
  const siteText = useSiteText();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: ""
  });

  const { data: apiComments } = useApi(() => getComments(), []);

  // Testimonials come from the API only (approved comments for this theater).
  const displayComments = apiComments && apiComments.length > 0 ? apiComments : [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await postComment({
        full_name: formData.name,
        position: formData.role,
        comment: formData.message,
      });
      
      setIsSubmitted(true);
      setFormData({ name: "", role: "", message: "" });
      
      setTimeout(() => {
        setIsSubmitted(false);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error adding feedback: ", error);
      alert(t('common.error', "Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="home-section home-section--testimonials home-band home-band--testimonials relative overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      
      <div className="home-shell relative z-10">
        <div className="home-section-heading home-section-heading--center">
          <span className="home-eyebrow">
            {siteText('home_testimonials_badge', 'home.testimonials_badge')}
          </span>
          <h2 className="home-display-title">
            {siteText('home_testimonials_title', 'home.testimonials_title')}
          </h2>
        </div>

        {displayComments.length > 0 && (
        <div className="home-quotes-grid">
          {displayComments.map((item: any) => (
            <Card key={item.id} className="home-quote-card bg-card border-border shadow-sm p-8 hover:shadow-xl transition-all duration-500 relative group overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
              <Quote className="w-10 h-10 text-primary/20 mb-6 group-hover:text-primary transition-colors duration-300" />
              <p className="text-muted-foreground font-light leading-relaxed mb-8 relative z-10 italic">
                "{item.comment}"
              </p>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-md rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.full_name)}&background=random`} alt={item.full_name} className="w-12 h-12 rounded-full border border-border relative z-10 object-cover" />
                </div>
                <div>
                  <h4 className="text-foreground font-bold">{item.full_name}</h4>
                  <p className="text-primary text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-80">{item.position}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        )}

        <div className="home-feedback-action">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="home-feedback-button group bg-primary hover:bg-primary-hover text-primary-foreground px-10 py-6 h-auto text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <MessageSquareQuote className="w-4 h-4 mr-3 group-hover:rotate-12 transition-transform" />
            {t('home.leave_feedback', 'Fikr bildirish')}
          </Button>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden p-8 md:p-12"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {isSubmitted ? (
                <div className="text-center space-y-6 py-8 animate-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-foreground">{t('feedback.success_title', 'Rahmat!')}</h3>
                  <p className="text-muted-foreground">{t('feedback.success_message', "Sizning fikringiz muvaffaqiyatli yuborildi va tez orada ko'rib chiqiladi.")}</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-serif font-bold text-foreground">{t('feedback.modal_title', 'Fikringizni qoldiring')}</h3>
                    <p className="text-muted-foreground text-sm font-light">{t('feedback.modal_subtitle', 'Biz uchun har bir tomoshabinning fikri muhim.')}</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('feedback.label_name', "To'liq ismingiz")}</label>
                      <input 
                        required
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={t('feedback.placeholder_name', "Masalan: Aziz Vohidov")}
                        className="w-full bg-secondary/30 border border-border/50 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('feedback.label_role', "Kasbingiz yoki maqomingiz")}</label>
                      <input 
                        type="text" 
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder={t('feedback.placeholder_role', "Masalan: Talaba yoki San'at muxlisi")}
                        className="w-full bg-secondary/30 border border-border/50 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">{t('feedback.label_message', "Fikringiz")}</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={t('feedback.placeholder_message', "Teatrimiz haqida nima deb o'ylaysiz?...")}
                        className="w-full bg-secondary/30 border border-border/50 rounded-xl px-5 py-4 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                      />
                    </div>

                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-7 h-auto text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20 transition-all duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t('feedback.btn_sending', 'Yuborilmoqda...')}
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-3" />
                          {t('feedback.btn_send', 'Yuborish')}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
