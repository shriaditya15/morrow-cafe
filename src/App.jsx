import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const [status, setStatus] = useState("idle");
  const [claimCode, setClaimCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [validationError, setValidationError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setValidationError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();

    if (!name) {
      setValidationError("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setValidationError(
        "Please enter a valid 10-digit Indian phone number."
      );
      return;
    }

    setValidationError("");
    setStatus("loading");

    try {
      const response = await fetch("/api/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to process your request.");
      }

      setClaimCode(data.claimCode);
      setCopied(false);
      setStatus("success");
    } catch (error) {
      console.error("Claim error:", error);
      setStatus("error");
    }
  };

  const copyCode = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(claimCode);
      } else {
        const textArea = document.createElement("textarea");

        textArea.value = claimCode;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        document.execCommand("copy");

        document.body.removeChild(textArea);
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const claimAnother = () => {
    setStatus("idle");
    setClaimCode("");
    setCopied(false);
    setValidationError("");

    setFormData({
      name: "",
      phone: "",
    });
  };

  return (
    <main className="page">
      {/* HERO */}
      <section className="hero">
        <nav className="navbar">
          <div className="brand">
            <span className="brand-mark">M</span>
            <span>MORROW</span>
          </div>

          <span className="location">SECTOR 104 · NOIDA</span>
        </nav>

        <div className="hero-content">
          <p className="eyebrow">
            A little something for your next visit
          </p>

          <h1>
            Your next coffee
            <br />
            <em>just got better.</em>
          </h1>

          <p className="hero-text">
            Enjoy ₹150 OFF your next visit to Morrow Café. Fresh coffee,
            good food and a reason to come back.
          </p>

          <a href="#claim" className="hero-button">
            Claim ₹150 OFF
            <span>↓</span>
          </a>
        </div>

        <div className="scroll-hint">SCROLL TO CLAIM</div>
      </section>

      {/* OFFER */}
      <section className="offer-section">
        <div className="offer-copy">
          <p className="section-label">YOUR OFFER</p>

          <h2>
            ₹150 <span>OFF</span>
          </h2>

          <p>
            Claim your exclusive Morrow Café offer and use it on your next
            visit.
          </p>

          <div className="details">
            <div>
              <span>LOCATION</span>
              <strong>Sector 104, Noida</strong>
            </div>

            <div>
              <span>VALID FOR</span>
              <strong>Your next visit</strong>
            </div>
          </div>
        </div>

        {/* ONLY THE COFFEE IMAGE IS CHANGED */}
        <div className="coffee-card">
          <img
            src="/cafe.png"
            alt="Morrow Café"
            className="coffee-image"
          />

          <p>GOOD COFFEE.</p>
          <p>GOOD PEOPLE.</p>
          <p>GOOD MOMENTS.</p>
        </div>
      </section>

      {/* CLAIM FORM */}
      <section className="claim-section" id="claim">
        <div className="claim-header">
          <p className="section-label">CLAIM YOUR OFFER</p>

          <h2>Save ₹150 on your next visit.</h2>

          <p>
            Enter your details below. We'll generate your personal offer code
            instantly.
          </p>
        </div>

        {status === "success" ? (
          <div className="success-card">
            <div className="success-icon">✓</div>

            <p className="section-label">OFFER CLAIMED</p>

            <h2>₹150 OFF</h2>

            <p className="success-message">
              Show this code when you visit Morrow Café.
            </p>

            <div className="claim-code">
              <span>{claimCode}</span>

              <button type="button" onClick={copyCode}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={claimAnother}
            >
              Claim another
            </button>
          </div>
        ) : (
          <form className="claim-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Your name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="Rahul Sharma"
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="phone">Phone number</label>

              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={handleChange}
                autoComplete="tel"
                inputMode="numeric"
                maxLength={10}
                required
              />
            </div>

            {validationError && (
              <p className="error-message" role="alert">
                {validationError}
              </p>
            )}

            {status === "error" && (
              <p className="error-message" role="alert">
                We couldn't process your claim. Please try again.
              </p>
            )}

            <button
              className="submit-button"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Claiming..." : "Claim ₹150 OFF"}

              {status !== "loading" && <span>→</span>}
            </button>

            <p className="privacy-note">
              Your details are only used to process this offer.
            </p>
          </form>
        )}
      </section>

      {/* FOOTER */}
      <footer>
        <div className="brand">
          <span className="brand-mark">M</span>
          <span>MORROW CAFÉ</span>
        </div>

        <p>Sector 104, Noida · Made for good coffee.</p>
      </footer>
    </main>
  );
}

export default App;