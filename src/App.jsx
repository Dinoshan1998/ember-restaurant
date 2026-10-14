import { useEffect, useRef } from "react";

import { Canvas } from "@react-three/fiber";

import {

  Float,

  Environment,

  ContactShadows,

} from "@react-three/drei";

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import {

  ArrowDown,

  ArrowRight,

  ArrowUpRight,

  Flame,

  Menu,

  X,

} from "lucide-react";

import { useState } from "react";

import FoodScene from "./components/FoodScene";

import "./index.css";


gsap.registerPlugin(ScrollTrigger);


export default function App() {

  const storyRef = useRef(null);

  const menuRef = useRef(null);

  const foodSectionRef = useRef(null);

  const experienceProgress = useRef({ value: 0 });


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  const [scrollProgress, setScrollProgress] = useState(0);


  const [activeSection, setActiveSection] = useState("home");


useEffect(() => {

  const updateScrollProgress = () => {

    const scrollable =

      document.documentElement.scrollHeight - window.innerHeight;


    const progress =

      scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;


    setScrollProgress(Math.min(100, Math.max(0, progress)));

  };


  window.addEventListener("scroll", updateScrollProgress, {

    passive: true,

  });


  updateScrollProgress();


  return () => {

    window.removeEventListener("scroll", updateScrollProgress);

  };

}, []);


useEffect(() => {
  const sectionIds = ["home", "story", "menu", "experience", "reserve"];

  const updateActiveSection = () => {
    const activationLine = window.innerHeight * 0.35;
    let currentSection = "home";

    for (const id of sectionIds) {
      const section = document.getElementById(id);
      if (section && section.getBoundingClientRect().top <= activationLine) {
        currentSection = id;
      }
    }

    setActiveSection(currentSection);
  };

  window.addEventListener("scroll", updateActiveSection, { passive: true });
  window.addEventListener("resize", updateActiveSection);
  updateActiveSection();

  return () => {
    window.removeEventListener("scroll", updateActiveSection);
    window.removeEventListener("resize", updateActiveSection);
  };
}, []);


  useEffect(() => {

    const ctx = gsap.context(() => {

      // Hero text entrance


      // Cinematic reveal for each Experience chapter

      gsap.from(".food-chapter", {

        y: 90,

        opacity: 0,

        duration: 1,

        stagger: 0.25,

        ease: "power3.out",

        scrollTrigger: {

          trigger: ".food-story-copy",

          start: "top 80%",

          end: "bottom 60%",

          toggleActions: "play none none reverse",

        },

      });


      // Reveal each chapter heading and paragraph

      gsap.utils.toArray(".food-chapter h2").forEach((heading) => {

        gsap.from(heading, {

          y: 35,

          opacity: 0,

          duration: 0.9,

          ease: "power3.out",

          scrollTrigger: {

            trigger: heading,

            start: "top 85%",

            toggleActions: "play none none reverse",

          },

        });

      });


      gsap.from(".hero-copy > *", {

        y: 40,

        opacity: 0,

        duration: 1,

        stagger: 0.14,

        ease: "power3.out",

      });


      // Story reveal

      gsap.from(".story-copy > *", {

        y: 65,

        opacity: 0,

        duration: 1,

        stagger: 0.18,

        ease: "power3.out",

        scrollTrigger: {

          trigger: storyRef.current,

          start: "top 75%",

          once: true,

        },

      });


      // Signature dish reveal

      gsap.from(".dish-card", {

        y: 70,

        opacity: 0,

        duration: 0.8,

        stagger: 0.15,

        ease: "power3.out",

        scrollTrigger: {

          trigger: menuRef.current,

          start: "top 75%",

          once: true,

        },

      });


      // Reservation section reveal

      gsap.from(".reserve-content > *", {

        y: 45,

        opacity: 0,

        duration: 0.9,

        stagger: 0.12,

        scrollTrigger: {

          trigger: ".reserve",

          start: "top 75%",

          once: true,

        },

      });


          gsap.to(experienceProgress.current, {

            value: 1,

            ease: "none",

            scrollTrigger: {

              trigger: foodSectionRef.current,

              start: "top top",

              end: "bottom bottom",

              scrub: 1,

            },

          });


      // Keep the food scene visible while the food story scrolls.

      // Pinning only activates on wider screens.

      if (window.matchMedia("(min-width: 800px)").matches) {

        gsap.to(".food-story-visual", {

          scrollTrigger: {

            trigger: foodSectionRef.current,

            start: "top top",

            end: "bottom bottom",

            pin: ".food-story-visual",

            pinSpacing: false,

            scrub: 1,

            invalidateOnRefresh: true,

          },

        });

      }

    });


    return () => ctx.revert();

  }, []);


  const closeMobileMenu = () => setMobileMenuOpen(false);


  return (


    <main>

      <div

    className="scroll-progress"

    style={{ width: `${scrollProgress}%` }}

    aria-hidden="true"

  />


      {/* Navigation */}
      <nav className="navbar">
        <a className="brand" href="#home" onClick={closeMobileMenu}>
          EMBER<span>.</span>
        </a>

        <div className={`nav-links ${mobileMenuOpen ? "nav-open" : ""}`}>
          <a
            href="#story"
            className={activeSection === "story" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Our Story
          </a>
          <a
            href="#menu"
            className={activeSection === "menu" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Menu
          </a>
          <a
            href="#experience"
            className={activeSection === "experience" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Experience
          </a>
          <a
            href="#reserve"
            className={activeSection === "reserve" ? "active" : ""}
            onClick={closeMobileMenu}
          >
            Reservations
          </a>
        </div>

        <a className="nav-cta" href="#reserve" onClick={closeMobileMenu}>
          Book a Table <ArrowUpRight size={15} />
        </a>

        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Hero */}

      <section className="hero" id="home">

        <div className="hero-copy">

          <p className="eyebrow">

            <span /> A NEW KIND OF DINING

          </p>


          <h1>

            Fire meets

            <br />

            <em>flavour.</em>

          </h1>


          <p className="hero-description">

            Bold ingredients. Open flames.

            Unforgettable nights.

          </p>


          <a className="primary-btn" href="#menu">

            Explore our menu <ArrowUpRight size={18} />

          </a>


          <div className="hero-note">

            <Flame size={17} />

            <span>Fire-crafted. Soul-served.</span>

          </div>

        </div>


        <div className="food-canvas">

          <Canvas

            camera={{ position: [0, 0, 5], fov: 40 }}

            dpr={[1, 1.5]}

            gl={{ antialias: true, alpha: true }}

          >

            <ambientLight intensity={1.15} />
            <directionalLight
              position={[4, 6, 5]}
              intensity={2.5}
              castShadow
            />
            <pointLight
              position={[-3, 2, 2]}
              color="#FF8A3D"
              intensity={7}
            />
            <pointLight
              position={[2, 3, 4]}
              color="#FFD49A"
              intensity={4}
            />

            <Float speed={1.5} rotationIntensity={0.12}>

              <FoodScene />

            </Float>


            <ContactShadows

              position={[0, -1.3, 0]}

              opacity={0.35}

              scale={5}

              blur={2}

            />


            <Environment preset="studio" />

          </Canvas>


          <span className="orbit-label">

            CRAFTED WITH PASSION · 01

          </span>

        </div>


        <a className="scroll-cue" href="#story">

          <ArrowDown size={16} /> SCROLL TO DISCOVER

        </a>


        <span className="hero-index">EST. 2026</span>

      </section>


      {/* Brand Story */}

      <section className="story" id="story" ref={storyRef}>

        <div className="story-heading">

          <p className="eyebrow">THE ART OF GOOD FOOD</p>


          <div className="story-copy">

            <h2>

              Not just a meal.

              <br />

              <em>A moment.</em>

            </h2>


            <p>

              From the first flame to the final bite,

              every detail is crafted to bring people

              together around unforgettable food.

            </p>


            <a className="text-link" href="#experience">

              Discover our philosophy <ArrowRight size={16} />

            </a>

          </div>

        </div>


        <div className="story-stats">

          <div>

            <strong>01</strong>

            <span>Passion in every plate</span>

          </div>

          <div>

            <strong>100%</strong>

            <span>Made with care</span>

          </div>

          <div>

            <strong>∞</strong>

            <span>Moments worth sharing</span>

          </div>

        </div>

      </section>


      {/* Scroll-driven food experience */}

      <section

        className="food-story"

        id="experience"

        ref={foodSectionRef}

      >


<div className="food-story-visual">

  <Canvas

    camera={{ position: [0, 0, 5], fov: 40 }}

    dpr={[1, 1.5]}

    gl={{ antialias: true, alpha: true }}

  >

    <ambientLight intensity={1.15} />
    <directionalLight
      position={[4, 6, 5]}
      intensity={2.5}
      castShadow
    />
    <pointLight
      position={[-3, 2, 2]}
      color="#FF8A3D"
      intensity={7}
    />
    <pointLight
      position={[2, 3, 4]}
      color="#FFD49A"
      intensity={4}
    />

    <FoodScene scrollProgressRef={experienceProgress} />


    <Environment preset="studio" />

  </Canvas>


  <div className="food-story-glow" />


  <div className="food-story-label">

    <span>THE SIGNATURE</span>

    <span>01 / 03</span>

  </div>

</div>


        <div className="food-story-copy">

          <article className="food-chapter">

            <p className="eyebrow">CHAPTER 01 — THE CRAFT</p>

            <h2>

              Every layer

              <br />

              tells a story.

            </h2>

            <p>

              Carefully selected ingredients come

              together in a balance of texture, flavour

              and fire.

            </p>

          </article>


          <article className="food-chapter">

            <p className="eyebrow">CHAPTER 02 — THE FIRE</p>

            <h2>

              Heat brings

              <br />

              it to life.

            </h2>

            <p>

              Rich aromas, beautiful textures and

              unforgettable flavour in every bite.

            </p>

          </article>


          <article className="food-chapter">

            <p className="eyebrow">CHAPTER 03 — THE MOMENT</p>

            <h2>

              Made to be

              <br />

              remembered.

            </h2>

            <p>

              More than a dish. An experience worth

              coming back for.

            </p>

          </article>

        </div>

      </section>


      {/* Menu */}

      <section className="menu-section" id="menu" ref={menuRef}>

        <div className="section-topline">

          <p className="eyebrow">MADE TO BE REMEMBERED</p>

          <span>OUR SIGNATURE SELECTION</span>

        </div>


        <h2>

          Discover the <em>menu.</em>

        </h2>


        <p className="menu-intro">

          Seasonal ingredients. Thoughtful craft.

          Flavours that stay with you.

        </p>


        <div className="menu-grid">

          <article className="dish-card">

            <div className="dish-image dish-image-one">

              <span className="dish-number">01</span>

            </div>

            <div className="dish-info">

              <div>

                <h3>Ember Signature</h3>

                <p>Smoky, rich, unforgettable.</p>

              </div>

              <span>CHEF'S PICK</span>

            </div>

          </article>


          <article className="dish-card">

            <div className="dish-image dish-image-two">

              <span className="dish-number">02</span>

            </div>

            <div className="dish-info">

              <div>

                <h3>Golden Crust</h3>

                <p>Fresh from the fire.</p>

              </div>

              <span>HOUSE FAVOURITE</span>

            </div>

          </article>


          <article className="dish-card">

            <div className="dish-image dish-image-three">

              <span className="dish-number">03</span>

            </div>

            <div className="dish-info">

              <div>

                <h3>Garden Fresh</h3>

                <p>Bright, vibrant, balanced.</p>

              </div>

              <span>SEASONAL</span>

            </div>

          </article>

        </div>


        <a className="primary-btn" href="#reserve">

          Experience Ember <ArrowUpRight size={17} />

        </a>

      </section>


      {/* Reservation */}


<section className="reserve" id="reserve">

  <div className="reserve-content">

    <p className="eyebrow">YOUR TABLE IS WAITING</p>

    <h2>Make it<br /><em>a night.</em></h2>

    <p>Good food. Warm company. A night worth remembering.</p>


    <form

      className="reservation-form"

      onSubmit={(event) => {

        event.preventDefault();


        const form = event.currentTarget;

        if (!form.reportValidity()) return;


        const data = new FormData(form);

        const subject = encodeURIComponent("EMBER Table Reservation");

        const body = encodeURIComponent(

          `Name: ${data.get("name")}\n` +

          `Email: ${data.get("email")}\n` +

          `Date: ${data.get("date")}\n` +

          `Time: ${data.get("time")}\n` +

          `Guests: ${data.get("guests")}\n` +

          `Requests: ${data.get("requests") || "None"}`

        );


        window.location.href =

          `mailto:dinoshan277@gmail.com?subject=${subject}&body=${body}`;

      }}

    >

      <div className="reservation-fields">

        <label>

          Your name

          <input name="name" type="text" placeholder="Full name" required />

        </label>


        <label>

          Email address

          <input name="email" type="email" placeholder="you@example.com" required />

        </label>


        <label>

          Booking date

          <input name="date" type="date" min={new Date().toISOString().split("T")[0]} required />

        </label>


        <label>

          Preferred time

          <select name="time" defaultValue="" required>

            <option value="" disabled>Select a time</option>

            <option value="12:00 PM">12:00 PM</option>

            <option value="1:00 PM">1:00 PM</option>

            <option value="6:00 PM">6:00 PM</option>

            <option value="7:00 PM">7:00 PM</option>

            <option value="8:00 PM">8:00 PM</option>

            <option value="9:00 PM">9:00 PM</option>

          </select>

        </label>


        <label>

          Number of guests

          <select name="guests" defaultValue="2" required>

            <option value="1">1 guest</option>

            <option value="2">2 guests</option>

            <option value="3">3 guests</option>

            <option value="4">4 guests</option>

            <option value="5">5 guests</option>

            <option value="6">6 guests</option>

            <option value="7+">7+ guests</option>

          </select>

        </label>


        <label className="reservation-full">

          Special requests (optional)

          <textarea

            name="requests"

            rows="3"

            placeholder="Any special occasion or requests?"

          />

        </label>

      </div>


      <button className="primary-btn reservation-submit" type="submit">

        Request a Reservation ↗

      </button>


      <p className="reservation-note">

        This demo opens your email app. Your table is not confirmed until the restaurant responds.

      </p>

    </form>

  </div>

</section>


      {/* Footer */}

      <footer className="footer">

        <a className="brand" href="#home">

          EMBER<span>.</span>

        </a>

        <p>GOOD FOOD. GREAT STORIES.</p>

        <a href="#home">BACK TO TOP ↑</a>

        <span>© 2026 EMBER. DEMO CONCEPT.</span>

      </footer>

    </main>

  );

}
