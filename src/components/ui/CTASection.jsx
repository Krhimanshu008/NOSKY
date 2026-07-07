import Link from 'next/link';

export default function CTASection({
  title = "Try NoSky free for 14 days.",
  subtitle = "No credit card. Full features. Setup in 10 minutes.",
  primaryText = "Contact Sales",
  primaryHref = "/contact",
  secondaryText = "Book a Demo",
  secondaryHref = "/contact",
}) {
  return (
    <section className="cta-section section" id="cta-section">
      <div className="container">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <div className="cta-buttons">
          <Link href={primaryHref} className="btn btn-primary btn-lg">
            {primaryText} <span className="btn-icon">→</span>
          </Link>
          <Link href={secondaryHref} className="btn btn-secondary btn-lg">
            {secondaryText}
          </Link>
        </div>
      </div>
    </section>
  );
}
