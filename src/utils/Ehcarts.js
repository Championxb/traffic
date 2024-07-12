import * as echarts from "echarts";

import { BarChart, LineChart, PieChart } from "echarts/charts";

//引入提示框和标题组件
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  LegendComponent,
} from "echarts/components";

//标签自动布局，全局过渡动画
import { LabelLayout, UniversalTransition } from "echarts/features";

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  ToolboxComponent,
  LegendComponent,
  BarChart,
  LineChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

export default echarts;
