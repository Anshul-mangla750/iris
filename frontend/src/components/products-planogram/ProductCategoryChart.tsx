import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { CategoryDistribution } from '../../types/product';
import { CATEGORY_DISTRIBUTION_MOCK } from '../../data/productPlanogramMockData';

interface ProductCategoryChartProps {
  distribution: CategoryDistribution;
}

export const ProductCategoryChart: React.FC<ProductCategoryChartProps> = ({ distribution }) => {
  const totalProducts = distribution?.totalProducts ?? 1248;
  const categories =
    distribution?.categories && distribution.categories.length > 0
      ? distribution.categories
      : CATEGORY_DISTRIBUTION_MOCK.categories;

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-xs flex flex-col h-full min-h-[340px]">
      {/* Title */}
      <h2 className="text-sm font-bold text-slate-900 tracking-tight mb-2">
        Product Category Distribution
      </h2>

      {/* Content: Donut + Legend */}
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Donut Chart with Center Text */}
        <div className="relative w-full sm:w-[50%] h-[200px] flex items-center justify-center shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={2}
                dataKey="percentage"
                strokeWidth={0}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-extrabold text-slate-900 leading-none">
              {totalProducts.toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-slate-500 mt-1">
              Products
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="w-full sm:w-[50%] space-y-1.5 pr-2">
          {categories.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs py-0.5 hover:bg-slate-50 rounded px-1.5 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-700 truncate font-medium text-[11px]">
                  {item.name}
                </span>
              </div>
              <span className="font-bold text-slate-900 text-[11px] shrink-0 ml-2">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryChart;
