import { GAME_STATUSES } from 'main/constants'

export const teacherGames = (teacherId) => ({
  query: [
    {
      $match: {
        teacherId: { $in: [teacherId] },
        status: GAME_STATUSES.FINISHED
      }
    },
    {
      $lookup: {
        from: 'templates',
        localField: 'templateId',
        foreignField: '_id',
        as: 'template'
      }
    },
    { $unwind: { path: '$template' } },
    { $sort: { playerIds: -1, createdAt: -1 } }
  ]
})

export const playerGames = (playerId) => ({
  query: [
    {
      $match: {
        status: GAME_STATUSES.FINISHED,
        playerIds: { $in: [playerId] }
      }
    },
    {
      $lookup: {
        from: 'templates',
        localField: 'templateId',
        foreignField: '_id',
        as: 'template'
      }
    },
    { $unwind: { path: '$template' } },
    {
      $lookup: {
        from: 'users',
        localField: 'teacherId',
        foreignField: '_id',
        as: 'teacher'
      }
    },
    { $unwind: { path: '$teacher' } },
    {
      $sort: { playerIds: -1 }
    }
  ]
})
