import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './use-cases/register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from './repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './use-cases/errors/user-already-exists-error'

describe('Register Use Case', () => {
  it('should be able to register', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const isPasswordCorrecltyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrecltyHashed).toEqual(true)
  })

  it('should not be able to register with same email twice', async () => {
    const UsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUseCase(UsersRepository)

    const email = 'johndoe@example.com'

    await registerUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(() =>
      registerUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
