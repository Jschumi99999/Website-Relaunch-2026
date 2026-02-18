const Footer = () => {
  return (
    <footer className="py-8 px-6 sm:px-8 md:px-16 lg:px-24 border-t border-foreground/[0.06]">
      <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-xs sm:text-sm font-body text-muted-foreground/40">
        <p>upward Solution Inh. Julian Schumacher · Ratweg 4 · 65582 Diez</p>
        <p>© {new Date().getFullYear()} upward Solution</p>
      </div>
    </footer>
  );
};

export default Footer;
