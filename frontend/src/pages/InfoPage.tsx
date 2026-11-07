import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import BackButton from "@/components/common/BackButton";
import { FileText, Briefcase, Mic, Database, Download, Mail, Phone, ExternalLink, X, FileCheck, Share2, Printer, Camera, ArrowLeft, FileType, CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGallery, getInfoPage, getInfoDocuments, getVacancies } from "@/lib/api";
import { useApi } from "@/hooks/useApi";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Lightbox from "@/components/ui/Lightbox";
import { tr } from "@/lib/tr";

interface InfoDocument {
  id: number;
  page_type: string;
  section: string;
  title: Record<string, string>;
  summary: Record<string, string>;
  content: Record<string, string>;
  file: string | null;
  external_url: string;
  date: string | null;
  order: number;
}

interface Vacancy {
  id: number;
  title: Record<string, string>;
  department: Record<string, string>;
  description: Record<string, string>;
  requirements: Record<string, string>;
  deadline: string | null;
  apply_email: string;
  order: number;
}

interface InfoPageProps {
  type: 'rules' | 'vacancies' | 'press' | 'open_data' | 'privacy' | 'terms';
}

export default function InfoPage({ type }: InfoPageProps) {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isPressKitOpen, setIsPressKitOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  const { data: gallery } = useApi(() => getGallery(), []);
  const { data: infoPage } = useApi<{ title?: Record<string, string>; content?: Record<string, string> } | null>(
    () => getInfoPage(type).catch(() => null),
    null,
    [type]
  );
  const { data: documents } = useApi<InfoDocument[]>(
    () => getInfoDocuments(type).catch(() => []),
    [],
    [type]
  );
  const { data: vacancies } = useApi<Vacancy[]>(
    () => (type === 'vacancies' ? getVacancies() : Promise.resolve([])).catch(() => []),
    [],
    [type]
  );

  const docsBySection = (sec: string) => documents.filter((d) => d.section === sec);
  const pressDocuments = documents;

  const backendTitle = tr(infoPage?.title);
  const backendContent = tr(infoPage?.content);

  const getIcon = () => {
    switch (type) {
      case 'rules': return <FileText className="w-12 h-12 text-primary" />;
      case 'vacancies': return <Briefcase className="w-12 h-12 text-primary" />;
      case 'press': return <Mic className="w-12 h-12 text-primary" />;
      case 'open_data': return <Database className="w-12 h-12 text-primary" />;
      case 'privacy': return <FileCheck className="w-12 h-12 text-primary" />;
      case 'terms': return <CheckCircle2 className="w-12 h-12 text-primary" />;
    }
  };

  const renderDocLink = (doc: InfoDocument) => {
    if (doc.file) {
      return (
        <a href={doc.file} target="_blank" rel="noopener noreferrer" aria-label={tr(doc.title)} className="text-muted-foreground hover:text-primary transition-colors">
          <Download className="w-5 h-5" />
        </a>
      );
    }
    if (doc.external_url) {
      return (
        <a href={doc.external_url} target="_blank" rel="noopener noreferrer" aria-label={tr(doc.title)} className="text-muted-foreground hover:text-primary transition-colors">
          <ExternalLink className="w-5 h-5" />
        </a>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (type) {
      case 'rules':
        return (
          <div className="space-y-12">
            {documents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-6 bg-muted border border-border group hover:border-primary/50 transition-all rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-bold text-foreground">{tr(doc.title)}</span>
                    </div>
                    {renderDocLink(doc)}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'vacancies':
        if (vacancies.length === 0) {
          return (
            <div className="text-center py-20 bg-muted/50 border border-dashed border-border rounded-2xl space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-4 max-w-md mx-auto">
                <h3 className="text-2xl font-serif font-bold text-foreground">{t('info.vacancies.no_vacancies')}</h3>
                <p className="text-muted-foreground">
                  {t('info.vacancies.contact_hr')}
                </p>
                {settings?.email && (
                  <Button
                    onClick={() => window.location.href = `mailto:${settings.email}?subject=Resume submission`}
                    className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 py-6 uppercase tracking-widest text-xs font-bold h-auto shadow-lg"
                  >
                    <Mail className="w-4 h-4 mr-2" /> {t('info.vacancies.submit_resume')}
                  </Button>
                )}
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vacancies.map((vac) => {
              const title = tr(vac.title);
              const department = tr(vac.department);
              const description = tr(vac.description);
              const requirements = tr(vac.requirements);
              const targetEmail = vac.apply_email || settings?.email || '';
              return (
                <div key={vac.id} className="p-8 bg-muted border border-border rounded-lg space-y-5 hover:border-primary/50 transition-colors">
                  <div className="space-y-2">
                    {department && (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{department}</span>
                    )}
                    <h3 className="text-2xl font-serif font-bold text-foreground leading-tight">{title}</h3>
                  </div>
                  {description && <p className="text-muted-foreground text-sm leading-relaxed font-light whitespace-pre-wrap">{description}</p>}
                  {requirements && (
                    <div className="pt-2 border-t border-border/40 space-y-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{t('info.vacancies.requirements', 'Talablar')}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed font-light whitespace-pre-wrap">{requirements}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {vac.deadline && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>{vac.deadline}</span>
                      </div>
                    )}
                    {targetEmail && (
                      <Button
                        onClick={() => window.location.href = `mailto:${targetEmail}?subject=${encodeURIComponent(title)}`}
                        className="bg-primary hover:bg-primary/90 text-white rounded-none uppercase tracking-widest text-[10px] font-bold h-auto px-5 py-3"
                      >
                        <Mail className="w-3.5 h-3.5 mr-2" /> {t('info.vacancies.submit_resume')}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      case 'press': {
        const pressContactPhone = settings?.phone || t('info.press.phone');
        const pressContactEmail = settings?.email || t('info.press.email');
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div className="md:col-span-2 space-y-8 text-left">
              <div className="prose prose-invert max-w-none text-left">
                <h3 className="text-2xl font-serif font-bold text-foreground mb-4">{t('info.press.press_kit_title')}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">
                  {t('info.press.press_kit_desc')}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => setIsPressKitOpen(true)}
                  disabled={pressDocuments.length === 0}
                  className="border-border hover:bg-muted py-8 flex items-center justify-between rounded-none px-6 transition-all group disabled:opacity-50"
                >
                  <span className="uppercase tracking-widest text-[10px] font-bold">{t('info.press.btn_press_release')}</span>
                  <FileText className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                   onClick={() => setSelectedImage(0)}
                  className="border-border hover:bg-muted py-8 flex items-center justify-between rounded-none px-6 transition-all group"
                >
                  <span className="uppercase tracking-widest text-[10px] font-bold">{t('info.press.btn_gallery')}</span>
                  <Camera className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="p-8 bg-muted border border-border space-y-6 text-left">
              <h4 className="text-lg font-serif font-bold text-foreground">{t('info.press.contact_person')}</h4>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{pressContactPhone}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{pressContactEmail}</span>
                </div>
              </div>
              {pressContactEmail && (
                <Button
                  onClick={() => window.location.href = `mailto:${pressContactEmail}?subject=Accreditation Request`}
                  className="w-full bg-primary hover:bg-primary/90 rounded-none uppercase tracking-widest text-[10px] font-bold py-6 h-auto shadow-lg shadow-primary/20"
                >
                  {t('info.press.accreditation')}
                </Button>
              )}
            </div>
          </div>
        );
      }
      case 'open_data': {
        const finance = docsBySection('finance');
        const procurement = docsBySection('procurement');
        const groups = [
          { key: 'finance', label: t('info.open_data.section_finance'), docs: finance },
          { key: 'procurement', label: t('info.open_data.section_procurement'), docs: procurement },
        ].filter((g) => g.docs.length > 0);
        if (groups.length === 0) return null;
        return (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {groups.map((group) => (
                <div key={group.key} className="p-8 bg-muted border border-border space-y-4 hover:border-primary/50 transition-colors rounded-lg">
                  <h4 className="text-lg font-bold uppercase tracking-widest text-xs text-primary">{group.label}</h4>
                  <div className="space-y-3">
                    {group.docs.map((doc) => (
                      <div key={doc.id} className="text-muted-foreground flex items-center justify-between gap-4">
                        <span className="flex-1 min-w-0 truncate">{tr(doc.title)}</span>
                        {renderDocLink(doc)}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
      case 'privacy':
      case 'terms':
        return (
          <div className="space-y-12 max-w-4xl">
            <div className="space-y-16">
              {[1, 2, 3].map((num) => (
                <div key={num} className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold">{num}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-foreground">
                      {t(`info.${type}.section_${num}`)}
                    </h3>
                  </div>
                  <div className="pl-14">
                    <p className="text-muted-foreground leading-relaxed text-lg font-light">
                      {t(`info.${type}.content_${num}`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="pt-12 pb-32">
      <div className="container mx-auto px-4 mb-8">
        <BackButton />
      </div>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-4xl mb-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center"
          >
            {getIcon()}
          </motion.div>
          <div className="space-y-4">
            <h1 className="page-title">
              {backendTitle || t(`info.${type}.title`)}
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl leading-relaxed">
              {t(`info.${type}.subtitle`)}
            </p>
          </div>
        </div>

        {backendContent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="prose prose-invert max-w-4xl mb-16 whitespace-pre-wrap text-muted-foreground leading-relaxed text-lg font-light"
          >
            {backendContent}
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Press Kit Modal */}
      <AnimatePresence>
        {isPressKitOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-background border border-border w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative"
            >
              <button 
                onClick={() => setIsPressKitOpen(false)}
                className="absolute top-6 right-6 p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors z-20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {!selectedDocId ? (
                    <motion.div
                      key="list"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="container mx-auto max-w-4xl space-y-8"
                    >
                      <div className="text-center space-y-4 mb-12">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <FileType className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-3xl font-serif font-bold">{t('info.press.btn_press_release')}</h2>
                        <p className="text-muted-foreground font-light italic">{t('info.press.select_doc')}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pressDocuments.map((doc) => (
                          <button
                            key={doc.id}
                            onClick={() => setSelectedDocId(doc.id)}
                            className="bg-muted/50 border border-border p-6 text-left hover:border-primary/50 transition-all hover:bg-muted group flex items-start gap-4"
                          >
                            <div className="w-12 h-12 bg-background flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                              <FileText className="w-6 h-6 text-primary/60 group-hover:text-primary" />
                            </div>
                            <div className="space-y-1 flex-1">
                              {tr(doc.summary) && (
                                <span className="text-[10px] uppercase tracking-widest text-primary font-bold">{tr(doc.summary)}</span>
                              )}
                              <h3 className="text-lg font-bold text-foreground leading-tight">{tr(doc.title)}</h3>
                              {doc.date && <p className="text-xs text-muted-foreground">{doc.date}</p>}
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (() => {
                    const selectedDoc = pressDocuments.find((d) => d.id === selectedDocId);
                    if (!selectedDoc) return null;
                    return (
                      <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="container mx-auto max-w-4xl space-y-12"
                      >
                        <button
                           onClick={() => setSelectedDocId(null)}
                           className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all mb-8"
                        >
                          <ArrowLeft className="w-4 h-4" /> {t('common.back')}
                        </button>

                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-8 h-8 text-primary" />
                          </div>
                          {tr(selectedDoc.summary) && (
                            <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">{tr(selectedDoc.summary)}</span>
                          )}
                          <h2 className="section-title">
                            {tr(selectedDoc.title)}
                          </h2>
                          {selectedDoc.date && (
                            <p className="text-muted-foreground">{selectedDoc.date}</p>
                          )}
                        </div>

                        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground font-light leading-relaxed whitespace-pre-wrap">
                          <p className="text-lg leading-relaxed">
                            {tr(selectedDoc.content)}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-8">
                          {selectedDoc.file && (
                            <a href={selectedDoc.file} target="_blank" rel="noopener noreferrer" className="flex-1">
                              <Button className="w-full bg-primary hover:bg-primary/90 py-6 h-auto rounded-none uppercase tracking-widest text-[10px] font-bold shadow-lg shadow-primary/20">
                                <Download className="w-4 h-4 mr-2" /> {t('common.download')}
                              </Button>
                            </a>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="flex-1 border-border hover:bg-muted py-6 h-auto rounded-none uppercase tracking-widest text-[10px] font-bold"
                          >
                            <Printer className="w-4 h-4 mr-2" /> {t('common.print')}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Lightbox
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        images={gallery.map((i: any) => i.image)}
        currentIndex={selectedImage || 0}
        onNavigate={(idx) => setSelectedImage(idx)}
      />
    </div>
  );
}
