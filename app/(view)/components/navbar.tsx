'use client'

import { Button } from "@/components/ui/button"
import { Commande } from "./command"
import { Moon } from "lucide-react"
import User from "./userItem"

export default function Navbar() {
    return (
        <div className="bg-white shadow-md">
            <div className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <User/>
                </div>
                <div className="flex items-center space-x-4">
                    <Commande />
                    <Button variant="outline" size="icon">
                        <Moon className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}