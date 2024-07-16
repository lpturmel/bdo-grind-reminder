import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

const completionSound = new Audio("/completion.mp3");
const START_TIMER = 3600;

function App() {
    const [alchemyStone, setAlchemyStone] = createSignal(false);
    const [food, setFood] = createSignal(false);
    const [church, setChurch] = createSignal(false);
    const [scroll, setScroll] = createSignal(false);
    const [tent, setTent] = createSignal(false);
    const [fairy, setFairy] = createSignal(false);

    const [intervalId, setIntervalId] = createSignal<number | null>(null);
    const [isGrinding, setIsGrinding] = createSignal(false);
    const [countdown, setCountdown] = createSignal<number | null>(null);


    const disabled = createMemo(() => !alchemyStone() || !food() || !church() || !scroll() || !tent() || !fairy());

    const start = () => {
        setIsGrinding(true);
        setCountdown(START_TIMER);
        startInterval();
    }
    const resume = () => {
        setIsGrinding(true);
        startInterval();
    }
    const pause = () => {
        setIsGrinding(false);
        if (intervalId()) {
            clearInterval(intervalId()!);
            setIntervalId(null);
        }

    }
    const toggle = () => {
        if (isGrinding()) {
            pause();
        } else {
            resume();
        }
    }
    const startInterval = () => {
        if (intervalId()) return;
        setIntervalId(setInterval(() => {
            setCountdown(prev => {
                if (prev === 0) {
                    pause();
                    return prev;
                }
                return prev! - 1;
            });
        }, 1000));
    }

    const reset = () => {
        if (intervalId()) {
            clearInterval(intervalId()!);
        }
        setIsGrinding(false);
        setCountdown(null);
        setIntervalId(null);
        setAlchemyStone(false);
        setFood(false);
        setChurch(false);
        setScroll(false);
        setTent(false);
        setFairy(false);
    }

    createEffect(() => {
        if (isGrinding() && countdown() === 0) {
            pause();
            completionSound.play();
            setTimeout(() => {
                reset();
            }, 3000);
        }
    });

    onCleanup(() => {
        if (intervalId !== null) {
            clearInterval(intervalId()!);
        }
    });

    return (
        <div class="container mx-auto max-w-lg flex flex-col gap-4 pt-16 p-4 h-full">
            <h1 class="text-3xl font-bold">Grind Reminder</h1>

            <div class="flex gap-4 items-center w-full justify-between">
                <label for="alchemyStone">💎 Alchemy Stone</label>
                <input name="alchemyStone" type="checkbox" checked={alchemyStone()} onChange={(e) => setAlchemyStone(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="food">🍲 Food Buff (Cron Meal)</label>
                <input name="food" type="checkbox" checked={food()} onChange={(e) => setFood(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="church">⛪ Church Buffs</label>
                <input name="church" type="checkbox" checked={church()} onChange={(e) => setChurch(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="scroll">📜 Level 1/2 scroll</label>
                <input name="scroll" type="checkbox" checked={scroll()} onChange={(e) => setScroll(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="tent">⛺ Tent Buffs (Villa Buff + Adventurer's level 5)</label>
                <input name="tent" type="checkbox" checked={tent()} onChange={(e) => setTent(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="fairy">🧚 Fairy items (elixirs)</label>
                <input name="fairy" type="checkbox" checked={fairy()} onChange={(e) => setFairy(e.currentTarget.checked)} class="checkbox" />
            </div>

            <button disabled={disabled() || isGrinding() || countdown() !== null} class="btn" onClick={start}> Start Grind </button>

            <Show when={countdown()}>
                <div class="flex items-center w-full justify-between">
                    <span class="countdown font-mono text-2xl w-full">
                        <span style={`--value:${Math.floor(countdown()! / 3600)};`}></span>
                        :
                        <span style={`--value:${Math.floor((countdown()! % 3600) / 60)};`}></span>
                        :
                        <span style={`--value:${countdown()! % 60};`}></span>
                    </span>
                    <div class="flex items-center gap-4 justify-between">
                        <button class="btn" onClick={toggle}>
                            {isGrinding() ? "Pause" : "Resume"}
                        </button>
                        <button class="btn btn-error" onClick={reset}>
                            Stop
                        </button>
                    </div>
                </div>
            </Show>
        </div>
    );
}

export default App;
