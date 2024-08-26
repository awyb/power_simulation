
import { Registry, Point } from '@antv/x6'

Registry.registerRouter('random',
  (vertices, args, view) =>
  {
    const BOUNCES = args.bounces || 20
    const points = vertices.map((p) => Point.create(p))

    for (let i = 0; i < BOUNCES; i += 1)
    {
      const sourceCorner = view.sourceBBox.getCenter()
      const targetCorner = view.targetBBox.getCenter()
      const randomPoint = Point.random(
        sourceCorner.x,
        targetCorner.x,
        sourceCorner.y,
        targetCorner.y,
      )
      points.push(randomPoint)
    }
    return points
  }, true)

Registry.registerRouter('manhattan',
  (vertices, options, edgeView) =>
  {
  // 获取起始节点和终止节点的位置
    const sourceBBox = edgeView.sourceBBox
    const targetBBox = edgeView.targetBBox

    // 根据起始和终止节点的位置计算中间路径
    const route = new ManhattanRoute()
    route.addPoint(sourceBBox.center.x, sourceBBox.center.y)
    route.addPoint(targetBBox.center.x, targetBBox.center.y)

    // 返回计算后的路径
    return route.path
  }, true)

class ManhattanRoute
{
  constructor()
  {
    this.points = []
  }

  addPoint(x, y)
  {
    this.points.push({ x, y })
  }

  get path()
  {
    // 返回计算的路径点
    return this.points
  }
}
