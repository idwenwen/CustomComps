import lifeCycle from './lifeCycle'
import options from './options'
import drawing from './drawing'
import event from './event'
import animation from './animation'

export default function Layer(obj) {
  const lay = this
  lay._InitLifeCycle(obj)
  lay._InitOptions(obj)
  lay._InitEvents(obj)
  lay._InitAnimation(obj)
}

lifeCycle(Layer)
options(Layer)
drawing(Layer)
event(Layer)
animation(Layer)
