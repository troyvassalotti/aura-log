import { createSeriesSimple } from "../lib/utils";
import { Base } from "./Base";

/**
 * @tag pie-chart
 * @summary Displays a pie chart.
 * @property {string} logdata - The dataset from each log to display.
 */
export class PieChart extends Base {
  static properties = {
    ...super.properties,
    logdata: { type: String },
  };

  constructor() {
    super();
    this.logdata;
  }

  /**
   * Headache data filtered by the component's logdata.
   * @returns {FlatArray<*[], 1>[]}
   * @private
   */
  get #values() {
    if (this.logdata) {
      return Object.values(this._data)
        .map((value) => value[this.logdata])
        .flat();
    }
  }

  /**
   * De-duplicate the generated values
   * @see #values
   * @returns {*[]}
   * @private
   */
  get #unique() {
    return [...new Set(this.#values)].sort();
  }

  /**
   * Chart options.
   */
  get chartOptions() {
    return {
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      chart: {
        type: "pie",
      },
      legend: {
        labelFormatter() {
          return `${this.name}: <b>${Math.round(this.percentage)}%</b>`;
        },
      },
      plotOptions: {
        pie: {
          innerSize: "50%",
          showInLegend: true,
        },
        series: {
          states: {
            hover: {
              halo: false,
            },
          },
        },
      },
      series: [
        {
          name: this.logdata,
          colorByPoint: true,
          data: createSeriesSimple(this.#unique, this.#values),
        },
      ],
      tooltip: {
        pointFormat: "Count: <b>{point.y}</b>",
      },
    };
  }
}

window.customElements.define("pie-chart", PieChart);
