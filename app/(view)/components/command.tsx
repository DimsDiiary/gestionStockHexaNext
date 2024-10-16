import { useState } from 'react';
import { TextInput } from 'flowbite-react';
import { FaSearch } from 'react-icons/fa';

export function Commande() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="max-w-md">
            <TextInput
                id="search"
                type="text"
                icon={FaSearch}
                placeholder="Type a command or search..."
                required={true}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="rounded-lg border"
            />
        </div>
    );
}