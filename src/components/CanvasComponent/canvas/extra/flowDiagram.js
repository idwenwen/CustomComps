/**
 * dagInfo : api data
 *
 */
import Layer from '../Core'
import Progress from '../extra/modules'
import { calculation } from '../Core/Paths/line'
import { measureText } from '../Core/Paths/text'
import { FONT_SIZE, FONT_FAMILY } from './modules'

const LINE_STLYE = '#BBBBC8'
const LINE_WIDTH_FOR_LINKING = 2
const COMP_PADDING = 12

const TOPPEST = 20
const COMP_BETWEEN = 15
const INNER_BETWEEN = 15
const LEVEL_BETWEEN = 50

const flowDiagram = {
  drawDiagram(obj, parent, name) {
    obj.canvas = parent ? parent._$canvas : obj.canvas
    obj.struct = struct
    if (parent) {
      if (!name) {
        name = Layer.getUUID('progress')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  SUCCESS: Progress.type.SUCCESS,
  FAIL: Progress.type.FAIL,
  RUNNING: Progress.type.RUNNING,
  UNRUN: Progress.type.UNRUN,
  explaination: DiagramInfo,
  events: {
    scale(time, point = { x: 0, y: 0 }, after) {
      const lay = this
      const trans = lay.$meta.get('$translate') || { x: 0, y: 0 }
      point = { x: point.x - trans.x, y: point.y - trans.y }
      lay.setCus('scale', () => {
        lay.toppest = Layer.scaleDistanceForPoint(lay.toppest, point, time)
        lay.padding = Layer.toFixed(lay.padding * time)
        lay.fontSizeForContent = Layer.toFixed(lay.fontSizeForContent * time)
        lay.lineWidthForLinking = Layer.toFixed(lay.lineWidthForLinking * time)
        lay.componentBetween = Layer.toFixed(lay.componentBetween * time)
        lay.innerBetween = Layer.toFixed(lay.innerBetween * time)
        lay.levelBetween = Layer.toFixed(lay.levelBetween * time)
        if (after) {
          after.call(lay)
        }
      })
    },
    toSuccess(name, img) {
      const lay = this
      Progress.animations.toNewType.call(lay.$children.get(name), Progress.type.SUCCESS, img)
    },
    toComplete(name, img) {
      const lay = this
      Progress.animations.toNewType.call(lay.$children.get(name), Progress.type.SUCCESS, img)
    },
    toFail(name, img) {
      const lay = this
      Progress.animations.toNewType.call(lay.$children.get(name), Progress.type.FAIL, img)
    },
    toError(name, img) {
      const lay = this
      Progress.animations.toNewType.call(lay.$children.get(name), Progress.type.FAIL, img)
    },
    toRunning(name, time) {
      const lay = this
      Progress.animations.toNewType.call(lay.$children.get(name), Progress.type.RUNNING, time)
    },
    toType(obj) {
      const lay = this
      for (const key in obj) {
        Progress.animations.toNewType.call(lay.$children.get(key), obj[key].type, obj[key].props)
      }
    }
  }
}

function struct() {
  const lay = this
  const dagInfo = lay.dagInfo
  lay.lineWidthForLinking = lay.lineWidthForLinking || LINE_WIDTH_FOR_LINKING
  lay.padding = lay.padding || COMP_PADDING
  lay.fontSizeForContent = lay.fontSizeForContent || FONT_SIZE
  lay.toppest = lay.toppest || { x: lay.$canvas.width / 2, y: TOPPEST }
  lay.componentBetween = (lay.componentBetween || COMP_BETWEEN)
  lay.innerBetween = (lay.innerBetween || INNER_BETWEEN)
  lay.levelBetween = (lay.levelBetween || LEVEL_BETWEEN)
  const info = new DiagramInfo(lay, dagInfo)
  lay.$meta.set('clear', info.getStyleOfDag())
  lay._inited = true
}

export default flowDiagram

class DiagramInfo {
  constructor(lay, obj) {
    this.level = []
    this.root = []
    this.linking = {}
    this.components = new Map()
    this.size = 0
    this.lay = lay
    this.componentInfo(obj.component_list) // 组件基本信息设置
    this.componentDisable(obj.component_need_run) // 组件非运行状态核对设置
    this.componentBelone(obj.component_module) // 组件类型设置
    this.componentLink(obj.dependencies) // 组件关联关系设置
    this.componentCheckWidthAndHeight() // 组件展示长宽计算
    this.checkPos() // 组件位置计算
    this.componentGetInstance() // 组件实例化
    this.getLinking() // 获取链接曲线
    this.getLinkInstance() // 链接曲线实例化
  }
  componentInfo(list) {
    for (const val of list) {
      this.components.set(val.component_name, new CompExpression(val))
    }
  }
  componentDisable(obj) {
    for (const key in obj) {
      this.components.get(key).setDisable(obj[key])
    }
  }
  componentBelone(obj) {
    for (const key in obj) {
      this.components.get(key).setBelone(obj[key])
    }
  }
  componentLink(obj) {
    for (const name in obj) {
      for (const item of obj[name]) {
        const parent = this.components.get(item.component_name)
        const child = this.components.get(name)
        if (child.level <= parent.level) {
          child.level = parent.level + 1
        }
        this.linking[item.type] = this.linking[item.type] || []
        this.linking[item.type].push([item.component_name, name])
      }
    }
    for (const val of this.components) {
      this.level[val[1].level] = this.level[val[1].level] || []
      this.level[val[1].level].push(val[1])
      if (val[1].level === 0) {
        this.root.push(val[1])
      }
    }
  }
  componentCheckWidthAndHeight() {
    let longest = ''
    for (const val of this.components) {
      (val[0].length > longest.length) && (longest = val[0])
    }
    const styleInfo = measureText(this.lay.$ctx, longest, { font: this.lay.fontSizeForContent + 'px ' + FONT_FAMILY })
    const width = Math.ceil(styleInfo.width) + this.lay.padding * 2
    const height = this.lay.fontSizeForContent + this.lay.padding
    this.compWidth = width
    this.compHeight = height
    for (const val of this.components) {
      val[1].width = width
      val[1].height = height
    }
  }
  checkPos() {
    const lay = this.lay
    if (!lay._inited) {
      const style = this.getStyleOfDag()
      if (style.height < (lay.$canvas.height - lay.toppest.y * 2)) {
        lay.toppest.y = (lay.$canvas.height - style.height) / 2
      }
    }
    let top = this.lay.toppest.y
    const width = this.compWidth
    const height = this.compHeight
    const center = this.lay.toppest.x
    const getInList = function(topto, size, index) {
      const firstX = center - (size - 1) * (width + lay.componentBetween) / 2
      return { x: firstX + index * (width + lay.componentBetween), y: index * (height + lay.innerBetween) + topto + height / 2 }
    }
    for (const val of this.level) {
      for (let i = 0; i < val.length; i++) {
        val[i].setPos(getInList(top, val.length, i))
      }
      top = val[val.length - 1].point.y + this.lay.levelBetween + height / 2
    }
  }
  componentGetInstance() {
    for (const val of this.components) {
      val[1].getComponentInstance(this.lay)
    }
  }
  getLinking() {
    this.linkPos = {}
    for (const key in this.linking) {
      this.linkPos[key] = this.linkPos[key] || []
      for (const val of this.linking[key]) {
        const link = { line: [] }
        link.line.push(this.lay.$children.get(val[0]).$meta.get('port').get(key + 'Output'))
        link.line.push(this.lay.$children.get(val[1]).$meta.get('port').get(key + 'Input'))
        const p = this.components.get(val[0])
        const c = this.components.get(val[1])
        link.corssLevel = ((c.level - p.level) >= 2)
        this.linkPos[key].push(link)
      }
    }
  }
  getLinkInstance() {
    for (const key in this.linkPos) {
      for (const val of this.linkPos[key]) {
        const distance = this.lay.levelBetween
        const horizon = val.corssLevel
          ? (key.match('data') ? -this.compWidth / 3 : this.compWidth / 3)
          : false
        const points = calculation(val.line[0], val.line[1], horizon, distance)
        Layer.component.line.drawLine({
          props: {
            point: points,
            curve: true,
            stroke: true,
            style: {
              lineWidth: this.lay.lineWidthForLinking,
              strokeStyle: LINE_STLYE
            }
          }
        }, this.lay)
      }
    }
  }
  getStyleOfDag() {
    let longest = 0
    let dagWidth = 0
    let dagHeight = 0
    for (const item of this.level) {
      if (item.length > longest) {
        longest = item.length
      }
      dagHeight += item.length * this.compHeight + (item.length - 1) * this.lay.innerBetween + this.lay.levelBetween
    }
    dagHeight -= this.lay.levelBetween
    dagWidth = (longest * this.compWidth) + (longest - 1) * this.lay.componentBetween
    return { width: dagWidth, height: dagHeight }
  }
}

class CompExpression {
  constructor(obj) {
    this.name = obj.component_name
    this.time = obj.time
    this.type = this.getStatus(obj.status || 'unrun')
    this.level = 0
    this.width = 0
    this.height = 0
  }
  getStatus(status) {
    const type = status.toUpperCase()
    if (Progress.type.SUCCESS.indexOf(type) >= 0) {
      return Progress.type.SUCCESS
    } else if (Progress.type.FAIL.indexOf(type) >= 0) {
      return Progress.type.FAIL
    } else if (Progress.type.RUNNING.indexOf(type) >= 0) {
      return Progress.type.RUNNING
    } else {
      return Progress.type.UNRUN
    }
  }
  setDisable(disable) {
    this.disable = disable
  }
  setBelone(Belone) {
    this.belone = Belone
    this.setPort()
  }
  setPos(point) {
    this.point = point
  }
  setPort() {
    this.dataInput = true
    this.dataOutput = true
    this.modelInput = true
    this.modelOutput = true
    if (this.belone.toLowerCase().match(/(intersection|federatedsample|evaluation|upload|download|rsa)/i)) {
      this.modelInput = false
      this.modelOutput = false
    }
    if (this.belone.toLowerCase().match(/(evaluation|upload|download)/i)) {
      this.dataOutput = false
    }
    if (this.belone.toLowerCase().match(/(pearson)/i)) {
      this.dataOutput = false
    }
  }
  getComponentInstance(lay) {
    Progress.drawProgress({
      props: {
        point: this.point,
        text: this.name,
        width: this.width,
        height: this.height,
        type: lay.$children.get(this.name) ? lay.$children.get(this.name).type : this.type,
        disable: this.disable,
        dataInput: this.dataInput,
        dataOutput: this.dataOutput,
        modelInput: this.modelInput,
        modelOutput: this.modelOutput,
        contentFontSize: lay.fontSizeForContent,
        time: lay.$children.get(this.name) ? lay.$children.get(this.name).time : this.time
      },
      zindex: 1,
      events: Progress.events
    }, lay, this.name)
  }
}
