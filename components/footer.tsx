import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Mail,
  Church,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-950 text-white overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-primary/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Church Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Church className="h-5 w-5 text-gold" />
              </div>
              <span className="font-bold text-lg">Vision Family Church</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              A place of divine vision and purpose, where lives are transformed
              through the power of God&apos;s Word.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Youtube, href: "#" },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors group"
                >
                  <Icon className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About Us" },
                { href: "/sermons", label: "Sermons" },
                { href: "/events", label: "Events" },
                { href: "/gallery", label: "Gallery" },
                { href: "/give", label: "Give" },
                { href: "/register", label: "Register" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white text-sm transition-colors inline-flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  Amassoma, Bayelsa State, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <span className="text-gray-400 text-sm">
                  +234 XXX XXX XXXX
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <span className="text-gray-400 text-sm">
                  info@visionfamilychurch.org
                </span>
              </li>
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-6">
              Service Times
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                <p className="text-sm font-medium text-white">
                  Sunday Service
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  9:00 AM - 11:30 AM
                </p>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                <p className="text-sm font-medium text-white">
                  Midweek Service
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Wednesday, 6:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Vision Family Church. All rights
            reserved.
          </p>
          <p className="text-gray-600 text-xs">
            Built with love for the Kingdom
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
