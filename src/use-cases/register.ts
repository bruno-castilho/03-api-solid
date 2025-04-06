import { prisma } from '@/lib/prisma'
import { PrismUsersRepository } from '@/repositories/prisma-users-repository'
import { hash } from 'bcryptjs'

interface registerUseCaseParams {
  name: string
  email: string
  password: string
}

export async function registerUseCase({
  name,
  email,
  password,
}: registerUseCaseParams) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) throw new Error('E-mail already exists')

  const password_hash = await hash(password, 6)

  const prismaUsersRepository = new PrismUsersRepository()

  await prismaUsersRepository.create({
    name,
    email,
    password_hash,
  })
}
