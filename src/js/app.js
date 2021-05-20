var min = 99;
var max = 999999;
var polygonMode = true;
var pointArray = new Array();
var lineArray = new Array();
var activeLine;
var activeShape = false;
var canvas;
var prefix = "";
var increment = 0;
var startValue = null;

$(window).load(() => {
    prototypefabric.initCanvas();

    // init drawing
    $('#create-polygon').click(() => {
        prototypefabric.polygon.drawPolygon();
    });

    $('#set-prefix').click(() => {
        prefix = window.prompt("Input an area label prefix (e.g. 'A'):");
    });

    $('#set-increment').click(() => {
        increment = window.prompt("Input a value to incrementate by (e.g. '1' or '-1'):");
        startValue = window.prompt("Input an integer start value (e.g. '5'):");
    });

    // export JSON for 5eTools
    $("#export").click(() => {
        var area = ""
        var exportData = {
            "mapRegions": []
        }

        var allJSON = canvas.toJSON().objects

        for (var i = 0; i < allJSON.length; i++) {
            exportData.mapRegions.push({
                "area": area,
                "points": []
            })

            // get polygon points
            allJSON[i].objects[0].points.forEach(point => {
                exportData.mapRegions[i].points.push([point.x, point.y])
            })

            // get area label
            exportData.mapRegions[i].area = allJSON[i].objects[1].text
        };
        window.prompt("Copy this to your clipboard", JSON.stringify(exportData))
    });
});

var prototypefabric = new function () {
    this.initCanvas = () => {
        canvas = window._canvas = new fabric.Canvas('c');
        canvas.selection = false;

        canvas.on('mouse:down', options => {
            if (options.target && options.target.id == pointArray[0].id) {
                prototypefabric.polygon.generatePolygon(pointArray);
            }
            if (polygonMode) {
                prototypefabric.polygon.addPoint(options);
            }
        });

        canvas.on('mouse:move', options => {
            if (activeLine && activeLine.class == "line") {
                var pointer = canvas.getPointer(options.e);
                activeLine.set({ x2: pointer.x, y2: pointer.y });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x: pointer.x,
                    y: pointer.y
                }
                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }
            canvas.renderAll();
        });
    };
};

prototypefabric.polygon = {
    drawPolygon: () => {
        polygonMode = true;
        pointArray = new Array();
        lineArray = new Array();
        activeLine;
    },
    addPoint: options => {
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id = new Date().getTime() + random;
        var circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (options.e.layerX / canvas.getZoom()),
            top: (options.e.layerY / canvas.getZoom()),
            selectable: false,
            hasBorders: false,
            hasControls: false,
            originX: 'center',
            originY: 'center',
            id: id,
            objectCaching: false
        });
        if (pointArray.length == 0) {
            circle.set({
                fill: 'red'
            })
        }
        var points = [(options.e.layerX / canvas.getZoom()), (options.e.layerY / canvas.getZoom()), (options.e.layerX / canvas.getZoom()), (options.e.layerY / canvas.getZoom())];
        var line = new fabric.Line(points, {
            strokeWidth: 2,
            fill: '#999999',
            stroke: '#999999',
            class: 'line',
            originX: 'center',
            originY: 'center',
            selectable: false,
            hasBorders: false,
            hasControls: false,
            evented: false,
            objectCaching: false
        });
        if (activeShape) {
            var pos = canvas.getPointer(options.e);
            var points = activeShape.get("points");
            points.push({
                x: pos.x,
                y: pos.y
            });
            var polygon = new fabric.Polygon(points, {
                stroke: '#333333',
                strokeWidth: 1,
                fill: '#cccccc',
                opacity: 0.3,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                objectCaching: false
            });
            canvas.remove(activeShape);
            canvas.add(polygon);
            activeShape = polygon;
            canvas.renderAll();
        }
        else {
            var polyPoint = [{ x: (options.e.layerX / canvas.getZoom()), y: (options.e.layerY / canvas.getZoom()) }];
            var polygon = new fabric.Polygon(polyPoint, {
                stroke: '#337ab7',
                strokeWidth: 2,
                fill: '#337ab760',
                opacity: 0.5,
                selectable: false,
                hasBorders: false,
                hasControls: false,
                evented: false,
                objectCaching: false
            });
            activeShape = polygon;
            canvas.add(polygon);
        }
        activeLine = line;

        pointArray.push(circle);
        lineArray.push(line);

        canvas.add(line);
        canvas.add(circle);
        canvas.selection = false;
    },
    generatePolygon: pointArray => {
        var points = new Array();
        $.each(pointArray, (index, point) => {
            points.push({
                x: point.left,
                y: point.top
            });
            canvas.remove(point);
        });
        $.each(lineArray, (index, line) => {
            canvas.remove(line);
        });
        canvas.remove(activeShape).remove(activeLine);

        // create polygon from points
        var polygon = new fabric.Polygon(points, {
            stroke: '#337ab7',
            strokeWidth: 2,
            fill: '#337ab760',
            opacity: 1,
            hasBorders: true,
            hasControls: true
        });

        // prompt for area label if increment is not set
        var area;
        if (increment === 0) {
            area = prefix + window.prompt("What area is this?");
        } else {
            area = prefix + startValue;
            startValue = startValue + increment
        };

        // draw in middle
        var label = new fabric.Text(area, {
            left: polygon.left + polygon.width / 2,
            top: polygon.top + polygon.height / 2
        });

        // group and render
        var group = new fabric.Group([polygon, label], {})
        canvas.add(group)

        activeLine = null;
        activeShape = null;
        polygonMode = false;
        canvas.selection = true;
    }
};