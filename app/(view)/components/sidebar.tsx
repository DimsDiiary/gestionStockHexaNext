'use client';

import { Trello, BriefcaseBusiness, TrafficCone, ShoppingCart, PiggyBank, Package2, UsersRound, CreditCard, Banknote, ArchiveX, Weight, Ruler, Store } from 'lucide-react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { FC } from 'react';
import { useRouter } from 'next/navigation';

interface MenuItem {
    link: string;
    text: string;
    icon: JSX.Element;
}

interface MenuGroup {
    items: MenuItem[];
}

const menuList: MenuGroup[] = [{
    items: [
        { link: '/dashboard', text: 'Tableaux', icon: <Trello /> },
        { link: '/projet', text: 'Projet', icon: <BriefcaseBusiness /> },
        { link: '/chantiers', text: 'Chantier', icon: <TrafficCone /> },
        { link: '/classes', text: 'Classes', icon: <Weight /> },
        { link: '/unites', text: 'Unites', icon: <Ruler /> },
        { link: '/achat', text: 'Achat', icon: <ShoppingCart /> },
        { link: '/magasin', text: 'Magasin', icon: <Store /> },
        { link: '/petitCaisse', text: 'Petit Caisse', icon: <Banknote /> },
        { link: '/grandCaisse', text: 'Grand Caisse', icon: <CreditCard /> },
        { link: '/stock', text: 'Entre', icon: <Package2 /> },
        { link: '/stockOut', text: 'Sortie', icon: <ArchiveX /> },
        { link: '/register', text: 'Administration', icon: <UsersRound /> },
        { link: '/viewsAll', text: 'ViewsAll', icon: <Package2 /> },
    ],
}];

const Sidebar: FC = () => {
    const router = useRouter();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push('/');
    };

    return (
        <div className="fixed left-0 top-0 bottom-0 w-[250px] border-r bg-white flex flex-col">
            <div className="p-4 flex-grow overflow-y-auto">
                <div className="mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">SOMEEIM</span>
                </div>
                <div>
                    {menuList.map((menu, menuIndex) => (
                        <MenuGroupComponent key={menuIndex} menu={menu} />
                    ))}
                </div>
            </div>
            <div className="p-4 border-t">
                <button 
                    onClick={handleLogout} 
                    className="w-full text-white bg-gray-600 hover:bg-gray-800 py-2 rounded-md transition duration-300 ease-in-out"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

interface MenuGroupComponentProps {
    menu: MenuGroup;
}

const MenuGroupComponent: FC<MenuGroupComponentProps> = ({ menu }) => (
    <div>
        <ul className="space-y-1">
            {menu.items.map((option) => (
                <MenuItemComponent key={option.link} option={option} />
            ))}
        </ul>
    </div>
);

interface MenuItemComponentProps {
    option: MenuItem;
}

const MenuItemComponent: FC<MenuItemComponentProps> = ({ option }) => (
    <li>
        <Link href={option.link} className="flex items-center gap-2 p-1 rounded-md hover:bg-gray-100 cursor-pointer">
            <span className="text-base">{option.icon}</span>
            <span className="text-sm">{option.text}</span>
        </Link>
    </li>
);

export default Sidebar;