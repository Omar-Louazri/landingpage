"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Image from "next/image";
import Link from "next/link";
import { 
  Star,
  ChevronDown,
  ArrowRight
} from "lucide-react";
import type { WebsiteLocale } from "./website-content";
import styles from "./page.module.css";

export default function ProductPage({ content }: { content: WebsiteLocale }) {
  const [purchaseType, setPurchaseType] = useState("abonnement");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightCycleIndex, setLightCycleIndex] = useState(0);

  const productImages = content.media.product_images
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  const lightCycleImages = content.media.light_cycle_images
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const fallbackImage = {
    image: content.hero.image,
    order: 0,
    title: content.general.title,
    visible: true,
  };

  useEffect(() => {
    if (activeImageIndex !== 0 || lightCycleImages.length < 2) {
      return;
    }

    const interval = setInterval(() => {
      setLightCycleIndex((prev) => (prev + 1) % lightCycleImages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [activeImageIndex, lightCycleImages.length]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const currentProduct = productImages[activeImageIndex] ?? productImages[0] ?? fallbackImage;
  const currentDisplayImage = activeImageIndex === 0
    ? (lightCycleImages[lightCycleIndex] ?? currentProduct)
    : currentProduct;

  const videoList = content.media.videos
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const certificates = content.media.certificates
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const steps = content.how_it_works
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const faqs = content.faq
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const services = content.offer.services_included
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);
  const equipment = content.offer.equipment_included
    .filter((item) => item.visible)
    .sort((a, b) => a.order - b.order);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#1a1a1a", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      {/* Top Banner - Marquee */}
      {content.offer.announcement && <div className={styles.announcementBar}>
        <div className={styles.marqueeContent}>
          {content.offer.announcement}
        </div>
      </div>}

      {/* Header (Exact structure as initial) */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.leftNav} />

          <a href="https://pillqare.com" className={styles.logo}>
            <Image src="/optimized/logo.png" alt="Pillqare Logo" width={150} height={50} style={{ height: "50px", width: "auto" }} loading="eager" />
          </a>

          <div className={styles.rightNav}>
            <div className={styles.flagIcon}>
              <div className={styles.flagBlue} />
              <div className={styles.flagWhite} />
              <div className={styles.flagRed} />
            </div>

          </div>
        </div>
      </header>

      {/* Product Section */}
      <section className={`${styles.container} ${styles.productSection}`}>
        {/* Left: Images */}
        <div className={styles.imageGallery}>
          <div
            className={`${styles.mainImagePlaceholder} ${styles.animFadeInUp}`}
            style={{ position: "relative" }}
          >
            <AnimatePresence initial={false}>
              <motion.img 
                key={currentDisplayImage.image}
                src={currentDisplayImage.image}
                alt={currentDisplayImage.title}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => {
                  const swipeThreshold = 50;
                  if (info.offset.x > swipeThreshold) {
                    setActiveImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
                  } else if (info.offset.x < -swipeThreshold) {
                    setActiveImageIndex((prev) => (prev + 1) % productImages.length);
                  }
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover", 
                  borderRadius: "0",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  cursor: "grab"
                }} 
                whileTap={{ cursor: "grabbing" }}
              />
            </AnimatePresence>
            {content.offer.top_discount && <div
              style={{ 
                position: "absolute", 
                top: "20px", 
                left: "20px", 
                backgroundColor: "#ef4444", 
                color: "white", 
                padding: "4px 10px", 
                borderRadius: "0", 
                fontSize: "0.85rem", 
                fontWeight: "700", 
                boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)",
                zIndex: 10
              }}
            >
              {content.offer.top_discount}
            </div>}
            <div 
              style={{ 
                position: "absolute", 
                bottom: "20px", 
                right: "20px", 
                display: "flex", 
                gap: "12px", 
                alignItems: "center",
                zIndex: 10
              }}
            >
              {certificates.map((certificate) => (
                <span
                  key={certificate.image}
                  style={{ position: "relative", width: "107px", height: "60px" }}
                >
                  <Image
                    src={certificate.image}
                    alt={certificate.title}
                    fill
                    sizes="107px"
                    style={{ objectFit: "contain" }}
                  />
                </span>
              ))}
            </div>
            <div 
              style={{ 
                position: "absolute", 
                top: "20px", 
                right: "20px", 
                width: "80px", 
                height: "80px", 
                borderRadius: "50%", 
                overflow: "hidden", 
                border: "4px solid white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                zIndex: 10
              }}
            >
              <Image src={content.media.badge_image} alt={content.general.title} fill sizes="80px" style={{ objectFit: "cover" }} />
            </div>
          </div>
          <div className={styles.thumbnailGallery}>
            {productImages.map((image, i) => (
              <div 
                key={image.image}
                role="button"
                aria-label={image.title}
                tabIndex={0}
                className={`${styles.thumbnailPlaceholder} ${activeImageIndex === i ? styles.activeThumbnail : ''}`}
                onClick={() => setActiveImageIndex(i)}
                onKeyDown={(event) => event.key === "Enter" && setActiveImageIndex(i)}
                style={{ 
                  backgroundImage: `url(${image.image})`,
                  backgroundSize: 'cover', 
                  backgroundPosition: 'center', 
                  cursor: 'pointer',
                  border: activeImageIndex === i ? '2px solid #3b82f6' : '1px solid #ddd'
                }}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details (Preserving exact original structure) */}
        <div className={styles.productInfo}>
          <div className={styles.animFadeInLeft1}>
            <p style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
              {content.hero.eyebrow}
            </p>
            <h1 className={styles.productTitle}>{content.hero.title}</h1>
            {content.hero.description && <p className={styles.productSubtitle}>{content.hero.description}</p>}
            
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginTop: "24px", marginBottom: "24px" }}>
              {videoList.map((video, i) => (
                <motion.div 
                  key={video.url}
                  onClick={() => setActiveVideo(video.url)}
                  animate={i === 0 ? { 
                    scale: [1, 1.15, 1],
                    boxShadow: ["0 4px 12px rgba(0,0,0,0.1)", "0 8px 30px rgba(34,197,94,0.9)", "0 4px 12px rgba(0,0,0,0.1)"],
                    borderColor: ["#fff", "#22c55e", "#fff"]
                  } : {}}
                  transition={i === 0 ? { 
                    duration: 1.5, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  } : {}}
                  style={{ 
                    width: "64px", 
                    height: "64px", 
                    borderRadius: "50%", 
                    backgroundColor: "#f5f3ef", 
                    border: "2px solid #fff",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    overflow: "hidden",
                    position: "relative"
                  }}
                >
                  <video 
                    src={video.url}
                    muted 
                    loop 
                    autoPlay 
                    playsInline
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                  />
                  {/* Play icon overlay */}
                  <div style={{ position: "absolute", zIndex: 2, backgroundColor: "rgba(0,0,0,0.3)", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "0", height: "0", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid #fff", marginLeft: "4px" }} />
                  </div>
                </motion.div>
              ))}
            </div>

            <div className={styles.reviews} style={{ marginTop: '8px', marginBottom: '16px' }}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="#eab308" stroke="none" />
                ))}
              </div>
              <span>{content.general.rating_score}/5 {content.general.rating_count}</span>
            </div>


            {/* <p className={styles.productSubtitle} style={{ marginTop: '16px' }}>Une technologie discrète pour une sécurité totale.</p> */}
          </div>

          {/* <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={styles.description}
          >
            <p>
              Services inclus : Suivi médical personnalisé, rappels automatiques et support 24/7. Une connexion internet est requise.
            </p>
            <div className={styles.benefitsList}>
              <div className={styles.benefitItem}>
                <CheckCircle2 size={20} className={styles.benefitIcon} />
                <span>Distribution automatisée des médicaments</span>
              </div>
              <div className={styles.benefitItem}>
                <CheckCircle2 size={20} className={styles.benefitIcon} />
                <span>Suivi à distance via application mobile</span>
              </div>
              <div className={styles.benefitItem}>
                <CheckCircle2 size={20} className={styles.benefitIcon} />
                <span>Alertes SMS à un proche en cas d’oubli</span>
              </div>
              <div className={styles.benefitItem}>
                <CheckCircle2 size={20} className={styles.benefitIcon} />
                <span>Télésurveillance active 24h/24 et 7j/7</span>
              </div>
            </div>
          </motion.div> */}

          {/* Formats (Kept structure, adapted labels) */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.optionsSection}
          >
            <span className={styles.optionLabel}>Garantie & Support</span>
            <div className={styles.buttonGroup}>
              <button 
                className={`${styles.optionBtn} ${format === 'standard' ? styles.active : ''}`}
                onClick={() => setFormat('standard')}
              >
                Garantie 2 ans incluse
              </button>
            </div>
          </motion.div> */}

          {/* Durée (Kept structure, adapted labels) */}
          {/* <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.optionsSection}
          >
            <span className={styles.optionLabel}>Engagement</span>
            <div className={styles.buttonGroup}>
              {['12 mois'].map((d) => (
                <button 
                  key={d}
                  className={`${styles.optionBtn} ${duration === d ? styles.active : ''}`}
                  onClick={() => setDuration(d)}
                >
                  {d}
                </button>
              ))}
            </div>
          </motion.div> */}

          {/* Purchase Type (Kept structure, adapted to Achat vs Location) */}
          <div
            className={`${styles.optionsSection} ${styles.animFadeInUp5}`}
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <div 
              className={`${styles.purchaseType} ${purchaseType === 'abonnement' ? styles.active : ''}`}
              onClick={() => setPurchaseType('abonnement')}
              style={{ textAlign: "left" }}
            >
              <div className={styles.purchaseTypeHeader}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span className={styles.purchaseTypeTitle}>{content.offer.title}</span>
                  <span style={{ fontSize: "0.85rem", color: "#666" }}>{content.offer.commitment}</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className={styles.purchaseTypePrice}>{content.offer.price} {content.offer.period}</span>
                  <div className={styles.discountBadge} style={{ marginTop: "4px" }}>{content.offer.type}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", color: "#4a4a4a", marginTop: "16px", lineHeight: "1.6", borderTop: "1px solid #eee", paddingTop: "16px", textAlign: "left", width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "24px" }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "700", marginBottom: "8px", color: "#1a1a1a" }}>Services inclus :</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {services.map((item) => <li key={item.title}>✓ {item.title}</li>)}
                    </ul>
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: "700", marginBottom: "8px", color: "#1a1a1a" }}>Votre équipement :</p>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {equipment.map((item) => <li key={item.title}>✓ {item.title}</li>)}
                    </ul>
                  </div>
                </div>

                {content.offer.promo_message && <p style={{ color: "#15803d", fontWeight: "600", marginTop: "16px" }}>{content.offer.promo_message}</p>}
                {content.offer.legal_note && <p style={{ marginTop: "8px", color: "#666", fontSize: "0.75rem", fontStyle: "italic" }}>{content.offer.legal_note}</p>}
              </div>
            </div>
          </div>

          {/* Promo Note & CTA */}
          <div style={{ marginTop: "16px", width: "100%", maxWidth: "500px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "0.85rem", color: "#b45309", marginBottom: "8px", fontWeight: "600", textAlign: "center", width: "100%" }}>
              {content.offer.scarcity_message}
            </p>
            <a
              href={content.offer.buy_link}
              className={`${styles.applePayBtn} ${styles.animFadeInUp7}`}
            >
              {content.offer.buy_button_text}
            </a>
          </div>
        </div>
      </section>



      {/* About Section / Timeline (Exact initial structure) */}
      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              Comment fonctionne<br />PillQare ?
            </h2>

          </div>

          <div className={styles.timeline}>
            {steps.map((step) => (
              <div className={styles.timelineItem} key={step.title}>
                <div className={styles.timelineIllustrationWrapper}>
                  <div className={styles.colorIllustrationPlaceholder}>
                    <Image src={step.image} alt={step.title} width={600} height={600} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                  </div>
                </div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineTitle}>{step.title}</div>
                  <div className={styles.timelineDesc}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section (Exact initial structure) */}
      <section className={styles.faqSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Questions Fréquentes</h2>
            <p className={styles.sectionSubtitle}>
              Retrouvez l&apos;essentiel à savoir sur votre futur pilulier Pillqare.
            </p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, index) => (
              <div 
                key={faq.title}
                className={styles.faqItem}
                onClick={() => toggleFaq(index)}
              >
                <div className={styles.faqQuestion}>
                  <span>{faq.title}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden" }}
                    >
                      <p className={styles.faqAnswer}>{faq.description}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            key="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "rgba(0, 0, 0, 0.9)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onClick={() => setActiveVideo(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveVideo(null)}
              style={{
                position: "absolute",
                top: "24px",
                right: "24px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "none",
                borderRadius: "50%",
                width: "48px",
                height: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                cursor: "pointer",
                zIndex: 10000,
                backdropFilter: "blur(10px)"
              }}
            >
              <ArrowRight size={24} />
            </button>

            {/* Video container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                position: "relative",
                height: "85vh",
                width: "auto",
                aspectRatio: "9/16",
                backgroundColor: "#000",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                src={activeVideo}
                autoPlay
                loop
                playsInline
                style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className={styles.mainFooter}>
        <div className={styles.container}>
          <div className={styles.footerContent}>
            <div className={styles.footerBranding}>
              <Image src="/optimized/logo.png" alt="Pillqare Logo" width={120} height={40} style={{ height: "40px", width: "auto", marginBottom: "16px" }} />
              <p>{content.footer.description}</p>
            </div>
            <div className={styles.footerLinks}>
              {content.footer.links
                .filter((link) => link.visible)
                .sort((a, b) => a.order - b.order)
                .map((link) => <Link href={link.href} key={link.href}>{link.label}</Link>)}
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>{content.footer.copyright}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
