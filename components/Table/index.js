import React, { useState, useEffect } from 'react'
import { Table, Thead, Tbody, Tr, Th, Td, Collapse, Pagination, Row, H3, Div, Span } from '@startupjs/ui'
import { ScrollView } from 'react-native'
import './index.styl'

const CollapseHeader = Collapse.Header

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

      return pug`
        Collapse.collapse(
          key=index
          open=isOpen
          onChange=() => handleExpand(!isOpen, row)
          styleName=[{[colorScheme]: true, odd: index%2 > 0}]
          variant='pure'
        )
          CollapseHeader(iconPosition='left')
            Tr.row(key=index styleName=[{odd: index%2 > 0}])
              each column, colIndex in columns
                Td.data(
                  key=column.key
                  styleName=[{first: colIndex === 0, last:colIndex === columns.length - 1}]
                )
                  Span.mobileHead #{column.title}
                  =columnMap[column.key] && columnMap[column.key].render(row, index, pagination)
        Div.collapseContent
          =isOpen && expandedRowRender(row)
    `
    }

    return pug`
      Tr.row(key=index styleName=[{odd: index%2 > 0, [colorScheme]: true}])
        each column, colIndex in columns
          Td.data(
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
    ScrollView.tableWrapper
      Table.table
        Thead.head
          Tr.row.head(styleName=[{[colorScheme]: true}])
            each column, index in columns
              Th.headData(key=column.key styleName=[{first: index === 0, last: index === columns.length - 1 }])
                Span.headText #{column.title}
        Tbody.body
          each row, index in dataSource
            =renderRow(row, index)
      =renderPagination()
  `
}

export default CustomTable
