import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '../repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { Decimal } from '@prisma/client/runtime/library'

let gynsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gynsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gynsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gynsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: new Decimal(-23.9213204),
      longitude: new Decimal(-46.366962),
    })

    await gynsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: new Decimal(23.6234724),
      longitude: new Decimal(-46.6015388),
    })
    const { gyms } = await sut.execute({
      userLatitude: -23.9213204,
      userLongitude: -46.366962,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({
        title: 'Near Gym',
      }),
    ])
  })
})
