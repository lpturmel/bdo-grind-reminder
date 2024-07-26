import { CgClose } from "solid-icons/cg";
import { Component, createSignal } from "solid-js";
import AudioSlider from "../components/AudioSlider";
import { IoSettingsSharp } from "solid-icons/io";
import { store } from "..";
import { SOUND_KEY_BIND_KEY } from "../utils";

const CreateServer: Component = () => {
    let dialogRef: HTMLDialogElement;
    const [keyBind, setKeyBind] = createSignal("Ctrl + P");

    const onClick = () => {
        dialogRef.showModal();
    };
    // const onSubmit = async (e: any) => {
    //     e.preventDefault();
    // }
    const onClose = () => {
        dialogRef.close();
    }

    const handleKeyBindChange = async (e: KeyboardEvent) => {
        e.preventDefault();

        let keyCombination = [];
        if (e.ctrlKey) keyCombination.push("Ctrl");
        if (e.altKey) keyCombination.push("Alt");
        if (e.shiftKey) keyCombination.push("Shift");
        keyCombination.push(e.key);
        const newKeyBind = keyCombination.join(" + ");
        console.log(newKeyBind);
        setKeyBind(newKeyBind);
        await store.set(SOUND_KEY_BIND_KEY, newKeyBind);
    }

    const handleInputClick = () => {
        document.addEventListener("keydown", handleKeyBindChange, { once: true });
    }

    return (
        <>
            <button class="btn btn-ghost btn-sm" onClick={onClick}><IoSettingsSharp /></button>
            <dialog onClose={onClose} ref={r => (dialogRef = r)} class="modal modal-middle">
                <div class="modal-box">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"><CgClose class="w-5 h-5" /></button>
                    </form>
                    <h3 class="font-bold text-lg pb-4">Settings</h3>
                    <div class="flex flex-col gap-4 items-start">
                        <div class="flex flex-col gap-4 items-start justify-center">
                            <h3 class="uppercase font-semibold text-sm">Sound</h3>
                            <label class="text-sm"> End of Grind Volume</label>
                            <AudioSlider />
                        </div>
                        <div class="flex flex-col gap-4 items-start justify-center">
                            <h3 class="uppercase font-semibold text-sm"> Key Bindings </h3>

                            <div class="flex flex-col gap-4">
                                <label class="text-sm"> Toggle Mute </label>
                                <div class="flex gap-4 items-center">
                                    <input readonly class="input input-sm input-bordered" type="text" value={keyBind()}
                                        onClick={handleInputClick}
                                    />

                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="modal-action">
                        <button class="btn btn-neutral btn-sm" onClick={onClose}> Close </button>
                    </div>
                </div>
            </dialog>
        </>
    )
};

export default CreateServer;
