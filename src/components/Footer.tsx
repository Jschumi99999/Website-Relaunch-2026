const Footer = () => {
  return (
    <footer className="py-8 px-8 md:px-16 lg:px-24 bg-primary text-primary-foreground/50 border-t border-primary-foreground/10">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body">
        <p>
          upward Solution Inh. Julian Schumacher · Ratweg 4 · 65582 Diez
        </p>
        <p>© {new Date().getFullYear()} upward Solution</p>
      </div>
    </footer>
  );
};

export default Footer;
