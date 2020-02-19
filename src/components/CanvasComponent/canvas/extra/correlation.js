/**
 * features: [string]
 * correlations: [[string]]
 * width: Number,
 * point: {x: y}
 */

import Layer from '../Core'
import square from './square'
import { getSuitableFont } from './square'
import { measureText } from '../Core/Paths/text'

const TEXT_ANGLE = -Math.PI / 4
const TEXT_FONT = 12
const TEXT_FAMILY = 'Lato'
const TEXT_COLOR = '#000'

const PRECOLORS = [
  '#3135A6',
  '#5B96FB',
  '#BFEBFF',
  '#E8F6FF',
  '#FF81D9',
  '#EC4B56',
  '#C70861'
]
const START = 1
const END = -1
const BETWEEN = 0.25

const CorrelationComp = {
  drawCorrelation(obj, parent, name) {
    obj.canvas = parent ? parent.$canvas : obj.canvas
    obj.struct = struct
    if (parent) {
      if (!name) {
        name = Layer.getUUID('text')
      }
      parent.drawLayer(name, obj)
      return name
    } else {
      return new Layer(obj)
    }
  },
  events: {
    newFeatures(features) {
      const lay = this
      lay.setCus('newFeatures', () => {
        lay.features = features
      })
    },
    scale(time, point = { x: 0, y: 0 }) {
      const lay = this
      lay.setCus('scale', () => {
        lay.point = Layer.scaleDistanceForPoint(lay.point, point, time)
        lay.width = Layer.toFixed(lay.width * time)
        lay.textFont = Layer.toFixed(lay.textFont * time)
        lay.eachWidth = Layer.toFixed(lay.eachWidth * time)
      })
    }
  }
}

function struct() {
  const lay = this
  lay.textFont = lay.textFont || TEXT_FONT
  lay.drawInstance = lay.drawInstance || new Correlation(lay.features, lay.correlations, lay)
  lay.drawInstance.checkShowing(lay.features)
}

export default CorrelationComp

class Correlation {
  constructor(features, contents, lay) {
    this.features = features
    this.contents = contents
    this.newFeatures = features
    this.lay = lay
    this.betweenFont = 0.5
    this.eachWidth = 0
    this.squareList = new Map()
    this.featurePadding = 1.6
    this.featureDistance = 4
    this.getInstance()
  }
  getLongestFeatureStyle(textFontSize) {
    let longest = ''
    for (const item of this.newFeatures) {
      if (item.length > longest.length) {
        longest = item
      }
    }
    const stylus = measureText(this.lay.$ctx, longest, {
      font: textFontSize + 'px ' + TEXT_FAMILY
    }, TEXT_ANGLE)
    const eachWidth = (this.lay.width - stylus.xlength * this.featurePadding - this.featureDistance) / this.newFeatures.length
    const fontSize = getSuitableFont(this.lay.$ctx, this.contents[0][0].toString(), eachWidth, TEXT_FAMILY)
    if (fontSize + this.betweenFont < textFontSize || fontSize - this.betweenFont > textFontSize) {
      const change = (fontSize - textFontSize) / 2
      const finalChange = Math.abs(change) < this.betweenFont ? (change < 0 ? -this.betweenFont : this.betweenFont) : change
      return this.getLongestFeatureStyle(textFontSize + finalChange)
    } else {
      this.eachWidth = eachWidth
      this.lay.eachWidth = this.eachWidth
      this.lay.distance = stylus
      this.lay.textFont = textFontSize
      return textFontSize
    }
  }
  getInstance() {
    const rever = [...this.features].reverse()
    for (let i = 0; i < rever.length; i++) {
      for (let j = 0; j < this.features.length; j++) {
        const sq = new SquareInfo({
          width: 0,
          content: Layer.toFixed(this.contents[j][i]),
          x: this.features[j],
          y: rever[i]
        })
        this.squareList.set(this.features[j] + '_' + rever[i], sq)
      }
    }
  }
  checkpos() {
    const point = this.lay.point
    const distance = this.lay.distance
    const eachWidth = this.lay.eachWidth
    const x = point.x
    const y = point.y
    const rever = [...this.newFeatures].reverse()
    for (let i = 0; i < rever.length; i++) {
      const finalPosY = y + (i + 0.5) * eachWidth
      for (let j = 0; j < this.newFeatures.length; j++) {
        const finalPosX = x + distance.xlength * this.featurePadding + this.featureDistance + (j + 0.5) * eachWidth
        const comp = this.squareList.get(this.newFeatures[j] + '_' + rever[i])
        comp.width = eachWidth
        comp.point = { x: finalPosX, y: finalPosY }
        comp.getInstance(this.lay)
      }
    }
  }
  checkTextPos() {
    const point = this.lay.point
    const distance = this.lay.distance
    const eachWidth = this.lay.eachWidth
    const x = point.x
    const y = point.y
    const rever = [...this.newFeatures].reverse()
    const yForFeaturex = y + this.newFeatures.length * eachWidth + distance.ylength * (this.featurePadding - 1) / 2 + this.featureDistance
    for (let i = 0; i < this.newFeatures.length; i++) {
      const xForFeaturex = x + distance.xlength * this.featurePadding + (i + 0.5) * eachWidth
      Layer.component.text.drawText({
        props: {
          point: { x: xForFeaturex, y: yForFeaturex },
          text: this.newFeatures[i],
          style: {
            font: this.lay.textFont + 'px ' + TEXT_FAMILY,
            fillStyle: TEXT_COLOR
          },
          position: Layer.component.text.RIGHT,
          angle: TEXT_ANGLE
        }
      }, this.lay, '_x_' + this.newFeatures[i])
    }
    const xForFeatureY = x + (this.featurePadding / 2 + 0.5) * distance.xlength
    for (let i = 0; i < rever.length; i++) {
      const yForFeatureY = y + (i + 0.5) * eachWidth
      Layer.component.text.drawText({
        props: {
          point: { x: xForFeatureY, y: yForFeatureY },
          text: rever[i],
          style: {
            font: this.lay.textFont + 'px ' + TEXT_FAMILY,
            fillStyle: TEXT_COLOR
          },
          position: Layer.component.text.RIGHT,
          angle: TEXT_ANGLE
        }
      }, this.lay, '_y_' + rever[i])
    }
  }
  checkShowing(newFeatures) {
    this.newFeatures = newFeatures
    if (!this.lay.eachWidth || newFeatures.length !== this.features.length) {
      this.getLongestFeatureStyle(this.lay.textFont)
    } else {
      let longest = ''
      for (const item of this.newFeatures) {
        if (item.length > longest.length) {
          longest = item
        }
      }
      this.lay.distance = measureText(this.lay.$ctx, longest, {
        font: this.lay.textFont + 'px ' + TEXT_FAMILY
      }, TEXT_ANGLE)
    }
    this.checkpos()
    this.checkTextPos()
    if (newFeatures.length < this.features.length) {
      const reverOrigin = [...this.features].reverse()
      for (let i = 0; i < reverOrigin.length; i++) {
        for (let j = 0; j < this.features.length; j++) {
          this.lay.$children.get(this.features[j] + '_' + reverOrigin[i]).emit('showSquare', false)
        }
      }
      for (const item1 of this.features) {
        this.lay.$children.get('_x_' + item1).emit('$hide')
        this.lay.$children.get('_y_' + item1).emit('$hide')
      }
      const rever = [...newFeatures].reverse()
      for (let i = 0; i < rever.length; i++) {
        for (let j = 0; j < newFeatures.length; j++) {
          this.lay.$children.get(this.features[j] + '_' + rever[i]).emit('showSquare', true)
        }
      }
      for (const item2 of newFeatures) {
        this.lay.$children.get('_x_' + item2).emit('$showing')
        this.lay.$children.get('_y_' + item2).emit('$showing')
      }
    }
  }
}

class SquareInfo {
  constructor(obj) {
    this.point = obj.point || {}
    this.width = obj.width || 0
    this.content = obj.content || '-'
    this.featureX = obj.x || ''
    this.featureY = obj.y || ''
    debugger
    this.color = obj.color || this.getColorForNum(this.content)
  }
  RangeAxis() {
    const final = []
    let s = START
    let e = END
    if (s < e) {
      const m = s
      s = e
      e = m
    }
    let val = s
    while (val >= e) {
      final.push(val)
      val -= BETWEEN
    }
    return final
  }
  getColorForNum(num) {
    if (num === '-') return '#F8F8FA'
    const range = parseFloat(Math.floor((START - num) / BETWEEN * 100) / 100)
    const eachChange = parseFloat(
      Math.floor(PRECOLORS.length / this.RangeAxis().length * 100) / 100
    )
    const poinExchangeToColor = eachChange * range > 6 ? 6 : eachChange * range
    const startColor = Layer.toRGBA(
      PRECOLORS[Math.floor(poinExchangeToColor)]
    )
    const endColor = Layer.toRGBA(PRECOLORS[Math.ceil(poinExchangeToColor)])
    const change = poinExchangeToColor - Math.floor(poinExchangeToColor)
    const colorS = startColor
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
    const colorE = endColor
      .replace('rgba(', '')
      .replace(')', '')
      .split(',')
    const re = -(parseInt(colorS[0]) - parseInt(colorE[0])) * change
    const ge = -(parseInt(colorS[1]) - parseInt(colorE[1])) * change
    const be = -(parseInt(colorS[2]) - parseInt(colorE[2])) * change
    const final = [
      parseInt(colorS[0]) + re,
      parseInt(colorS[1]) + ge,
      parseInt(colorS[2]) + be
    ]
    return 'rgb(' + final.join(',') + ')'
  }
  getInstance(lay) {
    square.drawSquare({
      props: {
        point: this.point,
        width: this.width,
        color: this.color,
        content: this.content,
        featureX: this.featureX,
        featureY: this.featureY
      },
      events: square.events
    }, lay, this.featureX + '_' + this.featureY)
  }
}
