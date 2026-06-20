import { useCallback, useEffect, useRef, useState } from "react";
import logo from "./assets/chezmus-logo.jpg";
import howdy from "./assets/howdy.jpg";
import howdyCard from "./assets/howdy-card.jpg";
import dermano from "./assets/le dermano.png";
import dermanoCard from "./assets/dermano-card.jpg";
import buffalo from "./assets/buffalo.png";
import buffaloCard from "./assets/buffalo-card.jpg";
import adana from "./assets/Kebab_adana.jpg";
import studentMenu from "./assets/MENU étudiant.jpg";
import burgerChezMus from "./assets/Le burger Chez Mus.jpg";
import "./ChezMus.css";

const ADDRESS_URL = "https://maps.google.com/?q=Rue+Elisa+Dumonceau+69+4040+Herstal";
const INSTAGRAM_URL = "https://instagram.com/chezmusburger";
const EMAIL_URL = "mailto:contact@chezmus.be";
const heroFood = "/images/home-food-hero.png";

const BURGERS = [
  ["Le Howdy", "Steak de bœuf, sauce burger, cheddar, cornichons, oignons caramélisés", "7,50 €", "11 €"],
  ["Le Dermano", "Steak de bœuf, sauce BBQ, cheddar, bacon, aubergine grillée, oignons caramélisés", "8,50 €", "12 €"],
  ["Le Buffalo", "2 steaks de bœuf, sauce BBQ, cheddar, bacon, cornichons, oignons caramélisés", "9,50 €", "13 €"],
  ["Le Cow-Boy", "Steak de bœuf, sauce poivre, cheddar, bacon, oignons caramélisés et frits", "9 €", "12,50 €"],
  ["Le Wanted", "Poulet pané, sauce mayo, cheddar, cornichons, oignons frits, salade", "6,50 €", "10 €"],
  ["Le Pêcheur", "Poisson pané, sauce tartare, cheddar, oignons rouges, cornichons, salade", "7,50 €", "11 €"],
  ["Le Cactus", "Falafel, sauce aïoli, oignons caramélisés, cornichons, salade", "7,50 €", "11 €"],
  ["Supplément", "", "0,50 €", ""],
];

const KEBABS = [
  ["Adana", "Brochette de hachis de bœuf piquant et crudités", "9 €", "13,50 €"],
  ["Urfa", "Brochette de hachis de bœuf non piquant et crudités", "9 €", "13,50 €"],
  ["Poulet", "Brochette de poulet mariné et crudités", "8 €", "12,50 €"],
  ["Supplément", "", "0,50 €", ""],
];

const EXTRAS = [
  ["Frites", "3 €"],
  ["Sauce", "0,80 €"],
  ["Nugget", "1 €"],
  ["Canette 33 cl", "2,50 €"],
  ["Eau / Kizilay", "2 €"],
  ["Ayran fait maison", "3 €"],
  ["Dessert", "3,50 €"],
];

const FEATURED = [
  { name: "Le Howdy", category: "Burger", description: "Steak de bœuf, cheddar, cornichons et oignons caramélisés.", price: "7,50 €", image: howdyCard, position: "50% 67%" },
  { name: "Le Dermano", category: "Burger", description: "Sauce BBQ, cheddar, bacon, aubergine grillée et oignons.", price: "8,50 €", image: dermanoCard, position: "50% 68%" },
  { name: "Le Buffalo", category: "Double steak", description: "BBQ, cheddar, bacon, cornichons et oignons caramélisés.", price: "9,50 €", image: buffaloCard, position: "50% 66%" },
  { name: "Adana", category: "Kebab grillé", description: "Hachis de bœuf piquant, crudités et cuisson minute.", price: "9 €", image: heroFood, position: "16% 68%" },
];

const GALLERY = [
  { src: heroFood, alt: "Burger, dürüm kebab et frites Chez Mus", position: "58% 66%" },
  { src: dermano, alt: "Burger Dermano devant Chez Mus", position: "50% 64%" },
  { src: buffalo, alt: "Burger Buffalo Chez Mus", position: "50% 65%" },
  { src: howdy, alt: "Burger Howdy Chez Mus", position: "50% 66%" },
  { src: adana, alt: "Kebab Adana en préparation", position: "50% 61%" },
  { src: burgerChezMus, alt: "Burger Chez Mus", position: "50% 58%" },
  { src: dermanoCard, alt: "Détail du burger Dermano", position: "50% 67%" },
];

function ActionLink({ className = "", children, ...props }) {
  return <a className={`action-link ${className}`} {...props}>{children}</a>;
}

function Header({ onMenuOpen }) {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const closeButtonRef = useRef(null);
  const brandRef = useRef(null);
  const overlayRef = useRef(null);
  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }));
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-open", open);
    if (!open) return () => document.body.classList.remove("nav-open");

    closeButtonRef.current?.focus();
    const backgroundElements = [document.querySelector("main"), document.querySelector(".site-footer"), ...document.querySelectorAll(".site-header > :not(.mobile-nav-overlay)")].filter(Boolean);
    const previousAria = new Map(backgroundElements.map((element) => [element, element.getAttribute("aria-hidden")]));
    backgroundElements.forEach((element) => { element.inert = true; element.setAttribute("aria-hidden", "true"); });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = [...overlayRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktopQuery = window.matchMedia("(min-width: 920px)");
    const onDesktop = (event) => {
      if (!event.matches) return;
      close(false);
      window.requestAnimationFrame(() => brandRef.current?.focus({ preventScroll: true }));
    };
    document.addEventListener("keydown", onKeyDown);
    desktopQuery.addEventListener("change", onDesktop);

    return () => {
      document.body.classList.remove("nav-open");
      backgroundElements.forEach((element) => {
        element.inert = false;
        const ariaValue = previousAria.get(element);
        if (ariaValue === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaValue);
      });
      document.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", onDesktop);
    };
  }, [open, close]);

  return (
    <header className="site-header">
      <nav className="desktop-nav desktop-nav-left" aria-label="Navigation principale">
        <a href="#accueil">Accueil</a><a href="#menu-complet">La carte</a><a href="#etudiant">Menu étudiant</a>
      </nav>
      <a ref={brandRef} className="brand" href="#accueil" aria-label="Chez Mus, retour à l’accueil"><img src={logo} alt="Chez Mus Burger & Kebab" /></a>
      <nav className="desktop-nav desktop-nav-right" aria-label="Navigation secondaire">
        <a href="#galerie">Galerie</a><a href="#esprit">L’esprit</a><a href="#contact">Contact</a>
      </nav>
      <button className="header-menu-button" type="button" onClick={onMenuOpen}>Voir le menu</button>
      <button ref={menuButtonRef} className="menu-word" type="button" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="mobile-navigation-overlay" aria-haspopup="dialog" aria-label="Ouvrir la navigation">
        <span aria-hidden="true">☰</span>
      </button>
      {open ? (
        <div ref={overlayRef} className="mobile-nav-overlay" id="mobile-navigation-overlay" role="dialog" aria-modal="true" aria-label="Navigation mobile">
          <nav className="mobile-nav">
            <div className="mobile-nav-head"><img src={logo} alt="Chez Mus" /><button ref={closeButtonRef} className="mobile-nav-close" type="button" onClick={() => close()} aria-label="Fermer la navigation">×</button></div>
            <div className="mobile-nav-links"><a href="#accueil" onClick={() => close()}>Accueil</a><a href="#menu-complet" onClick={() => close()}>La carte</a><a href="#etudiant" onClick={() => close()}>Menu étudiant</a><a href="#galerie" onClick={() => close()}>Galerie</a><a href="#esprit" onClick={() => close()}>L’esprit Chez Mus</a><a href="#contact" onClick={() => close()}>Contact</a></div>
            <button type="button" onClick={() => { close(); window.requestAnimationFrame(onMenuOpen); }}>Voir la carte complète</button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function MenuSheet({ open, onClose }) {
  const sheetRef = useRef(null);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previousFocusRef.current = document.activeElement;
    window.requestAnimationFrame(() => closeButtonRef.current?.focus());
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [...sheetRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("modal-open");
      const previousFocus = previousFocusRef.current;
      if (previousFocus?.isConnected) window.requestAnimationFrame(() => previousFocus.focus({ preventScroll: true }));
    };
  }, [open, onClose]);

  if (!open) return null;
  const renderItems = (items) => items.map(([name, description, solo, menu]) => (
    <li className="menu-sheet-item" key={name}><div><h3>{name}</h3><p>{description}</p></div><div className="menu-prices"><span><small>Solo</small>{solo}</span><span><small>Menu</small>{menu}</span></div></li>
  ));

  return (
    <div className="menu-modal" role="dialog" aria-modal="true" aria-labelledby="menu-title" onMouseDown={onClose}>
      <div ref={sheetRef} className="menu-sheet" onMouseDown={(event) => event.stopPropagation()}>
        <div className="menu-sheet-head"><div><p>Chez Mus · Herstal</p><h2 id="menu-title">La carte</h2></div><button ref={closeButtonRef} type="button" onClick={onClose}>Fermer</button></div>
        <div className="menu-sheet-columns">
          <section><h2>Burgers</h2><ul>{renderItems(BURGERS)}</ul></section>
          <section><h2>Kebabs</h2><ul>{renderItems(KEBABS)}</ul></section>
          <section><h2>Formules</h2><div className="menu-note"><strong>Menu étudiant</strong><span>Burger menu ou dürüm kebab avec frites et canette offerte · Du lundi au vendredi, 12h—18h · Carte étudiante valide.</span></div><div className="menu-note"><strong>Menu Kido · 7,50 €</strong><span>Nuggets (4 pièces), petite frite, sauce et jus de fruit.</span></div></section>
          <section><h2>Extras</h2><ul className="extras-list">{EXTRAS.map(([name, price]) => <li key={name}><span>{name}</span><strong>{price}</strong></li>)}</ul></section>
        </div>
        <div className="menu-sheet-footer"><p>Merci de signaler toute allergie avant de passer commande.</p></div>
      </div>
    </div>
  );
}

function Hero({ onMenuOpen }) {
  return (
    <section className="hero-section" id="accueil">
      <picture className="hero-backdrop" aria-hidden="true">
        <source media="(max-width: 919px)" srcSet="/assets/western-generated/hero-western-backdrop-mobile.webp" />
        <img src="/assets/western-generated/hero-western-backdrop-desktop.webp" alt="" />
      </picture>
      <div className="hero-copy">
        <p className="location-line">★ Herstal · 100% halal · Since 2026 ★</p>
        <h1><span>Des burgers généreux et</span><span>des kebabs grillés</span><span>à Herstal.</span></h1>
        <p className="hero-intro">Le saloon burger-kebab de Herstal : des recettes maison, des portions franches et un vrai caractère Chez Mus.</p>
        <div className="hero-buttons"><button className="primary-button" type="button" onClick={onMenuOpen}>Voir la carte</button><button className="action-link secondary-link" type="button" onClick={onMenuOpen}>Commander</button></div>
        <a className="hero-student-link" href="#etudiant">Découvrir le menu étudiant</a>
      </div>
      <div className="hero-art"><img src="/assets/western-generated/hero-food-cutout-clean.webp" alt="Burger, deux dürüm kebabs et frites Chez Mus" /></div>
      <div className="hero-info" aria-label="Informations pratiques">
        <div><b aria-hidden="true">⌖</b><small>Adresse</small><strong>Rue Elisa Dumonceau 69</strong><span>4040 Herstal</span></div>
        <div><b aria-hidden="true">◷</b><small>Horaires</small><strong>Bientôt disponibles</strong><span>Suivez-nous pour les infos</span></div>
        <div><b aria-hidden="true">☎</b><small>Téléphone</small><strong>Bientôt disponible</strong><span>Contact via Instagram</span></div>
        <div><b aria-hidden="true">▣</b><small>Service</small><strong>Sur place</strong><span>Et à emporter</span></div>
        <a href={ADDRESS_URL} target="_blank" rel="noreferrer">Itinéraire</a>
      </div>
    </section>
  );
}

function FeaturedMenu() {
  return (
    <section className="featured-section" id="carte">
      <div className="western-heading"><p>Les classiques qui font revenir</p><h2>Nos incontournables</h2></div>
      <div className="product-grid">
        {FEATURED.map((item) => (
          <article className="product-card" key={item.name}>
            <div className="product-photo"><img src={item.image} alt={`${item.name} Chez Mus`} style={{ objectPosition: item.position }} /></div>
            <div className="product-content"><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div className="product-price"><strong>{item.price}</strong><span className="price-stars" aria-hidden="true">★ · ★ · ★</span></div></div>
          </article>
        ))}
      </div>
      <a className="outline-button" href="#menu-complet">Voir toute la carte</a>
    </section>
  );
}

function MenuRow({ item, labels = ["Solo", "Menu"] }) {
  const [name, description, firstPrice, secondPrice] = item;
  return (
    <li className="full-menu-row">
      <div className="full-menu-copy"><h3>{name}</h3>{description ? <p>{description}</p> : null}</div>
      <div className="full-menu-prices">
        {firstPrice ? <span><small>{labels[0]}</small><strong>{firstPrice}</strong></span> : null}
        {secondPrice ? <span><small>{labels[1]}</small><strong>{secondPrice}</strong></span> : null}
      </div>
    </li>
  );
}

function AccordionGroup({ groupId, title, meta, open, onToggle, children }) {
  const buttonId = `menu-accordion-${groupId}`;
  const panelId = `${buttonId}-panel`;

  return (
    <section className={`full-menu-group${open ? " is-open" : ""}`}>
      <button className="accordion-trigger" id={buttonId} type="button" aria-expanded={open} aria-controls={panelId} onClick={() => onToggle(groupId)}>
        <span className="accordion-star" aria-hidden="true">★</span>
        <span className="accordion-title">{title}</span>
        {meta ? <small>{meta}</small> : null}
        <span className="accordion-indicator" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div className="accordion-panel" id={panelId} role="region" aria-labelledby={buttonId} aria-hidden={!open} inert={!open}>
        <div className="accordion-panel-inner"><div className="accordion-panel-content">{children}</div></div>
      </div>
    </section>
  );
}

function FullMenu({ onMenuOpen }) {
  const [openGroup, setOpenGroup] = useState("burgers");
  const toggleGroup = (groupId) => setOpenGroup((current) => current === groupId ? null : groupId);

  return (
    <section className="full-menu-section" id="menu-complet">
      <div className="western-heading"><p>Tout le goût Chez Mus</p><h2>La carte</h2></div>
      <p className="full-menu-intro">Ouvrez une catégorie pour découvrir tous les produits et leurs prix.</p>
      <div className="full-menu-board">
        <AccordionGroup groupId="burgers" title="Burgers" meta="Simple · Menu" open={openGroup === "burgers"} onToggle={toggleGroup}>
          <ul className="full-menu-burger-list">{BURGERS.map((item) => <MenuRow item={item} key={item[0]} />)}</ul>
          <p className="full-menu-note">Menu = frites + sauce</p>
        </AccordionGroup>
        <AccordionGroup groupId="kebabs" title="Kebabs" meta="Medium · Large" open={openGroup === "kebabs"} onToggle={toggleGroup}>
          <ul>{KEBABS.map((item) => <MenuRow item={item} labels={["Medium", "Large"]} key={item[0]} />)}</ul>
        </AccordionGroup>
        <AccordionGroup groupId="menus" title="Menus" open={openGroup === "menus"} onToggle={toggleGroup}>
          <div className="menu-special"><div><h3>Menu étudiant</h3><p>Burger menu ou dürüm kebab avec frites et canette offerte.</p></div><small>Du lundi au vendredi · 12h—18h · Carte étudiante valide</small></div>
          <div className="menu-special"><div><h3>Menu Kido</h3><p>Nuggets (4 pièces), petite frite, sauce et jus de fruit.</p></div><strong>7,50 €</strong></div>
        </AccordionGroup>
        <AccordionGroup groupId="extras" title="Extras" open={openGroup === "extras"} onToggle={toggleGroup}>
          <ul className="extras-list">{EXTRAS.map(([name, price]) => <li key={name}><span>{name}</span><strong>{price}</strong></li>)}</ul>
        </AccordionGroup>
      </div>
      <button className="action-link full-menu-cta" type="button" onClick={onMenuOpen}>Commander</button>
    </section>
  );
}

function StudentOffer() {
  return (
    <section className="student-section" id="etudiant">
      <div className="student-poster">
        <div className="student-copy"><p>Menu étudiant</p><h2>Le chef cowboy est devenu fou&nbsp;!</h2><p className="student-description">Une formule généreuse pensée pour les vraies pauses entre les cours.</p><div className="student-offer-line"><strong>Canette offerte</strong><span>Avec un burger menu ou un dürüm kebab accompagné de frites</span></div><dl><div><dt>Quand</dt><dd>Du lundi au vendredi</dd></div><div><dt>Heures</dt><dd>12h — 18h</dd></div><div><dt>Condition</dt><dd>Carte étudiante valide</dd></div></dl><ActionLink href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Découvrir le menu étudiant</ActionLink></div>
        <div className="student-photo"><img src={studentMenu} alt="Menu étudiant Chez Mus avec burger, frites et canette" /><div className="student-badge" aria-hidden="true"><span>Menu</span><strong>étudiant</strong></div></div>
      </div>
    </section>
  );
}

function GalleryStory() {
  return (
    <section className="gallery-story" id="galerie">
      <div className="western-heading western-heading-light"><p>Du grill à l’assiette</p><h2>Galerie</h2></div>
      <div className="gallery-grid">{GALLERY.map((item, index) => <figure key={`${item.alt}-${index}`}><img src={item.src} alt={item.alt} style={{ objectPosition: item.position }} /></figure>)}</div>
      <ActionLink className="gallery-button" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Voir toute la galerie</ActionLink>
      <div className="story-panel" id="esprit">
        <div className="story-copy"><p>L’esprit Chez Mus</p><h2>Plus qu’un restaurant, une identité.</h2><p>Chez Mus, c’est l’alliance du goût, de la générosité et d’un accueil chaleureux. Des produits frais, des recettes maison et une cuisine pensée pour rassembler.</p><ActionLink className="story-button" href={INSTAGRAM_URL} target="_blank" rel="noreferrer">Découvrir notre histoire</ActionLink></div>
        <div className="story-rider" aria-hidden="true"><img src="/assets/western-generated/rider-desert.webp" alt="" /></div>
        <div className="story-contact" id="contact"><p>Contactez-nous</p><h2>On est là pour vous.</h2><address><span><b aria-hidden="true">⌖</b>Rue Elisa Dumonceau 69<br />4040 Herstal</span><span><b aria-hidden="true">☎</b>Bientôt disponible</span><a href={EMAIL_URL}><b aria-hidden="true">✉</b>contact@chezmus.be</a></address><div className="social-links"><a href={INSTAGRAM_URL} target="_blank" rel="noreferrer" aria-label="Instagram">IG</a><a href={EMAIL_URL} aria-label="E-mail">@</a></div></div>
      </div>
    </section>
  );
}

function Footer({ onMenuOpen }) {
  return (
    <footer className="site-footer">
      <div className="footer-stars" aria-hidden="true">★</div>
      <div className="footer-callout"><div><span>Une faim de cowboy ?</span><strong>Choisis ton menu. On s’occupe du reste.</strong></div><div className="footer-callout-actions"><button className="action-link" type="button" onClick={onMenuOpen}>Commander</button><ActionLink className="footer-outline-link" href={ADDRESS_URL} target="_blank" rel="noreferrer">Nous trouver</ActionLink></div></div>
      <div className="footer-proof"><img src={logo} alt="Chez Mus" /><strong>★ Herstal · 100% halal · Since 2026 ★</strong></div>
      <div className="footer-meta"><p>© 2026 Chez Mus — Tous droits réservés.</p><div className="footer-links"><a href="#mentions-legales" id="mentions-legales">Mentions légales</a><a href="#confidentialite" id="confidentialite">Politique de confidentialité</a><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Retour en haut</button></div></div>
    </footer>
  );
}

export default function ChezMus() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = useCallback(() => setMenuOpen(true), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  return <div className="chezmus-site"><Header onMenuOpen={openMenu} /><main><Hero onMenuOpen={openMenu} /><FeaturedMenu /><FullMenu onMenuOpen={openMenu} /><StudentOffer /><GalleryStory /></main><Footer onMenuOpen={openMenu} /><MenuSheet open={menuOpen} onClose={closeMenu} /></div>;
}
