import React, { useState, useEffect } from 'react'
import { Collapse, Pagination, Row, H3, Div, Span } from '@startupjs/ui'
import './index.styl'

const CollapseHeader = Collapse.Header
const CollapseContent = Collapse.Content

const CustomTable = ({
  pagination,
  dataSource,
  columns,
  onExpand,
  expandAll,
  expandedRowRender,
  rowKey,
  title,
  colorScheme,
  ...props
}) => {
  const [columnMap, setColumnMap] = useState({})
  const [expandedGameId, setExpandedGameId] = useState()
  useEffect(() => {
    if (!columns) {
      return
    }
    setColumnMap(columns.reduce((acc, item) => ({ ...acc, [item.key]: item }), {}))
  }, [JSON.stringify(columns)])

  const handleExpand = (expanded, record) => {
    if (expandAll) {
      return
    }
    setExpandedGameId(expanded ? record.id : null)
    onExpand && onExpand(expanded, record)
  }

  const renderPagination = () => {
    if (!pagination) {
      return null
    }
    const { pages, page, onChangePage } = pagination

    return pug`
      Row.pagination(align='center')
        Pagination(
          page=page
          pages=pages
          onChangePage=onChangePage
        )
    `
  }

  const renderRow = (row, index) => {
    if (expandedRowRender) {
      const isOpen = expandAll || expandedGameId === rowKey(row)
      console.log('isOpen', { isOpen, row, expandedGameId, title })

      return pug`
        Collapse.collapse(
            key=index
            open=isOpen
            onChange=() => handleExpand(!isOpen, row)
            styleName=[{[colorScheme]: true, odd: index%2 > 0}]
            variant='pure'
          )
          CollapseHeader(iconPosition='left')
            Div.row(key=index styleName=[{odd: index%2 > 0}])
              each column, colIndex in columns
                Div.data(
                  key=column.key
                  styleName=[{first: colIndex === 0, last:colIndex === columns.length - 1}]
                )
                  Span.mobileHead #{column.title}
                  =columnMap[column.key] && columnMap[column.key].render(row, index, pagination)
          CollapseContent.collapseContent
            =expandedRowRender(row)
    `
    }

    return pug`
      Row.row(key=index styleName=[{odd: index%2 > 0, [colorScheme]: true}])
        each column, colIndex in columns
          Div.data(
            key=column.key
            styleName=[{first: colIndex === 0, last:colIndex === columns.length - 1}]
          )
            Span.mobileHead #{column.title}
            if columnMap[column.key]
              =columnMap[column.key].render(row, index, pagination)
            else
              Span ...
    `
  }

  return pug`
    if title
      Row.header
        H3 #{title}
    Div.tableWrapper
      Div.table
        Div.head
          Row.row.head(styleName=[{[colorScheme]: true}])
            each column, index in columns
              Div.headData(key=column.key styleName=[{first: index === 0, last: index === columns.length - 1, expanded: !!expandedGameId }])
                Span.headText #{column.title}
        Div.body
          if dataSource.length > 0
            each row, index in dataSource
              =renderRow(row, index)
          else
            Div.emptyData
              Span Empty
      =renderPagination()
  `
}

export default CustomTable
