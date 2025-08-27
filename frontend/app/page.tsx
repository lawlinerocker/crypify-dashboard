import Landing from "@/components/landing/Landing";

export const metadata = {
  title: "Welcome | Crypify",
  description: "Real-time Crypto market dashboard landing page",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function Page() {
  return <Landing />;
}
