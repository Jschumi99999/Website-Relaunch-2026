import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
}

const ContactDialog = ({ open, onClose }: ContactDialogProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) return;

    setSending(true);
    try {
      const { data, error } = await supabase.functions.invoke("send-contact", {
        body: { name: trimmedName, email: trimmedEmail, message: trimmedMessage },
      });

      if (error) throw error;

      toast({
        title: "Nachricht gesendet!",
        description: "Wir melden uns so schnell wie möglich bei dir.",
      });
      setName("");
      setEmail("");
      setMessage("");
      onClose();
    } catch {
      toast({
        title: "Fehler",
        description: "Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-lg bg-background border border-border p-8 md:p-10 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <h3 className="text-2xl font-bold font-display text-foreground mb-2">
                Kontakt aufnehmen
              </h3>
              <p className="text-muted-foreground mb-8">
                Schreib uns eine Nachricht und wir melden uns bei dir.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-display text-foreground mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors font-body"
                    placeholder="Dein Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display text-foreground mb-1.5">
                    E-Mail
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={255}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors font-body"
                    placeholder="deine@email.de"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display text-foreground mb-1.5">
                    Nachricht
                  </label>
                  <textarea
                    required
                    maxLength={1000}
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-colors resize-none font-body"
                    placeholder="Deine Nachricht..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-primary text-primary-foreground py-3 text-sm tracking-[0.2em] uppercase font-display hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {sending ? "Wird gesendet..." : "Absenden"}
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactDialog;
