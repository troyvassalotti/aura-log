/** @format */

import * as d3 from "d3";
import {css} from "lit";
import {MONTHS} from "../lib/utils.js";
import Chart from "./Chart.js";

/**
 * @tag heat-map
 * @summary Displays a calendar heatmap.
 */
export default class Heatmap extends Chart {
	static properties = {
		theme: {type: String},
	};

	static styles = [
		super.styles,
		css`
			:host {
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

	/**
	 * The earliest and latest + 1 year of the dataset.
	 * @returns {{start: number, end: number}}
	 */
	get range() {
		const firstYear = new Date(this.data[0].date).getUTCFullYear();
		const lastYear = new Date(
			this.data[this.data.length - 1].date,
		).getUTCFullYear();

		return {
			start: firstYear,
			end: lastYear + 1,
		};
	}

	/**
	 * Tooltip Element
	 * @type {HTMLElement}
	 */
	get tooltipElement() {
		return this.renderRoot?.querySelector(".tooltip");
	}

	/**
	 * Theme for the chart based on the theme prop.
	 * @param {string} theme
	 * @returns {string[]} Color palette.
	 */
	static selectTheme(theme) {
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

	static prepareData(rawData) {
		return rawData.map((value) => {
			const {date} = value;
			const dateObject = new Date(date);
			const iso = dateObject.toISOString();
			const yyyymmdd = iso.substring(0, 10);
			const time = iso.substring(11, 16);
			const intlDate = new Intl.DateTimeFormat(undefined, {
				day: "numeric",
				month: "long",
				weekday: "long",
				year: "numeric",
				hour: "numeric",
				minute: "numeric",
			});

			return {
				yyyymmdd,
				time,
				date: dateObject,
				dateString: intlDate.format(dateObject),
			};
		});
	}

	/**
	 * Use D3 to create a heatmap from the component's values.
	 * @param data
	 * @private
	 */
	createHeatmap(raw) {
		const data = Heatmap.prepareData(raw);
		const theme = {
			cellSize: 17,
			colorPalette: Heatmap.selectTheme(this.theme),
			defaultStrokeWidth: "0.1px",
			gridFill: "none",
			height: 150,
			hoverStrokeWidth: "1px",
			mainStrokeColor: "currentColor",
			outerBorderWidth: "1px",
			width: 960,
		};

		/** Color scale used for highlighting days. */
		const color = d3.scaleQuantize().domain([0, 23]).range(theme.colorPalette);

		// Creates the containing `<svg>` and outer `<g>` for each year
		const svg = d3
			.select(this.chartContainer)
			.selectAll("svg")
			.data(d3.range(this.range.start, this.range.end))
			.enter()
			.append("svg")
			.attr("viewBox", `0 0 ${theme.width} ${theme.height}`)
			.attr("class", "calendar")
			.append("g")
			.attr(
				"transform",
				`translate(${(theme.width - theme.cellSize * (365 / 7)) / 2}, ${
					theme.height - theme.cellSize * 7 - 1
				})`,
			);

		// Creates the months & rectangles representing days in each calendar
		svg
			.append("g")
			.attr("fill", theme.gridFill)
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
			)
			.attr("y", (dataValue) => dataValue.getDay() * theme.cellSize)
			.datum(d3.timeFormat("%Y-%m-%d"))
			.attr("fill", (dataValue) => {
				const found = data.find((entry) => entry.yyyymmdd == dataValue);

				if (!found) {
					return undefined;
				}

				return color(found.date.getHours());
			});

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
				);
				const d0 = dataValue.getDay();
				const w0 = d3.timeWeek.count(d3.timeYear(dataValue), dataValue);
				const d1 = t1.getDay();
				const w1 = d3.timeWeek.count(d3.timeYear(t1), t1);

				return `M${
					(w0 + 1) * theme.cellSize
				}, ${d0 * theme.cellSize}H${w0 * theme.cellSize}V${7 * theme.cellSize}H${w1 * theme.cellSize}V${(d1 + 1) * theme.cellSize}H${(w1 + 1) * theme.cellSize}V0H${(w0 + 1) * theme.cellSize}Z`;
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
					.on("mouseover", (event) => {
						const date = d3.select(event.target).datum();
						const pointDate = data.find((entry) => entry.yyyymmdd === date);

						tooltip.style("display", "block");
						tooltip.html(pointDate.dateString
						);

						const rect = this.tooltipElement.getBoundingClientRect();
						const left =
							event.pageX > window.innerWidth - rect.width
								? event.pageX - rect.width
								: event.pageX + 10;
						const top = event.pageY - 10;

						tooltip.style("top", top + "px").style("left", left + "px");
					})
					.on("mouseout", function () {
						tooltip.style("display", "none");
					});
			}
		});
	}

  /** @override */
	init() {
		this.createHeatmap(this.data);
	}
}

window.customElements.define("heat-map", Heatmap);
