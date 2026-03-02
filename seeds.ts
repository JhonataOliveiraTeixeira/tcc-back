import { UserDB } from "src/infra/db/user.db"
import { PrismaService } from "src/infra/db/prisma/prisma.service"
import { UserService } from "src/application/user/user.service"
import { Prisma } from "generated/prisma/client"


async function main() {
    const prismaService = new PrismaService()
    const userDb = new UserDB(prismaService)
    const userService = new UserService(userDb)

    return await userService.createAdmin({
      name: "Jhonata dev",
      email: "jonasdeot@gmail.com",
      password: "123456",
      curse: "admin"
    })
}

main()
    .then(async () => {
        console.log("Seed executado com sucesso")        
    })
    .catch(async (e) => {
        if (e instanceof Prisma.PrismaClientKnownRequestError){
            if (e.code === "P2002"){
                console.log("Usuário já inserido")
            }
        } else {
            console.log(e)
        }
    })

