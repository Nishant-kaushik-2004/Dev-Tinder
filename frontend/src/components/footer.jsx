import { Code } from "lucide-react";

const Footer = () => {
  return (
    <footer className="footer footer-center p-6 bg-base-200 text-base-content  bottom-0">
      <aside>
        <Code className="w-8 h-8 text-primary" />
        <p className="font-bold">
          devTinder
          <br />
          Connecting developers worldwide since 2024
        </p>
        <p>Copyright © 2024 - All rights reserved</p>
      </aside>
    </footer>
  );
};

export default Footer;
