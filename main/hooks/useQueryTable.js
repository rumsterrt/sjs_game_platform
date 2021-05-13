import React from 'react'
import { useQuery } from 'startupjs'
import _isArray from 'lodash/isArray'
import _get from 'lodash/get'

const getItemsQuery = ({ isAggregate, limit, currentPage, query = {} }) =>
  isAggregate
    ? {
        $aggregate: [
          ...(query || []),
          {
            $addFields: {
              id: '$_id'
            }
          },
          { $skip: limit * currentPage },
          { $limit: limit }
        ]
      }
    : { ...(query || {}), $limit: limit, $skip: limit * currentPage }

const getTotalQuery = ({ isAggregate, query }) =>
  isAggregate ? { $aggregate: [...(query || []), { $count: 'totalCount' }] } : { ...(query || {}), $count: true }

export default (collection, { query, limit = 10, initPage = 0 }) => {
  const [currentPage, setCurrentPage] = React.useState(initPage)
  const isAggregate = _isArray(query)
  const [data = [], $data] = useQuery(collection, getItemsQuery({ isAggregate, limit, query, currentPage }))
  const [count] = useQuery(collection, getTotalQuery({ isAggregate, query }))
  const totalCount = (isAggregate ? _get(count, '[0].totalCount') || 0 : count) || 0

  const pagination = {
    page: currentPage,
    pages: Math.ceil(totalCount / limit),
    onChangePage: setCurrentPage
  }

  return [{ totalCount, items: data || [], pagination }, $data]
}
