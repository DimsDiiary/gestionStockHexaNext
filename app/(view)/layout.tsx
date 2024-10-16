import Navbar from "./components/navbar"
import Sidebar from "./components/sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex">
            <Sidebar />
            <main className="flex-1 ml-[250px]">
                <div>
                    <Navbar />
                    <div className="mt-4">
                        {children}
                    </div>
                </div>
            </main>
        </section>
    )
}