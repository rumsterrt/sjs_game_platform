import * as pages from './pages'
import getRoutes from './routes'
import 'antd/dist/antd.less'
import 'antd/dist/antd.css'

export { default as Layout } from './Layout'
export const routes = getRoutes(pages)
