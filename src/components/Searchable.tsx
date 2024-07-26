import { Component, createSignal } from "solid-js";
interface SearchableProps {
    options: string[];
}
const Select: Component<SearchableProps> = (props) => {
    const [searchTerm, setSearchTerm] = createSignal("");

    const [selectedValue, setSelectedValue] = createSignal("");

    const handleSearch = (e: InputEvent) => {
        setSearchTerm((e.target as HTMLInputElement).value);
    };

    const handleSelect = (e: InputEvent) => {
        setSelectedValue((e.target as HTMLSelectElement).value);
    };

    const filteredOptions = () => {
        return props.options.filter((option) =>
            option.toLowerCase().includes(searchTerm().toLowerCase())
        );
    };

    return (
        <div class="flex gap-4 items-center">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm()}
                onInput={handleSearch}
                class="input input-bordered"
            />
            <select value={selectedValue()} onInput={handleSelect} class="select">
                {filteredOptions().map((option) => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;
