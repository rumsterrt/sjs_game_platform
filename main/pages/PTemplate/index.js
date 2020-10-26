import React from 'react'
import { observer, emit, useQuery } from 'startupjs'
import { Span, Card, Row, Button } from '@startupjs/ui'
import { Table } from 'components'
import { withRouter } from 'react-router-native'
import TemplateForm from 'main/components/TemplateForm'
import './index.styl'

const LIMIT = 10

const PLibrary = ({ location, match }) => {
  const templateId = match.params.templateId
  console.log('templateId', templateId)
  return pug`
    TemplateForm(isLocked=!!templateId initValues={})
  `
}

export default withRouter(observer(PLibrary))
