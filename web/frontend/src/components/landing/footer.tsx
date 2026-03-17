"use client";

import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const footerLinks = {
  paginas: ["Home", "Sobre", "Serviços", "Contato"],
  recursos: ["Documentação", "Guias", "Blog", "Comunidade", "Templates"],
  legal: ["Privacidade", "Termos", "Segurança", "Cookies", "Licenças"],
};

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer ref={ref} className="border-t border-zinc-800 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-8"
        >
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                <Image src="/Logo.png" alt="Logo" width={32} height={32} />
              </div>
              <span className="font-semibold text-primary">Qcena</span>
            </Link>
            <p className="text-sm text-zinc-500 mb-4">
              Conectando serviços e profissionais com excelência.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-primary mb-4">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-zinc-500 hover:text-primary transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} Qcena, Inc. Todos os direitos
            reservados.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/xmaj2001/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/xmaj2001"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
