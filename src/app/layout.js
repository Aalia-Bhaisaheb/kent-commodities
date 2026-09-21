import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const numans = localFont({
  src: "../../public/Numans/Numans-Regular.ttf",
  variable: "--font-numans",
  display: "swap",
});

export const metadata = {
  title: "Kent Commodities | Connecting Global Markets With Quality Commodities",
  description: "Global supply partner connecting agricultural and mining commodities across international markets.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${numans.variable} font-sans antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}