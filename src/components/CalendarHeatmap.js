import * as d3 from "d3";
import { css } from "lit";
import { MONTHS, padString } from "../lib/utils";
import { Base } from "./Base";

/**
 * @tag calendar-heatmap
 * @summary Displays a calendar heatmap.
 */
export class CalendarHeatmap extends Base {
  static properties = {
    theme: { type: String },
  };
  constructor() {
    super();
    this.lib = "d3";
    this.theme = "purple";
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          font-family: system-ui;
          overflow: auto;
        }

        #container {
          inline-size: max(45rem, 100%);
        }

        text {
          font-family: system-ui;
        }

        text.yearLabel {
          font-size: 0.75rem;
        }

        .tooltip {
          background-color: #ffffff;
          border: 2px solid #000000;
          border-radius: 4px;
          color: #000000;
          position: absolute;
          padding: 0.25rem;
        }
      `,
    ];
  }

  /**
   * Tooltip Element
   * @type {HTMLElement}
   */
  get tooltipElement() {
    return this.renderRoot?.querySelector(".tooltip");
  }

  /**
   * An array of date and time for each headache.
   * It takes the master data's Date value and reduces it to a [YYYY-MM-DD, HH:MM] array from its original YYYYMMDDHHMM format.
   * @returns {Map<string, string>}
   * @private
   */
  get #values() {
    return new Map(
      this._data.map((value) => {
        const { date } = value;
        const dateObject = new Date(date);

        const year = dateObject.getFullYear();
        const month = padString(dateObject.getMonth() + 1);
        const day = padString(dateObject.getDate());
        const fullDate = `${year}-${month}-${day}`;

        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        const fullTime = `${padString(hours)}:${padString(minutes)}`;

        return [fullDate, fullTime];
      }),
    );
  }

  /**
   * The earliest and latest + 1 year of the dataset.
   * @returns {{start: number, end: number}}
   * @private
   */
  get #dates() {
    const all = [];

    for (const [key, value] of this.#values) {
      all.push(parseInt(key));
    }

    const min = Math.min.apply(null, all);
    const max = Math.max.apply(null, all);

    return {
      start: min,
      end: max + 1,
    };
  }

  /**
   * Theme for the chart based on the theme prop.
   * @param {string} theme
   * @returns {string[]} Color palette.
   */
  #chooseTheme(theme) {
    switch (theme) {
      case "orange":
        return [
          "#864313",
          "#b3591a",
          "#df7020",
          "#e58c4d",
          "#e58c4d",
          "#f2c6a6",
        ];
      case "blue":
        return [
          "#136086",
          "#1a7fb3",
          "#209fdf",
          "#4db2e5",
          "#79c6ec",
          "#a6d9f2",
        ];
      case "green":
        return [
          "#138626",
          "#1ab333",
          "#20df40",
          "#4de566",
          "#79ec8c",
          "#a6f2b2",
        ];
      case "purple":
        return [
          "#861386",
          "#b31ab3",
          "#df20df",
          "#e54de5",
          "#ec79ec",
          "#f2a6f2",
        ];
    }
  }

  /**
   * Use D3 to create a heatmap from the component's values.
   * @param data
   * @private
   */
  #createHeatmap(data) {
    const theme = {
      width: 960,
      height: 150,
      cellSize: 17,
      mainStrokeColor: "currentColor",
      defaultStrokeWidth: "0.1px",
      hoverStrokeWidth: "1px",
      outerBorderWidth: "1px",
      colorPalette: this.#chooseTheme(this.theme),
      gridFill: "none",
    };

    /** Create the color scale used for highlighting days. */
    const color = d3.scaleQuantize().domain([0, 23]).range(theme.colorPalette);

    /** Creates the containing `<svg>` for each yearly calendar view. */
    const svg = d3
      .select(this.chartContainer)
      .selectAll("svg")
      .data(d3.range(this.#dates.start, this.#dates.end))
      .enter()
      .append("svg")
      .attr("viewBox", `0 0 ${theme.width} ${theme.height}`)
      .attr("class", "calendar")
      .append("g")
      .attr(
        "transform",
        `translate(${(theme.width - theme.cellSize * 53) / 2}, ${
          theme.height - theme.cellSize * 7 - 1
        })`,
      ); /* Positions it in view */

    // Creates the rectangles representing days in each calendar
    svg
      .append("g")
      .attr("fill", theme.gridFill) /* Make the underlying grid transparent */
      .attr("stroke", theme.mainStrokeColor)
      .attr("stroke-width", theme.defaultStrokeWidth)
      .selectAll("rect")
      .data((dataValue) =>
        d3.timeDays(new Date(dataValue, 0, 1), new Date(dataValue + 1, 0, 1)),
      )
      .enter()
      .append("rect")
      .attr("class", "day")
      .attr("width", theme.cellSize)
      .attr("height", theme.cellSize)
      .attr(
        "x",
        (dataValue) =>
          d3.timeWeek.count(d3.timeYear(dataValue), dataValue) * theme.cellSize,
      ) /* Position it on the X axis */
      .attr(
        "y",
        (dataValue) => dataValue.getDay() * theme.cellSize,
      ) /* Position it on the Y axis */
      .datum(d3.timeFormat("%Y-%m-%d"))
      .attr("fill", (dataValue) => color(parseInt(data.get(dataValue))));

    // Create the borders between the months
    svg
      .append("g")
      .attr("fill", theme.gridFill)
      .attr("stroke", theme.mainStrokeColor)
      .attr("stroke-width", theme.outerBorderWidth)
      .selectAll("path")
      .data((dataValue) =>
        d3.timeMonths(new Date(dataValue, 0, 1), new Date(dataValue + 1, 0, 1)),
      )
      .enter()
      .append("path")
      .attr("class", "month")
      .attr("d", function (dataValue) {
        const t1 = new Date(
            dataValue.getFullYear(),
            dataValue.getMonth() + 1,
            0,
          ),
          d0 = dataValue.getDay(),
          w0 = d3.timeWeek.count(d3.timeYear(dataValue), dataValue),
          d1 = t1.getDay(),
          w1 = d3.timeWeek.count(d3.timeYear(t1), t1);
        return `M${(w0 + 1) * theme.cellSize}, ${d0 * theme.cellSize}H${
          w0 * theme.cellSize
        }V${7 * theme.cellSize}H${w1 * theme.cellSize}V${
          (d1 + 1) * theme.cellSize
        }H${(w1 + 1) * theme.cellSize}V0H${(w0 + 1) * theme.cellSize}Z`;
      });

    // Create the x axis
    svg
      .append("g")
      .attr("id", "x-axis")
      .call(
        d3
          .axisTop(
            d3
              .scaleBand()
              .domain(MONTHS)
              .range([0, theme.width - 50]),
          )
          .tickPadding(5),
      )
      .selectAll("path")
      .attr("stroke", "transparent");

    // Create year labels for the y axis
    svg
      .append("text")
      .attr("transform", `translate(-10, ${theme.cellSize * 3.5})rotate(-90)`)
      .attr("class", "yearLabel")
      .attr("text-anchor", "middle")
      .attr("fill", theme.mainStrokeColor)
      .text((dataValue) => dataValue);

    /** Creates a tooltip. */
    const tooltip = d3
      .select(this.chartContainer)
      .append("div")
      .attr("class", "tooltip")
      .style("display", "none");

    // Check if there's a filled in day and then attach event handlers to it.*/
    this.chartContainer.querySelectorAll(".day").forEach((day) => {
      if (day.hasAttribute("fill")) {
        d3.select(day)
          .on("mouseover", (evt) => {
            const date = d3.select(evt.target).datum();
            d3.select(this).attr("stroke-width", theme.hoverStrokeWidth);
            tooltip.style("display", "block").html(
              `<b>Date:</b> ${date}
							<br>
							<b>Time:</b> ${data.get(date)}`,
            );

            const rect = this.tooltipElement.getBoundingClientRect();
            const left =
              evt.pageX > window.innerWidth - rect.width
                ? evt.pageX - rect.width
                : evt.pageX + 10;
            const top = evt.pageY - 10;

            tooltip.style("top", top + "px").style("left", left + "px");
          })
          .on("mouseout", function () {
            d3.select(this).attr("stroke-width", theme.defaultStrokeWidth);
            tooltip.style("display", "none");
          });
      }
    });
  }

  _initChart() {
    this.#createHeatmap(this.#values);
  }
}

window.customElements.define("calendar-heatmap", CalendarHeatmap);
