import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        const email = (e.target as any).email.value;
        const password = (e.target as any).password.value;
        await signIn("credentials", { email, password, callbackUrl: "/dashboard" });
      }}
    >
      <input name="email" type="email" />
      <input name="password" type="password" />
      <button type="submit">Login</button>
    </form>
  );
}
