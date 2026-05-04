import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — ModelAI Studio" }] }),
  component: () => <AuthLayout mode="signup" />,
});
