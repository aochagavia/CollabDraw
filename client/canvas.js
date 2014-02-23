var MakeLine = function(firstX, firstY, graphics) {
    var that = {
        points: [],
        addPoint: function(p) {
            that.points.push(p);
            that.draw();
        },
        draw: function() {
            drawLine(that, graphics);
        }
    };

    that.addPoint(MakePoint(firstX, firstY));
    return that;
};

var drawLine = function(line, graphics) {
    var lineWidth = 5;
    if (line.points.length > 0) {
        // Draw a dot in the first and last point
        graphics.beginPath();
        graphics.arc(line.points[0].x, line.points[0].y, lineWidth / 2, 0, 2 * Math.PI, false);
        graphics.arc(line.points[line.points.length - 1].x, line.points[line.points.length - 1].y, lineWidth / 2, 0, 2 * Math.PI, false);
        graphics.fill();

        // Prepare to draw lines between points
        graphics.beginPath();
        graphics.lineWidth = lineWidth;
        graphics.moveTo(line.points[0].x, line.points[0].y);
    }

    // Draw the lines
    for (var i = 1; i < line.points.length; i++) {
        graphics.lineTo(line.points[i].x, line.points[i].y);
    }

    graphics.lineJoin = 'round';
    graphics.stroke();
};

var MakePoint = function(x, y) {
    return { 'x': x, 'y': y };
};

var MakeDrawCanvas = function() {
    var canvas = document.getElementById('draw-canvas');

    canvas.width = 500;
    canvas.height = 500;

    var mouseDown = false;
    var currentLine;

    window.addEventListener('mouseup', function() {
        mouseDown = false;
        if (currentLine)
            app.sendLine(currentLine);
        currentLine = null;
    });

    $(canvas).mousemove(function(evt) {
        if (mouseDown) {
            var point = MakePoint(evt.offsetX, evt.offsetY);
            currentLine.addPoint(point);
        }
    });

    $(canvas).mousedown(function(evt) {
        currentLine = MakeLine(evt.offsetX, evt.offsetY, canvas.getContext('2d'));
        mouseDown = true;
    });

    var that = {
        clear: function(evt) {
            lines = [];
        },
        addLine: function(line) {
            drawLine(line, canvas.getContext('2d'));
        },
        addLines: function(line) {
            for (var i = 0; i < lines.length; i++)
                drawLine(lines[i], canvas.getContext('2d'));
        }
    };

    app.on('receive:line', function(data) {
        drawLine(data.line, canvas.getContext('2d'));
    });

    app.on('receive:lines', function(data) {
        for (var i = 0; i < data.lines.length; i++)
            if (data.lines[i])
                drawLine(data.lines[i], canvas.getContext('2d'));
    });

    app.on('deleted:lines', function() {
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    });

    return that;
};