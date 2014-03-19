/**
 * Oxymoronic Candlestick
 *
 * Author: Roland Banguiran
 * Email: rolandsb@phillip.com.sg
 */
 
(function (H) {
    'use strict';
    var each = H.each,
        merge = H.merge;

    H.wrap(H.Series.prototype, 'render', function (proceed) {
       
        // Run the original proceed method
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        
        var series = this,
            chart = series.chart,
            backgroundColor = chart.options.chart.backgroundColor || '#ffffff',
            points = series.points,
            options = series.options,
            type = options.type,
            defaultOptions = {
                enable: true,
                upColor: '#00ff00',
                downColor: '#ff0000'
            };
        
        options.custom = options.custom || {};
        options.custom = merge(options.custom, defaultOptions);
        
        if (type === 'candlestick' || type === 'ohlc') {
        
            each(points, function (point, i) {
                var open = point.open,
                    close = point.close,
                    isFirstPoint = (i === 0) ? true : false,
                    prevClose = !isFirstPoint ? points[i - 1].close : null,
                    graphic = point.graphic,
                    attribute = point.pointAttr,
                    custom = options.custom,
                    upColor = custom.upColor,
                    downColor = custom.downColor,
                    isDayUp,
                    isEqual,
                    isCloseUp,
                    strokeColor,
                    fillColor,
                    prevStrokeColor = !isFirstPoint ? points[i - 1].graphic.stroke : null;
                
                isCloseUp = close > open;
                isEqual = close === prevClose;
                isDayUp = isFirstPoint ? isCloseUp : close > prevClose;
                
                strokeColor = !isEqual ? (isDayUp ? upColor : downColor) : prevStrokeColor;
                fillColor = strokeColor === upColor ? (isCloseUp ? backgroundColor : strokeColor) : (isCloseUp ? backgroundColor : strokeColor);
                
                // replace default attributes
                point.pointAttr = merge(attribute, {
                    '': {
                        stroke: strokeColor,
                        fill: fillColor
                    },
                    hover: {
                        stroke: strokeColor,
                        fill: fillColor
                    },
                    select: {
                        stroke: strokeColor,
                        fill: fillColor
                    }
                });
                
                // update SVG elements color attribute
                graphic.attr('stroke', strokeColor);
                graphic.attr('fill', fillColor);
            });
        }   
    });
}(Highcharts));
