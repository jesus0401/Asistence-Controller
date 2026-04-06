import { useEffect } from "react";

export default function FontInjector() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }, []);

  return null;
}
