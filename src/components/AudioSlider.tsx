import { Component, createSignal, onMount } from "solid-js";
import { store } from "..";
import { VOLUME_KEY } from "../utils";

export const [volume, setVolume] = createSignal(1);
const completionSound = new Audio("/completion.mp3");

export const playSound = () => {
    completionSound.volume = volume();
    completionSound.play();
}

const AudioSlider: Component = () => {
    let debounceTimeout: number | null = null;
    const debounceStoreSet = (newVolume: number) => {
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }
        debounceTimeout = setTimeout(() => {
            console.log("Setting volume to", newVolume);
            store.set(VOLUME_KEY, newVolume);
        }, 300);
    };

    const onInput = (e: InputEvent) => {
        const target = e.currentTarget as HTMLInputElement;
        const newVolume = parseFloat(target.value);
        setVolume(newVolume);
        debounceStoreSet(newVolume);
    }

    onMount(async () => {
        const storeVolume = await store.get<number>(VOLUME_KEY);
        setVolume(storeVolume ?? 1);
        document.addEventListener("keydown", onKeyDown);
    })
    const onKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === "p") {
            e.preventDefault();
            playSound();
        }
    }

    return (
        <div class="flex items-center gap-4">
            <div class="flex gap-4 items-center">
                <input class="range range-xs w-full" name="volume" type="range" min="0" max="1" step="0.01" value={volume()} onInput={onInput} />
            </div>

        </div>
    )
}
export default AudioSlider;
