/** @format */

import Highcharts from "highcharts";
import Accessibility from "highcharts/modules/accessibility";
import Histogram from "highcharts/modules/histogram-bellcurve";
import Dashboards from "@highcharts/dashboards";
import DataGrid from "@highcharts/dashboards/datagrid";
import LayoutModule from "@highcharts/dashboards/modules/layout";
import highchartsCSS from "highcharts/css/highcharts.css?inline";
import dashboardsCSS from "@highcharts/dashboards/css/dashboards.css?inline";
import datagridCSS from "@highcharts/dashboards/css/datagrid.css?inline";
import Chart from "./Chart.js";
import {unsafeCSS} from "lit";

Accessibility(Highcharts);
Histogram(Highcharts);

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.DataGridPlugin.custom.connectDataGrid(DataGrid);

Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);
Dashboards.PluginHandler.addPlugin(Dashboards.DataGridPlugin);

LayoutModule(Dashboards);

export default class Dashboard extends Chart {
	static get styles() {
		console.log(highchartsCSS);
		return [
			super.styles,
			unsafeCSS(highchartsCSS),
			unsafeCSS(dashboardsCSS),
			unsafeCSS(datagridCSS),
		];
	}

	/** @override */
	init() {
		const csvData = document.getElementById("csv").innerText;

		Dashboards.board(
			this.chartContainer,
			{
				dataPool: {
					connectors: [
						{
							id: "sample",
							type: "CSV",
							options: {
								csv: csvData,
								firstRowAsNames: true,
							},
						},
					],
				},

				gui: {
					layouts: [
						{
							id: "layout-1",
							rows: [
								{
									cells: [
										{
											id: "db-col-0-nolayout",
										},
										{
											id: "db-col-1-layout",
											layout: {
												rows: [
													{
														cells: [
															{
																id: "db-col-1-row-0",
															},
														],
													},
													{
														cells: [
															{
																id: "db-col-1-row-1A",
																width: "1/3",
															},
															{
																id: "db-col-1-row-1B-layout",
																layout: {
																	rows: [
																		{
																			cells: [
																				{
																					id: "db-col-1-row-1B-row-0",
																				},
																			],
																		},
																		{
																			cells: [
																				{
																					id: "db-col-1-row-1B-row-1A",
																				},
																				{
																					id: "db-col-1-row-1B-row-1B",
																				},
																			],
																		},
																	],
																},
															},
														],
													},
													{
														cells: [
															{
																id: "db-col-1-row-2",
															},
														],
													},
												],
											},
										},
										{
											id: "db-col-2-nolayout",
										},
									],
								},
							],
						},
					],
				},
				components: [
					{
						renderTo: "db-col-0-nolayout",
						type: "Highcharts",
						connector: {
							id: "sample",
						},
						sync: {
							highlight: true,
						},
						title: {
							text: "Column 0",
						},
						chartOptions: {
							xAxis: {
								type: "category",
							},
							title: {
								text: "",
							},
							chart: {
								type: "column",
							},
						},
					},
					{
						renderTo: "db-col-1-row-0",
						type: "HTML",

						title: {
							text: "Column 1",
						},
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "1 x nested",
							},
						],
					},
					{
						renderTo: "db-col-1-row-1A",
						type: "HTML",
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "1 x nested",
							},
						],
					},
					{
						renderTo: "db-col-1-row-1B-row-0",
						type: "HTML",
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "2 x nested",
							},
						],
					},
					{
						renderTo: "db-col-1-row-1B-row-1A",
						type: "HTML",
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "2 x nested",
							},
						],
					},
					{
						renderTo: "db-col-1-row-1B-row-1B",
						type: "HTML",
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "2 x nested",
							},
						],
					},

					{
						renderTo: "db-col-1-row-2",
						type: "HTML",
						elements: [
							{
								tagName: "p",
								style: {
									"text-align": "center",
								},
								textContent: "1 x nested",
							},
						],
					},
					{
						renderTo: "db-col-2-nolayout",
						type: "DataGrid",
						connector: {
							id: "sample",
						},
						title: {
							text: "Column 2",
						},
						sync: {
							highlight: true,
						},
					},
				],
			},
			true,
		);
	}
}

window.customElements.define("dash-board", Dashboard);
