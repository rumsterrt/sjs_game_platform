import React from 'react'
import { observer, useDoc } from 'startupjs'
import { H3 } from '@startupjs/ui'
import { withRouter } from 'react-router-native'
import TemplateForm from 'main/components/TemplateForm'
import './index.styl'

const PLibrary = ({ location, match }) => {
  const templateId = match.params.templateId
  const [template = {}] = useDoc('templates', templateId)

  return pug`
    H3.centerText #{template.name || "New template"}
    TemplateForm(templateId=templateId initValues=template)
  `
}

export default withRouter(observer(PLibrary))
