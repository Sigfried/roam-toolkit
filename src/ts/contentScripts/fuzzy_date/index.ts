import * as chrono from 'chrono-node'
import {afterClosingBrackets} from '../../utils/brackets'
import {RoamDate} from '../../date/common'
import {RoamNode, Selection} from '../../roam/roam-node'
import {Roam} from '../../roam/roam'
import {NodeWithDate} from '../../date/withDate'

export const guard = ';'
const dateContainerExpr = /;(.{3,}?);/gm

const getCursor = (node: RoamNode, newText: string, searchStart: number = 0) =>
    node.text === newText ? node.selection.start : afterClosingBrackets(newText, searchStart)

export function replaceFuzzyDate() {
    Roam.applyToCurrent(node => {
        const match = node.text.match(dateContainerExpr)
        if (!match) return node

        const dateStr = match[0]
        const date = chrono.parseDate(dateStr, new Date(), {
            forwardDate: true,
        })
        if (!date) return node

        let replaceMode = dateStr.startsWith(';:')

        let replaceWith = replaceMode ? '' : RoamDate.formatPage(date)
        const newText = node.text.replace(dateContainerExpr, replaceWith)

        const cursor = getCursor(node, newText, replaceMode ? 0 : node.selection.start)
        const newNode = new NodeWithDate(newText, new Selection(cursor, cursor))

        return replaceMode ? newNode.withDate(date) : newNode
    })
}
