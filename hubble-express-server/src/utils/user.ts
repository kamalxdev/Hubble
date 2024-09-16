import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prisma = new PrismaClient().$extends(withAccelerate());

export async function getUserwithID(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    return { success: true, user };
  } catch (error) {
    console.log("Error on gettting user: ", error);

    return { success: false, error: "Internal server error" };
  }
}
