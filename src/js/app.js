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
var roundedX;
var roundedY;
var grid = 15;
var gridSnapping = false;

$(window).load(() => {
    prototypefabric.initCanvas();

    // insert background image
    $("#urlField").change(() => {
        fabric.Image.fromURL($("#urlField").val(), img => {
            canvas.setWidth(img.width);
            canvas.setHeight(img.height);
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {});
        })
    });

    $('html').keydown(e => {
        if (e.keyCode === 46 || e.keyCode === 8) {
            funcDel()
        } else if (e.keyCode === 78) {
            funcPoly();
        } else if (e.keyCode === 80) {
            funcPrefix();
        } else if (e.keyCode === 73) {
            funcIncrement();
        } else if (e.keyCode === 16) {
            gridSnapping = true;
        }
    });

    $('html').keyup(e => {
        if (e.keyCode === 16) {
            gridSnapping = false;
        }
    });

    // init drawing
    function funcPoly() {
        prototypefabric.polygon.drawPolygon();
    };
    $('#new').click(() => {
        funcPoly()
    });

    // delete polygon
    function funcDel() {
        while (canvas.getActiveObjects().length > 0) {
            canvas.remove(canvas.getActiveObject()); // remove if there is only one object
            canvas.remove(canvas.getActiveObjects()[0]); // remove if there is multiple objects
        }
    }

    // prefix
    function funcPrefix() {
        prefix = window.prompt("Input an area label prefix (e.g. 'A'):");
    };
    $('#set-prefix').click(() => {
        funcPrefix()
    });

    // increment
    function funcIncrement() {
        increment = parseInt(window.prompt("Input a value to incrementate by (e.g. '1' or '-1'):"));
        startValue = parseInt(window.prompt("Input an integer start value (e.g. '5'):"));
    };
    $('#set-increment').click(() => {
        funcIncrement(0);
    });

    // export JSON for 5eTools
    function funcExport() {
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

    }
    $("#export").click(() => {
        funcExport();
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
            var pointer = canvas.getPointer(options.e);

            if (gridSnapping === true) {
                roundedX = Math.ceil(pointer.x / grid) * grid
                roundedY = Math.ceil(pointer.y / grid) * grid
            } else {
                roundedX = pointer.x
                roundedY = pointer.y
            }
            if (activeLine && activeLine.class == "line") {
                activeLine.set({ x2: roundedX, y2: roundedY });

                var points = activeShape.get("points");
                points[pointArray.length] = {
                    x: roundedX,
                    y: roundedY
                }
                activeShape.set({
                    points: points
                });
                canvas.renderAll();
            }
            canvas.renderAll();
        });

        canvas.on('object:moving', options => {
            if (gridSnapping === true) {
                options.target.set({
                    left: Math.round(options.target.left / grid) * grid,
                    top: Math.round(options.target.top / grid) * grid
                });
            }
        });

        canvas.on('mouse:wheel', options => {
            var delta = options.e.deltaY;
            var zoom = canvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 20) zoom = 20;
            if (zoom < 0.01) zoom = 0.01;
            canvas.setZoom(zoom);
            options.e.preventDefault();
            options.e.stopPropagation();
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
        var pointer = canvas.getPointer(options.e);

        if (gridSnapping === true) {
            roundedX = Math.ceil(options.e.layerX / grid) * grid;
            roundedY = Math.ceil(options.e.layerY / grid) * grid;
        } else {
            roundedX = pointer.x
            roundedY = pointer.y
        }

        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var id = new Date().getTime() + random;
        var circle = new fabric.Circle({
            radius: 5,
            fill: '#ffffff',
            stroke: '#333333',
            strokeWidth: 0.5,
            left: (roundedX / canvas.getZoom()),
            top: (roundedY / canvas.getZoom()),
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
        var points = [(roundedX / canvas.getZoom()), (roundedY / canvas.getZoom()), (roundedX / canvas.getZoom()), (roundedY / canvas.getZoom())];
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
            var points = activeShape.get("points");
            points.push({
                x: roundedX,
                y: roundedY
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
            var polyPoint = [{ x: (roundedX / canvas.getZoom()), y: (roundedY / canvas.getZoom()) }];
            var polygon = new fabric.Polygon(polyPoint, {
                stroke: '#337ab7',
                strokeWidth: 2,
                fill: '#337ab7',
                opacity: 0.4,
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
            startValue = startValue + parseInt(increment);
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
