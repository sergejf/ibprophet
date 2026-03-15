export function Footer() {
  return (
    <footer className="mt-auto border-t border-dark-600 bg-dark-900/80">
      <div className="mx-auto flex w-full max-w-(--breakpoint-lg) flex-col gap-4 px-12 py-8">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🔮</span>
          <span className="text-lg font-bold text-primary-500">IB Prophet</span>
        </div>

        <div className="grid gap-6 text-xs text-neutral-500 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-400">
              Disclaimer
            </h4>
            <p>
              IB Prophet is an independent tool and is not affiliated with,
              endorsed by, or connected to the International Baccalaureate
              Organisation (IBO), any university, or any institution mentioned
              on this site.
            </p>
            <p>
              All university names, programme names, and entry requirements are
              the property of their respective institutions and are used here
              for informational purposes only.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-400">
              Accuracy
            </h4>
            <p>
              Information is provided for guidance only and may contain errors
              or become outdated. Errors and omissions excepted (E&OE). Salary
              data, growth projections, and university requirements are
              approximate and vary by region, institution, and year.
            </p>
            <p>
              Always verify requirements directly with your target university or
              institution before making decisions.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-semibold uppercase tracking-wider text-neutral-400">
              About
            </h4>
            <p>
              Built with AI assistance. While care has been taken to ensure
              accuracy, AI-generated content may contain inaccuracies. Use your
              own judgement and consult official sources.
            </p>
            <p>
              No liability is accepted for any loss, damage, or inconvenience
              arising from the use of this tool or reliance on its content.
            </p>
            <a
              href="https://tally.so/r/aQG4gW"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 underline"
            >
              Give feedback
            </a>
          </div>
        </div>

        <div className="border-t border-dark-700 pt-4 text-center text-xs text-neutral-600">
          &copy; {new Date().getFullYear()} IB Prophet. All rights reserved.
          Not affiliated with the IB Organisation or any university listed.
        </div>
      </div>
    </footer>
  );
}
