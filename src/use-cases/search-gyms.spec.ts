import { expect, describe, it, beforeEach } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'

let gynsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gynsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gynsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gynsRepository.create({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })

    await gynsRepository.create({
      title: 'TypeScript Gym',
      description: null,
      phone: null,
      latitude: 0,
      longitude: 0,
    })
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gynsRepository.create({
        title: `JavaScript Gym ${i}`,
        description: null,
        phone: null,
        latitude: 0,
        longitude: 0,
      })
    }
    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym 21',
      }),
      expect.objectContaining({
        title: 'JavaScript Gym 22',
      }),
    ])
  })
})
