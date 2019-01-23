/**
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */
L.drawVersion = '0.4.2';
/**
 * @class L.Draw
 * @aka Draw
 *
 *
 * To add the draw toolbar set the option drawControl: true in the map options.
 *
 * @example
 * ```js
 *      var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 * ```
 *
 * ### Adding the edit toolbar
 * To use the edit toolbar you must initialise the Leaflet.draw control and manually add it to the map.
 *
 * ```js
 *      var map = L.map('map').setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 *
 *      // FeatureGroup is to store editable layers
 *      var drawnItems = new L.FeatureGroup();
 *      map.addLayer(drawnItems);
 *
 *      var drawControl = new L.Control.Draw({
 *          edit: {
 *              featureGroup: drawnItems
 *          }
 *      });
 *      map.addControl(drawControl);
 * ```
 *
 * The key here is the featureGroup option. This tells the plugin which FeatureGroup contains the layers that
 * should be editable. The featureGroup can contain 0 or more features with geometry types Point, LineString, and Polygon.
 * Leaflet.draw does not work with multigeometry features such as MultiPoint, MultiLineString, MultiPolygon,
 * or GeometryCollection. If you need to add multigeometry features to the draw plugin, convert them to a
 * FeatureCollection of non-multigeometries (Points, LineStrings, or Polygons).
 */
L.Draw = {};

/**
 * @class L.drawLocal
 * @aka L.drawLocal
 *
 * The core toolbar class of the API — it is used to create the toolbar ui
 *
 * @example
 * ```js
 *      var modifiedDraw = L.drawLocal.extend({
 *          draw: {
 *              toolbar: {
 *                  buttons: {
 *                      polygon: 'Draw an awesome polygon'
 *                  }
 *              }
 *          }
 *      });
 * ```
 *
 * The default state for the control is the draw toolbar just below the zoom control.
 *  This will allow map users to draw vectors and markers.
 *  **Please note the edit toolbar is not enabled by default.**
 */
L.drawLocal = {
	// format: {
	// 	numeric: {
	// 		delimiters: {
	// 			thousands: ',',
	// 			decimal: '.'
	// 		}
	// 	}
	// },
	draw: {
		toolbar: {
			// #TODO: this should be reorganized where actions are nested in actions
			// ex: actions.undo  or actions.cancel
			actions: {
				title: '取消标绘',
				text: '取消'
			},
			finish: {
				title: '完成标绘',
				text: '完成'
			},
			undo: {
				title: '删除上一节点',
				text: '删除上一节点'
			},
			buttons: {
				polyline: '折线',
				polygon: '多边形',
				rectangle: '矩形',
				circle: '圆形',
				marker: '定位',
				circlemarker: '圆点',
				fine_arrow: '直行',
				attack_arrow:'进攻',
				double_arrow:'夹击',
				straight_arrow:'细箭头',
				arc:'弧线',
				curve:'曲线',
				closed_curve:'曲线面',
				gathering_place:'聚集地',
				lune:'弓形',
				ellipse:'椭圆',
				assault_arrow:'突击',
				sector:'扇形',
				squad_arrow:'战斗',
				tailed_attack_arrow:'燕尾进攻',
				tailed_squad_arrow:'燕尾战斗',
				flowline:'迁徙'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: '点击并拖动以标绘圆形'
				},
				radius: '半径'
			},
			circlemarker: {
				tooltip: {
					start: '点击以标绘圆点'
				}
			},
			marker: {
				tooltip: {
					start: '点击以标绘定位标识'
				}
			},
			polygon: {
				tooltip: {
					start: '点击以开始标绘',
					cont: '点击以增加下一节点',
					end: '点击起始标绘点以结束标绘'
				}
			},
			polyline: {
				error: '<strong>Error:</strong> 边界不可交叉!',
				tooltip: {
					start: '点击以开始标绘',
					cont: '点击以增加下一节点',
					end: '双击以结束标绘'
				}
			},
			rectangle: {
				tooltip: {
					start: '点击并拖动以标绘矩形'
				}
			},
			simpleshape: {
				tooltip: {
					end: '点击释放以结束标绘'
				}
			},
			double_arrow: {
				tooltip: {
					start: '点击以开始标绘',
					cont: '点击以增加下一节点或双击结束',
					end: '点击以结束标绘'
				}
			},
			
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: '保存更改',
					text: '保存'
				},
				cancel: {
					title: '取消所有变更',
					text: '取消'
				},
				clearAll: {
					title: '清除所有要素',
					text: '清除所有'
				}
			},
			buttons: {
				edit: '编辑要素',
				editDisabled: '无要素可编辑',
				remove: '删除要素',
				removeDisabled: '无要素可删除'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: '拖拽方形标识以编辑要素',
					subtext: '点击取消以撤销编辑'
				}
			},
			remove: {
				tooltip: {
					text: '点击要素以删除'
				}
			}
		}
	}
};
