import { PrismaClient, Prisma} from "./generated/prisma/client"

const prisma = new PrismaClient()

async function main() {
    await prisma.$connect()
    try {    
    await prisma.user.create(
        {
            data: {
                name: "Jhonata dev",
                email: "jonasdeot@gmail.com",
                password: "123456"
            }
        }
    )} catch (err) {
        if (err instanceof  Prisma.PrismaClientKnownRequestError) {
            if (err.code === 'P2002') {
                console.log("usuário admin já criado")
            }
        } else {
            throw err
        }
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

