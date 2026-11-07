import { useEffect, useRef, type CSSProperties } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export interface TimelineMilestone {
  key: string | number;
  year: string;
  title: string;
  description: string;
}

interface TimelineProps {
  title: string;
  periodLabel: string;
  milestones: TimelineMilestone[];
  backgroundColor?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  duration?: number;
  scrollHint?: string;
}

export default function Timeline({
  title,
  periodLabel,
  milestones,
  backgroundColor = "var(--color-background, #0a0a0a)",
  textColor = "var(--color-foreground, #ffffff)",
  mutedTextColor = "var(--color-muted-foreground, #a1a1aa)",
  activeColor = "#ff5f00",
  imageUrl,
  imageAlt = "",
  duration = 1.4,
  scrollHint = "Davom ettirish uchun pastga aylantiring",
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || milestones.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia(section);

    media.add("(min-width: 768px)", () => {
      const viewport = section.querySelector<HTMLElement>(".timeline-viewport");
      const track = section.querySelector<HTMLElement>(".timeline-track");
      const progress = section.querySelector<HTMLElement>(".timeline-progress-fill");
      if (!viewport || !track || !progress) return;

      const distance = () => Math.max(track.scrollWidth - viewport.clientWidth, 0);
      if (distance() === 0) return;

      const horizontalScroll = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: duration,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      horizontalScroll
        .to(track, { x: () => -distance() }, 0)
        .to(progress, { scaleX: 1 }, 0);

      const cards = gsap.utils.toArray<HTMLElement>(".timeline-milestone", section);
      cards.forEach((card) => {
        const content = card.querySelector<HTMLElement>(".timeline-milestone-card");
        const marker = card.querySelector<HTMLElement>(".timeline-milestone-marker");
        if (!content || !marker) return;

        gsap.fromTo(
          content,
          { y: 18, opacity: 0.45 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: "left 72%",
              end: "center center",
              scrub: true,
            },
          },
        );
        gsap.fromTo(
          marker,
          { scale: 0.75 },
          {
            scale: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              containerAnimation: horizontalScroll,
              start: "left 72%",
              end: "center center",
              scrub: true,
            },
          },
        );
      });
    });

    media.add("(max-width: 767px)", () => {
      section.querySelectorAll<HTMLElement>(".timeline-milestone").forEach((card) => {
        gsap.fromTo(
          card,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.65,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          },
        );
      });
    });

    return () => media.revert();
  }, [duration, milestones.length]);

  if (milestones.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="timeline-section"
      style={{
        "--timeline-background": backgroundColor,
        "--timeline-text": textColor,
        "--timeline-muted": mutedTextColor,
        "--timeline-accent": activeColor,
      } as CSSProperties}
      aria-label={title}
    >
      <div className="timeline-stage">
        <div className="timeline-header">
          <div className="timeline-header-copy">
            <span className="timeline-period">{periodLabel}</span>
            <h2>{title}</h2>
          </div>
          {imageUrl && (
            <div className="timeline-header-image">
              <img src={imageUrl} alt={imageAlt} loading="lazy" referrerPolicy="no-referrer" />
              <span aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="timeline-viewport">
          <div className="timeline-track">
            <div className="timeline-track-line" aria-hidden="true" />
            {milestones.map((milestone, index) => (
              <article
                className={`timeline-milestone ${index % 2 === 0 ? "is-top" : "is-bottom"}`}
                key={milestone.key}
              >
                <div className="timeline-milestone-card">
                  <span className="timeline-milestone-index">{String(index + 1).padStart(2, "0")}</span>
                  <p className="timeline-milestone-year">{milestone.year}</p>
                  <h3>{milestone.title}</h3>
                  <p className="timeline-milestone-description">{milestone.description}</p>
                  <ArrowRight className="timeline-milestone-arrow" aria-hidden="true" />
                </div>
                <div className="timeline-milestone-marker" aria-hidden="true">
                  <span>{milestone.year.slice(-2)}</span>
                </div>
                <span className="timeline-milestone-stem" aria-hidden="true" />
              </article>
            ))}
          </div>
        </div>

        <div className="timeline-footer">
          <div className="timeline-progress" aria-hidden="true">
            <span className="timeline-progress-fill" />
          </div>
          <span className="timeline-scroll-hint"><ArrowDown aria-hidden="true" />{scrollHint}</span>
        </div>
      </div>
    </section>
  );
}
