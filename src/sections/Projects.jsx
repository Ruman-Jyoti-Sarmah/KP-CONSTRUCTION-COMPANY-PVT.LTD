import { projects } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";

const PHOTOS = {
  residence: "/images/project-residence.jpg",
  headquarters: "/images/project-headquarters.jpg",
  urban: "/images/project-urban.jpg",
  complex: "/images/project-complex.jpg",
};

/* Editorial meta block — always visible below the image, never hidden. */
function ProjectMeta({ project, light = false }) {
  return (
    <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-4">
        <span className={`pt-1.5 text-[0.68rem] tracking-[0.24em] ${light ? "text-white/60" : "text-charcoal/45"}`}>
          {project.index}
        </span>
        <div>
          <h3 className={`font-display text-2xl font-bold tracking-[-0.02em] sm:text-3xl ${light ? "text-white" : "text-charcoal"}`}>
            {project.name}
          </h3>
          <p className={`mt-1.5 text-[0.7rem] uppercase tracking-[0.2em] ${light ? "text-white/65" : "text-charcoal/55"}`}>
            {project.location}
          </p>
        </div>
      </div>
      <div className={`flex flex-col items-end gap-2 text-right ${light ? "text-white/65" : "text-charcoal/55"}`}>
        <span className="text-[0.66rem] uppercase tracking-[0.18em]">
          {project.category} · {project.year}
        </span>
        <span className="inline-flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-bronze">
          View Project <span className="project-meta-arrow">→</span>
        </span>
      </div>
    </div>
  );
}

function ProjectCard({ project, ratio, parallax = false }) {
  return (
    <article className="group relative" data-reveal="">
      <a
        href="#contact"
        data-cursor-label="View project"
        aria-label={`${project.name} — ${project.location}, ${project.year}`}
        className="block"
      >
        <div className={`project-media relative ${ratio}`}>
          <Img
            src={PHOTOS[project.image]}
            alt={`${project.name} — architectural photography`}
            fill
            zoom
            parallax={parallax}
            overlay="ov-ivory-bottom"
            grain
            fallbackVariant={project.image}
          />
          <span className="ov-hover img-overlay" aria-hidden="true" />
          <span className="project-arrow light absolute right-5 top-5 text-white" aria-hidden="true">↗</span>
        </div>
        <ProjectMeta project={project} />
      </a>
    </article>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative bg-journey section-pad" aria-label="Projects">
      <div className="container-x">
        <div className="max-w-3xl" data-reveal="">
          <SectionTag>01 / Selected Projects</SectionTag>
          <h2 className="h-d2 mt-7 text-charcoal">
            Projects
            <br />
            that define
            <br />
            our work.
          </h2>
          <p className="lede mt-7 max-w-xl">
            An editorial selection of residential, corporate and civic commissions — from first sketch to final handover.
          </p>
        </div>

        {/* 01 — large feature, asymmetric left */}
        <div className="mt-16 grid gap-x-12 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ProjectCard project={projects[0]} ratio="aspect-[4/3] sm:aspect-[16/10]" parallax />
          </div>
          <div className="flex flex-col justify-end lg:col-span-4 lg:pb-14">
            <div data-reveal="" className="border-l-2 border-bronze/60 pl-6">
              <p className="font-display text-xl font-bold tracking-[-0.01em] text-charcoal">
                {projects[0].category} — {projects[0].year}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/65">
                A private residence balancing warm materiality with clean structural lines — designed, engineered and
                built by one accountable team.
              </p>
            </div>
          </div>
        </div>

        {/* 02 + 03 — opposing compositions */}
        <div className="mt-20 grid gap-x-12 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:translate-y-10">
            <ProjectCard project={projects[2]} ratio="aspect-[4/5] sm:aspect-[4/4.4]" />
          </div>
          <div className="lg:col-span-7">
            <ProjectCard project={projects[1]} ratio="aspect-[4/3] sm:aspect-[16/11]" parallax />
          </div>
        </div>

        {/* 04 — full-bleed wide visual inside container */}
        <div className="mt-24">
          <ProjectCard project={projects[3]} ratio="aspect-[16/10] sm:aspect-[21/9]" parallax />
        </div>

        <div className="mt-16 flex justify-center" data-reveal="">
          <a href="#contact" className="btn btn-outline" data-cursor-label="All projects">
            <span className="bl">View All Projects</span>
            <span className="ba">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
