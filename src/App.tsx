import { For, Show, createEffect, createMemo, createResource, createSignal, onCleanup } from "solid-js";
import { playSound } from "./components/AudioSlider";
import { invoke } from "@tauri-apps/api";
import SettingsModal from "./modals/SettingsModal";

const START_TIMER = import.meta.env.PROD ? 3600 : 5;

export const [selectedGrindSpot, setSelectedGrindSpot] = createSignal<string | null>(null);

export interface GrindSpot {
    name: string;
    is_agris: boolean;
    monster_tags: string[];
}
function App() {
    const [grindSpots] = createResource(async () => {
        const grindSpots = await invoke<GrindSpot[]>("load_grind_spots");
        return grindSpots;
    });
    const grindSpotDetails = createMemo(() =>
        grindSpots()?.find((grindSpot) => grindSpot.name === selectedGrindSpot())
    );
    const [alchemyStone, setAlchemyStone] = createSignal(false);
    const [food, setFood] = createSignal(false);
    const [church, setChurch] = createSignal(false);
    const [scroll, setScroll] = createSignal(false);
    const [tent, setTent] = createSignal(false);
    const [fairy, setFairy] = createSignal(false);
    const [lightstone, setLightstone] = createSignal(false);
    const [crystals, setCrystals] = createSignal(false);
    const [horse, setHorse] = createSignal(false);

    const [intervalId, setIntervalId] = createSignal<number | null>(null);
    const [isGrinding, setIsGrinding] = createSignal(false);
    const [countdown, setCountdown] = createSignal<number | null>(null);


    const disabled = createMemo(() => !horse() || !crystals() || !lightstone() || !alchemyStone() || !food() || !church() || !scroll() || !tent() || !fairy());

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

        setHorse(false);
        setCrystals(false);
        setLightstone(false);
        setAlchemyStone(false);
        setFood(false);
        setChurch(false);
        setScroll(false);
        setTent(false);
        setFairy(false);
    }
    const checkAll = () => {
        setHorse(true);
        setCrystals(true);
        setLightstone(true);
        setAlchemyStone(true);
        setFood(true);
        setChurch(true);
        setScroll(true);
        setTent(true);
        setFairy(true);
    }

    createEffect(() => {
        console.log(grindSpotDetails());
        if (isGrinding() && countdown() === 0) {
            pause();
            playSound();
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

    const handleSelect = (e: InputEvent) => {
        setSelectedGrindSpot((e.target as HTMLSelectElement).value);
    }

    return (
        <div class="container mx-auto max-w-lg flex flex-col gap-4 pt-16 p-4 h-full">
            <div class="flex items-center justify-between">
                <h1 class="text-xl font-bold">Grind Reminder</h1>
                <div class="flex gap-4 items-center">
                    <button class="btn btn-neutral btn-sm" onClick={checkAll}>Check all</button>
                    <SettingsModal />
                </div>
            </div>
            <div class="flex flex-col gap-4 w-full">
                <select onInput={handleSelect} class="select select-bordered">
                    <option disabled selected>Pick a Grind Spot</option>
                    <For each={grindSpots()!}>
                        {(grindSpot) => (
                            <option value={grindSpot.name}>{grindSpot.name}</option>
                        )}
                    </For>
                </select>
                <Show when={grindSpotDetails()}>
                    <div class="flex gap-2">
                        <For each={grindSpotDetails()!.monster_tags}>
                            {(monsterTag) => (
                                <div class="badge badge-neutral">{monsterTag}</div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>

            <div class="flex gap-4 items-center w-full justify-between">
                <label for="lightstone">🔵 Lightstone</label>
                <input name="lightstone" type="checkbox" checked={lightstone()} onChange={(e) => setLightstone(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="crystals">💎 Crystal Page</label>
                <input name="crystals" type="checkbox" checked={crystals()} onChange={(e) => setCrystals(e.currentTarget.checked)} class="checkbox" />
            </div>
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="alchemyStone">🪨 Alchemy Stone</label>
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
            <div class="flex gap-4 items-center w-full justify-between">
                <label for="horse">🐎 Horse buff (wind)</label>
                <input name="horse" type="checkbox" checked={horse()} onChange={(e) => setHorse(e.currentTarget.checked)} class="checkbox" />
            </div>
            <Show when={grindSpotDetails()?.is_agris}>
                <div class="flex gap-4 items-center w-full justify-between">
                    <label for="agris">🌱 Agris</label>
                </div>
            </Show>

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
