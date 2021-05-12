import React, { useState } from 'react'
import { Loader as SJSLoader, Div } from '@startupjs/ui'
import { useLocal, observer } from 'startupjs'
import './index.styl'

const useLoader = (() => {
  let currentOwnerId, status
  let handleStatus = () => ({})

  return ([topbarProgress, $topbarProgress] = []) => {
    const [controlsId] = useState(setTimeout(() => ({})))

    if (topbarProgress !== undefined) {
      status = topbarProgress
    }

    if ($topbarProgress) {
      handleStatus = (...args) => $topbarProgress.set(...args)
    }

    const set = (flag) => {
      if (flag) {
        currentOwnerId = controlsId
        handleStatus(true)
      } else {
        if (controlsId === currentOwnerId) {
          handleStatus(false)
        }
      }
    }

    return [status, set]
  }
})()

const Loader = observer(() => {
  const [loader] = useLoader(useLocal('_session.loader'))

  return pug`
    if loader
      Div.loader
        SJSLoader(color='#00AED6')
  `
})

export { Loader, useLoader }
