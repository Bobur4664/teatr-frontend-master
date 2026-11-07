import { Link } from "react-router-dom";
import { Facebook, Instagram, Youtube, SendHorizontal, MapPin, Phone, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import { tr } from "@/lib/tr";

export default function Footer() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();

  const brandLine1 = tr(settings?.site_name_line1) || t('nav.footer_title_line1');
  const brandLine2 = tr(settings?.site_name_line2) || t('nav.footer_title_line2');
  const siteName = tr(settings?.site_name) || brandLine2 || '';
  const description = tr(settings?.meta_description) || t('footer.description');
  const year = new Date().getFullYear();
  const address = tr(settings?.address) || t('contact.address_desc');
  const phone = settings?.phone || '';
  const email = settings?.email || '';

  const socials = [
    {
      url: settings?.facebook_url,
      icon: Facebook,
      label: 'Facebook',
    },
    {
      url: settings?.instagram_url,
      icon: Instagram,
      label: 'Instagram',
    },
    {
      url: settings?.youtube_url,
      icon: Youtube,
      label: 'YouTube',
    },
    {
      url: settings?.telegram_url,
      icon: SendHorizontal,
      label: 'Telegram',
    },
  ].filter((s) => !!s.url);

  return (
    <footer className="theatre-footer relative overflow-hidden border-t border-[#e8c27a]/20 bg-deep pt-16 pb-8 text-deep-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <Link to="/" className="block group transition-transform duration-300 hover:translate-x-1 mb-8">
              <span className="block text-xs md:text-sm font-medium uppercase text-deep-foreground/80 mb-1">
                {brandLine1}
              </span>
              <span className="block text-lg md:text-xl font-semibold uppercase text-deep-foreground leading-tight">
                {brandLine2}
              </span>
            </Link>
            <p className="text-deep-foreground/75 text-sm leading-relaxed max-w-xs">
              {description}
            </p>
            {socials.length > 0 && (
              <div className="flex gap-4 pt-2">
                {socials.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-10 h-10 flex items-center justify-center border border-deep-foreground/30 hover:bg-deep-foreground hover:text-deep transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-deep-foreground font-bold uppercase text-sm mb-6 pb-3 border-b border-deep-foreground/20">{t('footer.sections')}</h4>
            <ul className="space-y-4">
              <li><Link to="/news" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('nav.news')}</Link></li>
              <li><Link to="/repertoire" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('nav.repertoire')}</Link></li>
              <li><Link to="/archive" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('nav.archive')}</Link></li>
              <li><Link to="/team" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('nav.team')}</Link></li>
              <li><Link to="/about" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('home.about_badge')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-deep-foreground font-bold uppercase text-sm mb-6 pb-3 border-b border-deep-foreground/20">{t('footer.info')}</h4>
            <ul className="space-y-4">
              <li><Link to="/rules" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('footer.link_rules')}</Link></li>
              <li><Link to="/vacancies" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('footer.link_jobs')}</Link></li>
              <li><Link to="/press" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('footer.link_press')}</Link></li>
              <li><Link to="/open-data" className="text-deep-foreground/80 hover:text-deep-foreground hover:underline underline-offset-4 text-sm transition-colors">{t('footer.link_data')}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-deep-foreground font-bold uppercase text-sm mb-6 pb-3 border-b border-deep-foreground/20">{t('footer.contacts')}</h4>
            <ul className="space-y-4">
              {address && (
                <li className="flex items-start gap-3 text-deep-foreground/80 text-sm">
                  <MapPin className="w-5 h-5 text-deep-foreground shrink-0" />
                  <span>{address}</span>
                </li>
              )}
              {phone && (
                <li className="flex items-center gap-3 text-deep-foreground/80 text-sm">
                  <Phone className="w-5 h-5 text-deep-foreground shrink-0" />
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-deep-foreground transition-colors">{phone}</a>
                </li>
              )}
              {email && (
                <li className="flex items-center gap-3 text-deep-foreground/80 text-sm">
                  <Mail className="w-5 h-5 text-deep-foreground shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-deep-foreground transition-colors">{email}</a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-deep-foreground/20 flex flex-col md:flex-row justify-between items-center gap-6 text-deep-foreground/75 text-xs text-center md:text-left">
          <p className="whitespace-pre-line leading-relaxed">
            {t('footer.copyright', { year, name: siteName })}
          </p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-deep-foreground transition-colors">{t('footer.privacy')}</Link>
            <Link to="/terms" className="hover:text-deep-foreground transition-colors">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
