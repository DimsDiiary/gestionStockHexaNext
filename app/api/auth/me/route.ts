import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-options"
import { GetUserUseCase } from "@/core/application/useCase/GetUserUseCase"
import { PrismaUserRepository } from "@/core/infra/repositories/PrismaUserRepository"
import { prisma } from "@/lib/prima"

const userRepository = new PrismaUserRepository(prisma);
const getUserUseCase = new GetUserUseCase(userRepository);

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserUseCase.execute(session.user.email);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user: user.toJSON() })
  } catch (error) {
    console.error("Error in /api/auth/me:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}