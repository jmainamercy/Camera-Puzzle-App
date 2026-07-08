import "./globals.css";

export const metadata = {
  title: "CamPuzzle Next",
  description: "Snap a photo to build your custom puzzle game",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50">{children}</body>
    </html>
  );
}
