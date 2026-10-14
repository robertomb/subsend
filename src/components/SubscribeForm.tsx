import { site } from "@/lib/site";

// A plain HTML form: works with JavaScript disabled and ships no client JS.
// The API route answers with a 303 redirect to a confirmation page.
function Fields({ id }: { id: string }) {
  return (
    <form action="/api/subscribe" method="post">
      <label className="hp" aria-hidden="true">
        Leave this empty
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>
      <label htmlFor={id} className="visually-hidden">
        Email address
      </label>
      <input id={id} type="email" name="email" required placeholder="you@example.com" autoComplete="email" />
      <button type="submit">Subscribe</button>
    </form>
  );
}

const fineprint = [site.newsletter.cadence, "Free, and you can unsubscribe anytime."].filter(Boolean).join(" ");

/** The landing page's primary form: no box, sits right under the pitch. */
export function HeroSubscribe() {
  return (
    <div className="hero-subscribe" id="subscribe">
      <Fields id="email-hero" />
      <p className="fineprint">{fineprint}</p>
    </div>
  );
}

/** Boxed call-to-action for the end of posts and the about page. */
export function SubscribeForm({
  title = `Get ${site.brand} in your inbox`,
  blurb = site.newsletter.pitch,
}: {
  title?: string;
  blurb?: string;
}) {
  return (
    <section className="subscribe" aria-labelledby="subscribe-title">
      <h2 id="subscribe-title">{title}</h2>
      <p>{blurb}</p>
      <Fields id="email-box" />
      <p className="fineprint">{fineprint}</p>
    </section>
  );
}
