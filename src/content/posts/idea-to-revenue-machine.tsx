'use client'

import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

const FEATURE_EMOJIS = ["📈", "🛠️", "🚀", "🎯", "⚙️", "🧠", "📱", "🤖", "🧪", "🛎️"] as const;
const MONEY_EMOJIS = ["💸", "💰", "🪙", "💵"] as const;
const CODE_SYMBOLS = ["</>", "{}", "return", "() =>", "async", "<div/>", "const"] as const;
const PEOPLE_CLUSTER = ["👩‍💻", "👨‍🔧", "👩‍🎨", "🧑‍🚀", "🧑‍💼"] as const;

interface Idea {
  id: number;
  size: number;
  featureEmoji: (typeof FEATURE_EMOJIS)[number];
}

interface IntakeState {
  idea: Idea;
  startedAt: number;
  duration: number;
}

interface ProcessingState {
  idea: Idea;
  startedAt: number;
  duration: number;
}

interface FeatureOnBelt {
  id: number;
  size: number;
  emoji: (typeof FEATURE_EMOJIS)[number];
  startTime: number;
  duration: number;
}

interface CodeBurst {
  id: number;
  symbol: (typeof CODE_SYMBOLS)[number];
  offset: number;
}

interface MoneyBurst {
  id: number;
  emoji: (typeof MONEY_EMOJIS)[number];
  createdAt: number;
  offset: number;
}

function pickRandom<T>(values: readonly T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

function IdeaToRevenueMachine() {
  const [speed, setSpeed] = useState(4);
  const [isReality, setIsReality] = useState(false);
  const [deliveredCount, setDeliveredCount] = useState(0);

  const ideaIdRef = useRef(0);
  const featureIdRef = useRef(0);
  const codeIdRef = useRef(0);
  const moneyIdRef = useRef(0);

  const speedRef = useRef(speed);
  const modeRef = useRef(isReality);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    modeRef.current = isReality;
  }, [isReality]);

  const createIdea = () => {
    ideaIdRef.current += 1;
    const size = Number((0.8 + Math.random() * 0.7).toFixed(2));
    return {
      id: ideaIdRef.current,
      size,
      featureEmoji: pickRandom(FEATURE_EMOJIS),
    } satisfies Idea;
  };

  const [ideaQueue, setIdeaQueue] = useState<Idea[]>(() =>
    Array.from({ length: 6 }, () => createIdea())
  );

  const [intakeState, setIntakeState] = useState<IntakeState | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState | null>(null);
  const [outputQueue, setOutputQueue] = useState<FeatureOnBelt[]>([]);
  const [codeBursts, setCodeBursts] = useState<CodeBurst[]>([]);
  const [moneyBursts, setMoneyBursts] = useState<MoneyBurst[]>([]);

  const intakeTimerRef = useRef<number | null>(null);
  const processingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intakeTimerRef.current) { window.clearTimeout(intakeTimerRef.current); }
      if (processingTimerRef.current) { window.clearTimeout(processingTimerRef.current); }
    };
  }, []);

  const getIntakeDuration = (currentSpeed: number) => {
    const base = 1600;
    return Math.max(350, base / Math.max(currentSpeed, 1));
  };

  const getProcessingDuration = (idea: Idea, currentSpeed: number, reality: boolean) => {
    const base = 3800 * idea.size;
    const effectiveSpeed = Math.max(currentSpeed, 1);
    const baselineDuration = base / effectiveSpeed;

    if (!reality) {
      return baselineDuration;
    }

    const slowDownFactor = 1 - ((effectiveSpeed - 1) * 0.5) / 9;
    const clamped = Math.max(slowDownFactor, 0.35);
    return baselineDuration / clamped;
  };

  const getTravelDuration = (currentSpeed: number) => {
    const base = 2600;
    return Math.max(900, base / Math.max(currentSpeed * 0.9, 1));
  };

  useEffect(() => {
    if (intakeState || processingState || ideaQueue.length === 0) {
      return;
    }

    if (intakeTimerRef.current) {
      window.clearTimeout(intakeTimerRef.current);
    }

    const nextIdea = ideaQueue[0];
    const duration = getIntakeDuration(speedRef.current);

    setIdeaQueue((prev) => prev.slice(1));
    setIntakeState({ idea: nextIdea, startedAt: Date.now(), duration });

    intakeTimerRef.current = window.setTimeout(() => {
      setIntakeState(null);

      if (processingTimerRef.current) {
        window.clearTimeout(processingTimerRef.current);
      }

      const processingDuration = getProcessingDuration(
        nextIdea,
        speedRef.current,
        modeRef.current
      );

      setProcessingState({ idea: nextIdea, startedAt: Date.now(), duration: processingDuration });

      processingTimerRef.current = window.setTimeout(() => {
        setProcessingState(null);

        featureIdRef.current += 1;
        const feature: FeatureOnBelt = {
          id: featureIdRef.current,
          size: nextIdea.size,
          emoji: nextIdea.featureEmoji,
          startTime: Date.now(),
          duration: getTravelDuration(speedRef.current),
        };

        setOutputQueue((prev) => [...prev, feature]);
        setIdeaQueue((prev) => [...prev, createIdea()]);
      }, processingDuration);
    }, duration);
  }, [ideaQueue, intakeState, processingState]);

  useEffect(() => {
    if (!processingState) {
      setCodeBursts([]);
      return;
    }

    const interval = window.setInterval(() => {
      codeIdRef.current += 1;
      const id = codeIdRef.current;
      const burst: CodeBurst = {
        id,
        symbol: pickRandom(CODE_SYMBOLS),
        offset: 30 + Math.random() * 40,
      };

      setCodeBursts((prev) => [...prev, burst]);

      window.setTimeout(() => {
        setCodeBursts((prev) => prev.filter((existing) => existing.id !== id));
      }, 700);
    }, Math.max(220, 700 - speedRef.current * 50));

    return () => {
      window.clearInterval(interval);
    };
  }, [processingState, speed]);

  useEffect(() => {
    if (outputQueue.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setOutputQueue((prev) => {
        if (prev.length === 0) {
          return prev;
        }

        const now = Date.now();
        const remaining: FeatureOnBelt[] = [];
        const completed: FeatureOnBelt[] = [];

        for (const feature of prev) {
          if (now - feature.startTime >= feature.duration) {
            completed.push(feature);
          } else {
            remaining.push(feature);
          }
        }

        if (completed.length) {
          setDeliveredCount((count) => count + completed.length);
          completed.forEach((feature) => {
            moneyIdRef.current += 1;
            const id = moneyIdRef.current;
            const burst: MoneyBurst = {
              id,
              emoji: pickRandom(MONEY_EMOJIS),
              createdAt: Date.now(),
              offset: 82 + Math.random() * 12,
            };

            setMoneyBursts((prevBursts) => [...prevBursts, burst]);

            window.setTimeout(() => {
              setMoneyBursts((prevBursts) => prevBursts.filter((item) => item.id !== id));
            }, 1200);
          });
        }

        return remaining;
      });
    }, 120);

    return () => {
      window.clearInterval(interval);
    };
  }, [outputQueue]);

  const [clock, setClock] = useState(() => Date.now());
  useEffect(() => {
    const interval = window.setInterval(() => {
      setClock(Date.now());
    }, 100);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const processingProgress = useMemo(() => {
    if (!processingState) {
      return 0;
    }
    const elapsed = clock - processingState.startedAt;
    return Math.min(elapsed / processingState.duration, 1);
  }, [clock, processingState]);

  const currentModeLabel = isReality ? "reality" : "the dream";

  return (
    <div className="space-y-10">
      <div className="space-y-4 text-center">
        <Badge className="bg-blue-500/20 text-blue-300">Interactive Resource</Badge>
        <h1 className="text-4xl font-bold text-white">
          Idea to Revenue Machine
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-white/70">
          Tune the intake speed and flip the mode toggle to watch ideas transform into customer-facing features.
          In dream mode, velocity keeps pace. In reality, bottlenecks trigger flames and slowing output.
        </p>
      </div>

      <Card className="bg-white/5 border-white/10 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <span>Assembly Line</span>
            <Badge className="bg-purple-500/20 text-purple-200 capitalize">
              {currentModeLabel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:gap-10">
            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">Idea Intake</p>
                <span className="text-xs text-white/50">
                  Queue: {ideaQueue.length + (intakeState ? 1 : 0)}
                </span>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg border border-white/10 bg-slate-900/70">
                <div className="absolute inset-0 grid h-full grid-cols-8 border-x border-white/5">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
                      className="border-x border-white/10"
                      style={{ opacity: index % 2 === 0 ? 0.05 : 0.1 }}
                    />
                  ))}
                </div>
                <div className="relative flex h-full items-center gap-2 px-4">
                  {ideaQueue.map((idea) => (
                    <span
                      key={idea.id}
                      className="text-3xl transition-transform duration-300"
                      style={{ transform: `scale(${idea.size})` }}
                    >
                      💡
                    </span>
                  ))}
                </div>

                {intakeState && (
                  <span
                    className="idea-moving absolute top-1/2 left-[10%] text-4xl"
                    style={{
                      animationDuration: `${intakeState.duration}ms`,
                      transform: `translate(-50%, -50%) scale(${intakeState.idea.size})`,
                    }}
                  >
                    💡
                  </span>
                )}

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.08),transparent_55%)]" />
              </div>
            </div>

            <div className="relative flex w-full max-w-[230px] flex-col items-center">
              <div className="relative w-full rounded-xl border border-white/10 bg-slate-950/80 p-6 text-center shadow-lg shadow-blue-500/10">
                <div className="mx-auto mb-4 h-12 w-24 rounded-md border border-blue-400/60 bg-blue-500/10 text-sm font-semibold uppercase tracking-[0.4em] text-blue-200 flex items-center justify-center">
                  Code
                </div>

                <div className="relative flex h-16 w-full items-center justify-center overflow-hidden rounded-md border border-white/10 bg-slate-900/80">
                  {processingState ? (
                    <span
                      className="text-4xl transition-transform"
                      style={{ transform: `scale(${processingState.idea.size})` }}
                    >
                      💡
                    </span>
                  ) : (
                    <span className="text-sm uppercase tracking-widest text-white/40">
                      waiting
                    </span>
                  )}

                  {codeBursts.map((burst) => (
                    <span
                      key={burst.id}
                      className="code-burst absolute text-sm text-sky-300/80"
                      style={{ left: `${burst.offset}%` }}
                    >
                      {burst.symbol}
                    </span>
                  ))}

                  {isReality && (
                    <>
                      <span className="machine-fire absolute -left-5 -top-6 text-3xl">🔥</span>
                      <span className="machine-fire absolute -right-5 -top-6 text-3xl">🔥</span>
                    </>
                  )}
                </div>

                <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-400 transition-all"
                    style={{ width: `${processingProgress * 100}%` }}
                  />
                </div>
                <p className="mt-3 text-xs uppercase tracking-wide text-white/60">
                  Throughput synced to <span className="font-semibold">{currentModeLabel}</span>
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-white/80">Feature Conveyor</p>
                <span className="text-xs text-white/50">Delivered: {deliveredCount}</span>
              </div>
              <div className="relative h-24 overflow-hidden rounded-lg border border-white/10 bg-slate-900/70">
                <div className="absolute inset-0 grid h-full grid-cols-8 border-x border-white/5">
                  {Array.from({ length: 8 }, (_, index) => (
                    <div
                      key={index}
                      className="border-x border-white/10"
                      style={{ opacity: index % 2 === 0 ? 0.05 : 0.1 }}
                    />
                  ))}
                </div>

                <div className="relative h-full">
                  {outputQueue.map((feature) => {
                    const progress = Math.min(
                      (clock - feature.startTime) / feature.duration,
                      1
                    );
                    const left = 10 + progress * 70;

                    return (
                      <span
                        key={feature.id}
                        className="feature-on-belt absolute top-1/2 text-4xl"
                        style={{
                          left: `${left}%`,
                          transform: `translate(-50%, -50%) scale(${feature.size})`,
                        }}
                      >
                        {feature.emoji}
                      </span>
                    );
                  })}

                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-200">Customers</Badge>
                    <div className="text-3xl leading-none">
                      {PEOPLE_CLUSTER.join(" ")}
                    </div>
                  </div>

                  {moneyBursts.map((burst) => (
                    <span
                      key={burst.id}
                      className="money-burst absolute text-2xl"
                      style={{ left: `${burst.offset}%` }}
                    >
                      {burst.emoji}
                    </span>
                  ))}
                </div>

                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,rgba(16,185,129,0.1),transparent_55%)]" />
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block text-white/80">Intake rate</Label>
                <div className="flex items-center gap-3 text-xs uppercase tracking-wide text-white/40">
                  <span>1x</span>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0] ?? 1)}
                  />
                  <span>10x</span>
                </div>
                <p className="mt-2 text-sm text-white/60">
                  Current speed: <span className="font-semibold text-white">{speed}x intake</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-white/80">Mode toggle</Label>
              <div className="flex items-center gap-4 text-sm font-semibold uppercase tracking-wide">
                <span className={!isReality ? "text-white" : "text-white/40"}>the dream</span>
                <Switch checked={isReality} onCheckedChange={setIsReality} aria-label="Toggle mode" />
                <span className={isReality ? "text-white" : "text-white/40"}>reality</span>
              </div>
              <p className="text-sm text-white/60">
                Dream mode keeps throughput in sync with intake. Reality mode adds friction—higher intake speeds
                starve output, slow feature delivery, and light the machine on fire.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Session stats</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 text-white/70">
            <div>
              <div className="text-sm uppercase tracking-wide text-white/40">Ideas waiting</div>
              <div className="text-2xl font-semibold text-white">
                {ideaQueue.length + (intakeState ? 1 : 0)}
              </div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-white/40">Features shipped</div>
              <div className="text-2xl font-semibold text-white">{deliveredCount}</div>
            </div>
            <div>
              <div className="text-sm uppercase tracking-wide text-white/40">Mode amplification</div>
              <div className="text-lg font-semibold text-white">
                {isReality ? `${Math.round((1 - Math.max(0.5, 1 - ((speed - 1) * 0.5) / 9)) * 100)}% slowdown` : "Full velocity"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-sky-500/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">How to use this model</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-white/70">
            <p>
              Increase the intake slider to simulate faster idea generation. In dream mode the factory keeps up,
              shipping matching feature emojis to customers.
            </p>
            <p>
              Flip to reality to expose delivery bottlenecks—ideas pile up, the machine overheats, and customer value
              lags no matter how hard you push the intake.
            </p>
            <p>
              Use the visualization to facilitate roadmap discussions: where do you invest to keep throughput aligned
              with ambition?
            </p>
          </CardContent>
        </Card>
      </div>

      <style jsx global>{`
        .idea-moving {
          animation-name: idea-intake-move;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }

        @keyframes idea-intake-move {
          from {
            left: 10%;
          }
          to {
            left: 88%;
          }
        }

        .code-burst {
          animation: code-pop 0.75s ease-out forwards;
        }

        @keyframes code-pop {
          0% {
            transform: translate(-50%, 20%) scale(0.8);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -90%) scale(1.1);
            opacity: 0;
          }
        }

        .feature-on-belt {
          transition: left 0.12s linear;
        }

        .money-burst {
          animation: money-rise 1.2s ease-out forwards;
          color: rgba(16, 185, 129, 0.9);
        }

        @keyframes money-rise {
          0% {
            transform: translate(-50%, 20%) scale(0.9);
            opacity: 0.5;
          }
          40% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -120%) scale(1.2);
            opacity: 0;
          }
        }

        .machine-fire {
          animation: fire-flicker 0.8s ease-in-out infinite alternate;
        }

        @keyframes fire-flicker {
          from {
            transform: translateY(0) scale(0.9);
            opacity: 0.8;
          }
          to {
            transform: translateY(-6px) scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

IdeaToRevenueMachine.metadata = {
  title: "Idea to Revenue Machine",
  description: "Interactive factory simulation that turns ideas into features and highlights delivery bottlenecks.",
  date: "2025-01-25",
  readTime: "8 min interactive",
  featured: false,
  type: "react" as const,
  tags: ["interactive", "product", "throughput"],
  author: "Craig Sturgis",
  slug: "idea-to-revenue-machine",
  hidden: false,
} as const;

export default IdeaToRevenueMachine;
