export const MetricsSummaryCard = ({
  title,
  amount,
  change,
  trend,
  icon,
  bgColor,
}) => (
  <div
    className={`flex w-full flex-col gap-6 rounded-lg border bg-gray-50 p-2`}
  >
    <div className="flex justify-between">
      <div className="flex flex-col">
        <h1 className="primaryText text-lg font-medium">{title}</h1>
        <p
          className={`${trend === "up" ? "successRateText" : "failureRateText"} flex w-15 items-center justify-center rounded-md`}
        >
          {change}
        </p>
      </div>

      <div>
        <i className={`${icon} rounded-full bg-white p-1 text-neutral-600`}></i>
      </div>
    </div>
    <p className="text-2xl font-semibold">{amount}</p>
  </div>
);
