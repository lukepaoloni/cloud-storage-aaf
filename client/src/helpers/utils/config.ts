import { join } from 'path'
import { createBrowserHistory } from "history"

export const pubDir = join(__dirname, '../../', 'public')

export const history = createBrowserHistory()