import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Eye, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { tr } from "@/lib/tr";

interface ActorCardProps {
  actor: any;
  variant?: "default" | "home";
  key?: string | number;
}

export default function ActorCard({ actor, variant = "default" }: ActorCardProps) {
  const { t } = useTranslation();
  const isHome = variant === "home";

  const [likes, setLikes] = useState(actor.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <div className={`team-member-card group relative ${isHome ? "actor-card-home" : ""}`}>
      <Card className={`actor-card overflow-hidden ${isHome ? "actor-card--home" : ""}`}>
        <Link to={`/actor/${actor.id}`} className="actor-card-link">
          <div className="actor-card-image-wrap">
            {actor.image ? (
              <img
                src={actor.image}
                alt={tr(actor.name)}
                className="actor-card-image"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="actor-card-image actor-card-image--empty" aria-hidden="true">
                <span>{tr(actor.name)?.slice(0, 1) || "T"}</span>
              </div>
            )}
            <div className="actor-card-image-shade" />
            <span className="actor-card-index">{String(actor.id).padStart(2, "0")}</span>

            <div className="actor-card-copy">
              <span className="actor-card-role">{tr(actor.role) || t("team_page.badge")}</span>
              <h3>{tr(actor.name)}</h3>
              <div className="actor-card-meta">
                <span><Heart aria-hidden="true" />{likes}</span>
                <span><Eye aria-hidden="true" />{actor.views || 0}</span>
                <span className="actor-card-open"><ArrowUpRight aria-hidden="true" /></span>
              </div>
            </div>
          </div>
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleLike}
          aria-label={isLiked ? t("actor.liked") : t("actor.like")}
          aria-pressed={isLiked}
          className={`actor-card-like ${isLiked ? "is-liked" : ""}`}
        >
          <Heart className={isLiked ? "fill-current" : ""} />
        </Button>
      </Card>
    </div>
  );
}
