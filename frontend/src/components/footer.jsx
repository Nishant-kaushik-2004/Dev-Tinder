import { Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-2 pb-4 bg-base-200 text-base-content">
      <aside>
        <Code className="w-8 h-8 text-primary" />
        <p className="font-bold">
          devTinder
          <br />
          Connecting developers worldwide since 2025
        </p>
        <p>Copyright © 2025 - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
