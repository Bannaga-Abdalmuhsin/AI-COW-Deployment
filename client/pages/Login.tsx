import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Eye,
  EyeOff,
  LockKeyhole,
  Network,
  ShieldCheck,
  UserRound,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

const stcLogo =
  "https://cdn.builder.io/api/v1/image/assets%2Fabc8ab05f7d144f289a582747d3e5ca3%2Fc565c09ac98d4bb1923fb8ee199fe98c?format=webp&width=200";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!credentials.username.trim() || !credentials.password) {
      toast.error("Enter your username and password to continue.");
      return;
    }

    if (!signIn(credentials.username, credentials.password)) {
      toast.error("Invalid username or password.");
      return;
    }
    toast.success("Secure workspace unlocked.");
    const destination = (location.state as { from?: string } | null)?.from || "/";
    navigate(destination, { replace: true });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-stc-purple-dark text-white">
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, hsl(var(--stc-lavender) / 0.28), transparent 30%), radial-gradient(circle at 85% 84%, hsl(var(--stc-purple) / 0.55), transparent 32%), linear-gradient(135deg, hsl(var(--stc-purple-dark)) 0%, hsl(270 50% 18%) 48%, hsl(280 55% 32%) 100%)",
        }}
      />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(hsl(var(--stc-lavender)/0.28)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--stc-lavender)/0.28)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div className="absolute -left-32 top-1/3 h-80 w-80 rounded-full bg-stc-lavender/20 blur-3xl" />
      <div className="absolute -right-20 top-12 h-72 w-72 rounded-full bg-stc-purple/40 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6 sm:px-10 lg:px-12">
        <header className="flex items-center justify-between">
          <div className="group inline-flex items-center gap-3">
            <span className="rounded-xl bg-white/10 p-2.5 ring-1 ring-white/15 transition-colors group-hover:bg-white/20">
              <Zap className="h-5 w-5 text-stc-lavender" />
            </span>
            <span className="text-lg font-bold tracking-tight">Movement Predictive & Analysis Tool</span>
          </div>
          <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs text-emerald-200">Authorized access only</span>
        </header>

        <div className="flex flex-1 items-center py-12 lg:py-16">
          <div className="grid w-full items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
            <section className="hidden max-w-xl lg:block">
              <div className="mb-8 flex items-center gap-4">
                <img src={stcLogo} alt="STC" className="h-9 brightness-0 invert" />
                <span className="h-8 w-px bg-white/20" />
                <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/60">
                  stc COW operational intelligence
                </span>
              </div>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.28em] text-stc-lavender">
                Secure command center
              </p>
              <h1 className="max-w-lg text-5xl font-bold leading-[1.08] tracking-tight text-white xl:text-6xl">
                Anticipate every COW movement.
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-8 text-white/70">
                Turn historical movement patterns into explainable forecasts,
                regional demand signals, and faster deployment decisions.
              </p>

              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <Network className="h-5 w-5 text-stc-lavender" />
                    <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Live
                    </span>
                  </div>
                  <p className="text-2xl font-semibold">4 regions</p>
                  <p className="mt-1 text-xs text-white/50">Kingdom-wide coverage</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                  <div className="mb-5 flex items-center justify-between">
                    <Activity className="h-5 w-5 text-stc-lavender" />
                    <span className="text-xs text-white/50">AI signal</span>
                  </div>
                  <p className="text-2xl font-semibold">80.4%</p>
                  <p className="mt-1 text-xs text-white/50">Next-region accuracy</p>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-md">
              <div className="rounded-3xl border border-white/20 bg-white/95 p-7 text-stc-purple-dark shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-9">
                <div className="mb-8 lg:hidden">
                  <img src={stcLogo} alt="STC" className="mb-6 h-8" />
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-stc-purple">
                    Secure command center
                  </p>
                </div>
                <div className="mb-8">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-stc-purple/10 text-stc-purple">
                    <LockKeyhole className="h-6 w-6" />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Sign in to access protected movement intelligence.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-sm text-stc-purple-dark">
                      Username
                    </Label>
                    <div className="relative">
                      <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter your username"
                        value={credentials.username}
                        onChange={(event) =>
                          setCredentials((current) => ({
                            ...current,
                            username: event.target.value,
                          }))
                        }
                        className="h-12 border-gray-200 bg-white pl-10 text-sm focus-visible:ring-stc-purple"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm text-stc-purple-dark">
                        Password
                      </Label>
                      <button
                        type="button"
                        className="text-xs font-medium text-stc-purple transition-colors hover:text-stc-purple-dark"
                        onClick={() => toast.info("Please contact your administrator to reset your password.")}
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(event) =>
                          setCredentials((current) => ({
                            ...current,
                            password: event.target.value,
                          }))
                        }
                        className="h-12 border-gray-200 bg-white px-10 text-sm focus-visible:ring-stc-purple"
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowPassword((visible) => !visible)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-stc-purple"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full bg-stc-purple text-base font-semibold text-white shadow-lg shadow-stc-purple/20 hover:bg-stc-purple-dark"
                  >
                    Sign in to workspace
                  </Button>
                </form>

                <div className="mt-7 flex items-start gap-3 border-t border-gray-100 pt-6 text-xs leading-5 text-gray-500">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <p>This demonstration contains publicly hosted operational records. Do not add confidential data without a private authenticated backend.</p>
                </div>
              </div>
              <p className="mt-6 text-center text-xs text-white/50">
                Need access? Contact your COW Deploy AI administrator.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
