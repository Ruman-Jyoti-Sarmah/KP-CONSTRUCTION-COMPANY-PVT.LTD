import { footer } from "../data/content.js";

export default function Footer() {
  const white = { color: "#FFFFFF" };
  const whiteSoft = { color: "#FFFFFF", opacity: 0.75 };
  const whiteDim = { color: "#FFFFFF", opacity: 0.6 };
  return (
    <footer className="bg-ivory" aria-label="Footer" style={white}>
      <div className="container-x pb-14 pt-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-[-0.02em]">KP</p>
            <p className="mt-3 text-[0.68rem] uppercase tracking-[0.22em] text-white/55" style={whiteSoft}>
              Construction Company
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed" style={whiteSoft}>{footer.company}</p>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="text-[0.7rem] uppercase tracking-[0.22em]" style={whiteSoft}>{col.title}</p>
              <ul className="mt-5 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <a href={href} className="transition-colors hover:text-white" style={white}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-[0.7rem] uppercase tracking-[0.22em]" style={whiteSoft}>Contact</p>
            <ul className="mt-5 space-y-2.5" style={white}>
              <li>
                <a href={`mailto:${footer.email}`} className="hover:text-white">{footer.email}</a>
              </li>
              <li>
                <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="hover:text-white">{footer.phone}</a>
              </li>
              <li style={whiteDim}>{footer.location}</li>
            </ul>
            <div className="mt-7 flex gap-6">
              {footer.socials.map(([label, href]) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[0.68rem] uppercase tracking-[0.14em] hover:text-white"
                  style={whiteSoft}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-16 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-[0.68rem] sm:flex-row"
          style={whiteDim}
        >
          <span>{footer.legal}</span>
          <span>Built with care — KP Construction Company Pvt. Ltd.</span>
        </div>
      </div>
    </footer>
  );
}